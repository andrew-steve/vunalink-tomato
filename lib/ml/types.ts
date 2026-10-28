export type ModelStatus = "idle" | "loading" | "ready" | "unavailable" | "error";
export type ModelMetadata = { name: string; version: string; format: "onnx"; input?: { width: number; height: number; channels: number }; normalization?: { mean: number[]; standardDeviation: number[] }; labels?: readonly string[]; trainingDataset?: string };
export type Prediction = { classId: number; diseaseId: string; disease: string; crop: string; confidence: number; modelVersion: string };
export type InferenceResult = { status: "prediction"; prediction: Prediction } | { status: "rejected"; reason: "not-tomato" | "low-confidence"; confidence: number } | { status: "unsupported-class"; classId: number } | { status: "error"; message: string };
