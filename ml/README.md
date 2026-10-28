# VunaLink model training

This directory contains the reproducible training pipeline for a lightweight
MobileNetV2 classifier. It is intentionally separate from the Next.js app.

## Current status

There is no trained VunaLink model or evaluation result in this repository.
The pipeline uses the legitimate TensorFlow Datasets `plant_village` source;
run `download_plantvillage.py` to obtain it. The configured classes are
candidate classes only and must be reviewed against Rwanda field data before
being treated as a final product scope.

PlantVillage is mostly curated/controlled imagery. Its metrics must not be
reported as accuracy on real Rwandan farm images. Field validation is required.

## Reproduce

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python ml/download_plantvillage.py --data-dir ml/data/tfds --output-dir ml/data/plant_village
python ml/inspect_dataset.py --source-dir ml/data/plant_village --output ml/data/dataset_inventory.json
python ml/prepare_dataset.py --source-dir ml/data/plant_village --output-dir ml/data/split
python ml/train.py --data-dir ml/data/split --output-dir ml/artifacts
```

The exact class list is in `class_config.json`. Edit it before preparing data.
The scripts write `class_mapping.json`, `model_metadata.json`,
`evaluation.json` (including accuracy, macro precision/recall/F1, per-class
metrics, confusion matrix, and classes ranked by F1), and a SavedModel/checkpoint. ONNX export is optional and
requires `tf2onnx`:

```bash
python ml/export_onnx.py --saved-model ml/artifacts/model.keras --output ml/artifacts/vunalink-mobilenet-v2.onnx
```

The exported model must be copied to `public/models/` only after its input
shape, preprocessing, labels, and evaluation have been reviewed. The PWA does
not consume this training output automatically..

## Evaluation and references

The held-out test split is never used for training. `evaluate.py` records
accuracy, macro precision/recall/F1, per-class metrics, a confusion matrix,
and all classes ranked by F1 so weak classes remain visible. After training,
generate browser parity fixtures from the test set with:

```bash
python ml/create_references.py --model ml/artifacts/model.keras --test-dir ml/data/split/test --output-dir ml/evaluation/references --width 224 --height 224
```

The generated references are valid only for the exact trained model and class
mapping. PlantVillage results do not measure performance on real Rwandan farm
images; representative Rwanda field data and an independent evaluation are
required before deployment claims.
