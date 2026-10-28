"""Build a "Not_tomato" class folder so the model can learn to reject non-tomato images.

It samples images from every non-tomato PlantVillage class (spread evenly across
classes), optionally adds images from extra folders (e.g. cassava leaves or your
own photos of soil, hands, walls), and can generate simple synthetic non-leaf
images (plain colours, noise, gradients). Everything is copied into
<source-dir>/Not_tomato, ready for prepare_dataset.py.

Example:
  python ml/build_not_tomato.py --source-dir ml/data/plant_village --target 2500 \
      --extra-dir ml/data/extra_negatives --synthetic 300
"""
import argparse, random, shutil
from pathlib import Path
import numpy as np
from PIL import Image

IMAGE_TYPES = {".jpg", ".jpeg", ".png"}
parser = argparse.ArgumentParser()
parser.add_argument("--source-dir", required=True, help="PlantVillage class folders (e.g. ml/data/plant_village)")
parser.add_argument("--class-name", default="Not_tomato")
parser.add_argument("--target", type=int, default=2500, help="approximate number of PlantVillage images to sample")
parser.add_argument("--extra-dir", action="append", default=[], help="folder of extra negative images (searched recursively); repeatable")
parser.add_argument("--synthetic", type=int, default=0, help="number of synthetic non-leaf images to generate")
parser.add_argument("--seed", type=int, default=42)
args = parser.parse_args()

rng = random.Random(args.seed)
source = Path(args.source_dir)
output = source / args.class_name
if output.exists(): shutil.rmtree(output)
output.mkdir(parents=True)

def images_in(folder, recursive=False):
    pattern = folder.rglob("*") if recursive else folder.iterdir()
    return sorted(p for p in pattern if p.is_file() and p.suffix.lower() in IMAGE_TYPES)

def safe(name):
    return "".join(c if c.isalnum() else "_" for c in name)[:40]

counts = {}
negative_classes = sorted(d for d in source.iterdir() if d.is_dir() and d.name != args.class_name and not d.name.lower().startswith("tomato"))
if not negative_classes: raise SystemExit(f"No non-tomato class folders found in {source}.")
per_class = max(1, -(-args.target // len(negative_classes)))
for class_dir in negative_classes:
    files = images_in(class_dir); rng.shuffle(files)
    for i, path in enumerate(files[:per_class]):
        shutil.copy2(path, output / f"pv_{safe(class_dir.name)}_{i:05d}{path.suffix.lower()}")
    counts[class_dir.name] = min(per_class, len(files))

for extra in args.extra_dir:
    files = images_in(Path(extra), recursive=True)
    for i, path in enumerate(files):
        try:
            with Image.open(path) as image: image.convert("RGB").save(output / f"extra_{safe(Path(extra).name)}_{i:05d}.jpg", quality=95)
        except Exception: continue
    counts[f"extra:{extra}"] = len(files)

nprng = np.random.default_rng(args.seed)
for i in range(args.synthetic):
    kind = i % 3
    if kind == 0:   # plain colour (incl. leaf-like greens)
        array = np.full((256, 256, 3), nprng.integers(0, 256, 3), dtype=np.uint8)
    elif kind == 1: # noise
        array = nprng.integers(0, 256, (256, 256, 3), dtype=np.uint8)
    else:           # gradient between two colours
        a, b = nprng.integers(0, 256, 3), nprng.integers(0, 256, 3); t = np.linspace(0, 1, 256)[:, None, None]
        array = np.broadcast_to(a * (1 - t) + b * t, (256, 256, 3)).astype(np.uint8)
    Image.fromarray(array).save(output / f"synthetic_{i:05d}.jpg", quality=95)
if args.synthetic: counts["synthetic"] = args.synthetic

total = len(images_in(output))
for name, count in counts.items(): print(f"{count:6d}  {name}")
print(f"{total:6d}  images written to {output}")
