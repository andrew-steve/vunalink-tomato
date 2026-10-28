export type DiseaseLabel = { diseaseId: string; crop: string; disease: string };
// Must match ml/artifacts/class_mapping.json (alphabetical folder order from training).
export const MODEL_LABELS: readonly DiseaseLabel[] = [
  { diseaseId: "not_tomato", crop: "Unknown", disease: "Not a tomato leaf" },
  { diseaseId: "tomato_bacterial_spot", crop: "Tomato", disease: "Bacterial spot" },
  { diseaseId: "tomato_early_blight", crop: "Tomato", disease: "Early blight" },
  { diseaseId: "tomato_late_blight", crop: "Tomato", disease: "Late blight" },
  { diseaseId: "tomato_leaf_mold", crop: "Tomato", disease: "Leaf mold" },
  { diseaseId: "tomato_septoria_leaf_spot", crop: "Tomato", disease: "Septoria leaf spot" },
  { diseaseId: "tomato_spider_mites", crop: "Tomato", disease: "Spider mites" },
  { diseaseId: "tomato_target_spot", crop: "Tomato", disease: "Target spot" },
  { diseaseId: "tomato_yellow_leaf_curl_virus", crop: "Tomato", disease: "Yellow leaf curl virus" },
  { diseaseId: "tomato_mosaic_virus", crop: "Tomato", disease: "Mosaic virus" },
  { diseaseId: "tomato_healthy", crop: "Tomato", disease: "Healthy" },
];
export const REJECT_DISEASE_ID = "not_tomato";
// Below this top-class probability the app asks for a new photo instead of guessing.
export const MIN_CONFIDENCE = 0.7;
export function getLabel(classId: number): DiseaseLabel | undefined { return MODEL_LABELS[classId]; }
