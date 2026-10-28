import { getLabel, MIN_CONFIDENCE, REJECT_DISEASE_ID } from "./labels";
import type { InferenceResult, ModelMetadata } from "./types";
export function postprocess(output: readonly number[], metadata: ModelMetadata): InferenceResult {
  if (!output.length || output.some((value) => !Number.isFinite(value))) return { status: "error", message: "The model returned an invalid result." };
  const classId = output.indexOf(Math.max(...output)); const label = getLabel(classId);
  if (!label) return { status: "unsupported-class", classId };
  const confidence = output[classId];
  if (label.diseaseId === REJECT_DISEASE_ID) return { status: "rejected", reason: "not-tomato", confidence };
  if (confidence < MIN_CONFIDENCE) return { status: "rejected", reason: "low-confidence", confidence };
  return { status: "prediction", prediction: { classId, diseaseId: label.diseaseId, disease: label.disease, crop: label.crop, confidence, modelVersion: metadata.version } };
}
