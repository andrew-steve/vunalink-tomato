# VunaLink

VunaLink is a mobile-first Progressive Web App for Rwandan smallholder farmers. It lets a farmer capture or choose a crop-leaf image, run a local crop-disease model, and read simple guidance without sending the image to a server.

## Features

- Camera capture and image upload for JPG, PNG, and WebP files.
- Local PlantVillage-trained crop classification in the browser.
- Kinyarwanda disease names and guidance, with English data available in the localization layer.
- Offline agricultural recommendations from a bundled knowledge base.
- Diagnosis history stored privately on the device.
- Installable PWA with a service worker and local ONNX Runtime Web assets.
- Optional LLM boundary exists in `lib/ai/`, but no LLM is installed or required.

## Architecture

```text
User → Next.js PWA → image validation and resize → MobileNetV2 ONNX
     → local ONNX Runtime Web / WebAssembly inference → disease prediction
     → local recommendation knowledge base → Kinyarwanda result and guidance
     
```

The model only predicts disease classes. Recommendations are separate from inference and do not require a language model.

## Offline architecture

The service worker (`public/sw.js`) precaches the core routes, manifest, model, and ONNX Runtime Web assets during installation. Successful same-origin application responses are also cached for later navigation. External requests are not handled by the service worker.

Diagnosis records are stored in an IndexedDB database named `vunalink`, in the `diagnoses` object store. Records contain prediction metadata only; original crop images are not persisted. History can be viewed and cleared offline. Model session state is held in memory and the model itself is loaded from `public/models/`.

Install the app or visit required routes once while online so service-worker caching can complete. Browser support and storage quotas vary by device.

## Machine-learning model

The browser model is `public/models/vunalink-mobilenet-v2.onnx`, version `0.1.0`. It is a MobileNetV2 classifier trained using selected PlantVillage classes and executed with `onnxruntime-web`.

- Input: `224 × 224 × 3`, RGB, `float32`, NHWC.
- Output: six `float32` softmax probabilities.
- Browser preprocessing: resize to 224 × 224, read RGB pixels, and pass raw values in NHWC order. The MobileNetV2 formula `(pixel / 127.5) - 1` is embedded in the graph and must not be applied again.
- Classes: potato early blight, potato late blight, potato healthy, tomato early blight, tomato late blight, and tomato healthy.
- Runtime: ONNX Runtime Web using local WebAssembly assets.
- Metadata and mapping: `public/models/model_metadata.json` and `public/models/class_mapping.json`.

Training and evaluation artifacts are under `ml/artifacts/`. PlantVillage evaluation does not represent accuracy on real Rwandan field images, so no production field-accuracy claim is made.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
```

The separate ML workspace instructions are in [`ml/README.md`](ml/README.md).

## Project structure

```text
app/                  Next.js pages, layout, manifest, service-worker registration
components/           Reusable UI, navigation, image picker, install prompt
lib/ml/               Model loading, preprocessing, inference, labels, postprocessing
lib/history/          IndexedDB diagnosis history
lib/image/            Shared image validation rules
lib/localization/     Kinyarwanda disease information
lib/recommendations/  Offline agricultural guidance
public/models/        ONNX model and metadata
public/onnxruntime/   Local ONNX Runtime Web assets
ml/                   Dataset preparation, training, evaluation, and export scripts
tests/                Critical application behavior tests
```

## Limitations

- The model supports only the six potato and tomato classes above. It has no reliable unknown-crop class and can misclassify other crops or field conditions.
- PlantVillage images are controlled compared with many real farm photographs. Independent Rwanda field validation is required.
- Browser inference depends on WebAssembly support, available memory, device speed, and storage quota. Universal device compatibility is not claimed.
- The PWA shell and model are designed for offline use after caching, but offline behavior still varies by browser and phone.
- Recommendations are general knowledge-base guidance, not a confirmed diagnosis or a substitute for an agricultural extension worker. No pesticide dosage or chemical application rate is provided.
- History is local to the browser/device. There is no account, cloud backup, synchronization, or backend.
- The optional local LLM layer is not enabled; it is not required for disease results or recommendations.
