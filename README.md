# VunaLink Tomato

**VunaLink Tomato** is a tomato-focused fork of [VunaLink](https://github.com/godson-pius/vunalink), a mobile-first Progressive Web App for Rwandan smallholder farmers. A farmer captures or chooses a leaf photo, a lightweight model runs on the device with no internet, and the app returns the likely tomato disease with simple guidance in Kinyarwanda and English. If the photo is not a tomato leaf, or the model is unsure, the app asks for a new photo instead of guessing.

> **Credits.** VunaLink was created by [godson-pius](https://github.com/godson-pius). The app, offline architecture, machine-learning pipeline and original Kinyarwanda guidance come from the [original repository](https://github.com/godson-pius/vunalink). This fork narrows the model to tomato, adds rejection of non-tomato images, and extends guidance to all ten PlantVillage tomato classes. It was produced as part of an IEEE Elevate mentorship project.

## What changed in this fork

Compared with the original repository (commit `140c443`):

1. **Data source.** Images now come from the PlantVillage GitHub copy ([spMohanty/PlantVillage-Dataset](https://github.com/spMohanty/PlantVillage-Dataset), `raw/color`) instead of `ml/download_plantvillage.py`, which failed to download. The GitHub copy's folder names match the config. The original download script used different names, which is why corn was silently dropped before.
2. **`ml/class_config.json`.** Potato and corn are removed. It now has 11 classes: `Not_tomato` plus all 10 PlantVillage tomato classes.
3. **New `ml/build_not_tomato.py`.** This script builds the `Not_tomato` class from three sources: images of every other crop in the dataset, optional extra photos you add (cassava, everyday photos), and generated non-leaf images.
4. **`ml/train.py`.** Training now balances rare and common classes, so mosaic virus (373 images) isn't drowned out by yellow leaf curl virus (5,357 images). The model version is bumped to 0.3.0.
5. **Retrained model, now in the app.** `public/models/vunalink-mobilenet-v2.onnx`, `class_mapping.json` and `model_metadata.json` were replaced with the new 11-class model, along with its training outputs in `ml/artifacts/`.
6. **`lib/ml/labels.ts`.** The class list is replaced with the 11 classes in training order. Two settings are added: `REJECT_DISEASE_ID` (`not_tomato`) and `MIN_CONFIDENCE` (0.7).
7. **`lib/ml/postprocess.ts` and `lib/ml/types.ts`.** There's a new "rejected" result for when the model picks `Not_tomato` or is less than 70% confident, instead of always naming a disease.
8. **`components/crop-image-picker.tsx`.** A rejected scan now shows a "retake a clear photo of a single tomato leaf" message, in Kinyarwanda or English.
9. **`lib/localization/disease-info.ts`.** Kinyarwanda names and guidance are added for the 7 new diseases. The two viruses and spider mites get their own advice, plus English versions.
10. **`lib/recommendations/knowledge-base.ts`.** Recommendation entries are added for the 7 new diseases.
11. **`lib/ml/model.ts`.** The app's model version is now 0.3.0, which is shown on results and saved in History.
12. **`public/sw.js`.** The offline cache name changed from `vunalink-shell-v3` to `vunalink-shell-v5`, so phones that installed the app download the new model instead of keeping the old one.
13. **`tests/critical.test.ts`.** The tests are updated for 11 classes. New tests check the rejection behaviour and that every class the model can return has guidance. All 7 tests pass.

## Features

- Camera capture and image upload for JPG, PNG, and WebP files.
- Local tomato-disease classification in the browser, trained on PlantVillage.
- Rejection of non-tomato and unclear images ("retake photo") instead of a forced guess.
- Kinyarwanda disease names and guidance, with English versions.
- Offline agricultural recommendations from a bundled knowledge base.
- Diagnosis history stored privately on the device.
- Installable PWA with a service worker and local ONNX Runtime Web assets.
- Optional LLM boundary exists in `lib/ai/`, but no LLM is installed or required.

## Architecture

```text
User → Next.js PWA → image validation and resize → MobileNetV2 ONNX
     → local ONNX Runtime Web / WebAssembly inference → class probabilities
     → rejection check (Not_tomato or confidence < 0.7 → "retake photo")
     → local recommendation knowledge base → Kinyarwanda / English result and guidance
```

The model only predicts classes. Recommendations are separate from inference and do not require a language model.

## Offline architecture

The service worker (`public/sw.js`) precaches the core routes, manifest, model, and ONNX Runtime Web assets during installation. Successful same-origin application responses are also cached for later navigation. External requests are not handled by the service worker. Change the cache name in `public/sw.js` whenever the model is replaced, so installed apps pick up the new model.

Diagnosis records are stored in an IndexedDB database named `vunalink`, in the `diagnoses` object store. Records contain prediction metadata only; original crop images are not persisted. History can be viewed and cleared offline.

Install the app or visit required routes once while online so service-worker caching can complete. Browser support and storage quotas vary by device.

## Machine-learning model

The browser model is `public/models/vunalink-mobilenet-v2.onnx`, version `0.3.0`. It is a MobileNetV2 transfer-learning classifier trained on PlantVillage images and executed with `onnxruntime-web`.

- Input: `224 × 224 × 3`, RGB, `float32`, NHWC.
- Output: 11 `float32` softmax probabilities.
- Browser preprocessing: resize to 224 × 224, read RGB pixels, and pass raw values in NHWC order. The MobileNetV2 formula `(pixel / 127.5) - 1` is embedded in the graph and must not be applied again.
- Classes, in model order:

  | ID | Class | ID | Class |
  |---|---|---|---|
  | 0 | Not tomato (rejected) | 6 | Spider mites |
  | 1 | Bacterial spot | 7 | Target spot |
  | 2 | Early blight | 8 | Yellow leaf curl virus |
  | 3 | Late blight | 9 | Mosaic virus |
  | 4 | Leaf mold | 10 | Healthy |
  | 5 | Septoria leaf spot | | |

- Rejection: a scan is rejected if the top class is `Not_tomato` or its probability is below `MIN_CONFIDENCE` (0.7, set in `lib/ml/labels.ts`).
- Metadata and mapping: `public/models/model_metadata.json` and `public/models/class_mapping.json`. Test-set results are in `ml/artifacts/evaluation.json`.

PlantVillage evaluation does not represent accuracy on real Rwandan field images, so no production field-accuracy claim is made.

## Run the app

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

```bash
npm test
npm run lint
npm run build
npx tsc --noEmit   # run after a build or dev run, which generate Next.js types
```

## Retrain the model

Requires Python 3.11 and Git. Commands are shown for Windows PowerShell; on macOS/Linux use `source .venv/bin/activate` and forward slashes.

```powershell
# 1. Python environment
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r ml\requirements.txt

# 2. Dataset (~700 MB of colour images), copied into ml\data\plant_village
git clone --depth 1 --filter=blob:none --sparse https://github.com/spMohanty/PlantVillage-Dataset ..\PlantVillage-Dataset
git -C ..\PlantVillage-Dataset sparse-checkout set raw/color
robocopy ..\PlantVillage-Dataset\raw\color ml\data\plant_village /E

# 3. Build the Not_tomato class (add --extra-dir <folder> for cassava or everyday photos)
python ml\build_not_tomato.py --source-dir ml\data\plant_village --target 4000 --synthetic 300

# 4. Split (always delete the old split first), train, and export
Remove-Item -Recurse -Force ml\data\split -ErrorAction SilentlyContinue
python ml\prepare_dataset.py --source-dir ml\data\plant_village --output-dir ml\data\split
python ml\train.py --data-dir ml\data\split --output-dir ml\artifacts
python ml\export_onnx.py --saved-model ml\artifacts\model.keras --output ml\artifacts\vunalink-mobilenet-v2.onnx

# 5. Install the model in the app
Copy-Item ml\artifacts\vunalink-mobilenet-v2.onnx, ml\artifacts\class_mapping.json, ml\artifacts\model_metadata.json public\models\ -Force
```

If you change the class list, update `lib/ml/labels.ts` to match `class_mapping.json` exactly, add guidance for any new class in `lib/localization/disease-info.ts` and `lib/recommendations/knowledge-base.ts`, and change the cache name in `public/sw.js`. More detail on the pipeline is in [`ml/README.md`](ml/README.md).

## Project structure

```text
app/                  Next.js pages, layout, manifest, service-worker registration
components/           Reusable UI, navigation, image picker, install prompt
lib/ml/               Model loading, preprocessing, inference, labels, rejection, postprocessing
lib/history/          IndexedDB diagnosis history
lib/image/            Shared image validation rules
lib/localization/     Kinyarwanda and English disease information
lib/recommendations/  Offline agricultural guidance
public/models/        ONNX model and metadata
public/onnxruntime/   Local ONNX Runtime Web assets
ml/                   Dataset preparation, Not_tomato builder, training, evaluation, and export scripts
tests/                Critical application behavior tests
```

## Limitations

- The model covers tomato only. Other crops should be rejected as "not tomato", but rejection is learned from PlantVillage crops and simple synthetic images, so unusual photos may still be misread. Test with real field photos, including cassava.
- PlantVillage images are controlled compared with many real farm photographs. Independent Rwanda field validation is required.
- The 0.7 confidence threshold is a starting value and should be tuned on validation and field images.
- The Kinyarwanda text added in this fork (new disease names, virus and spider-mite guidance, and the retake message) is a draft and must be reviewed by a native speaker and an agronomist before use with farmers.
- Browser inference depends on WebAssembly support, available memory, device speed, and storage quota. Universal device compatibility is not claimed.
- Recommendations are general knowledge-base guidance, not a confirmed diagnosis or a substitute for an agricultural extension worker. No pesticide dosage or chemical application rate is provided.
- History is local to the browser/device. There is no account, cloud backup, synchronization, or backend.
- The optional local LLM layer is not enabled; it is not required for disease results or recommendations.

## Acknowledgements

- [godson-pius/vunalink](https://github.com/godson-pius/vunalink): the original VunaLink app and ML pipeline this fork builds on.
- [PlantVillage dataset](https://github.com/spMohanty/PlantVillage-Dataset) (Hughes & Salathé, 2015), used for training.
