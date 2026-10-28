import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { getDiseaseInfo, getDiseaseInfoRw } from "@/lib/localization/disease-info";
import { MODEL_LABELS } from "@/lib/ml/labels";
import { postprocess } from "@/lib/ml/postprocess";
import { getRecommendation } from "@/lib/recommendations/knowledge-base";
import { clearDiagnoses, getDiagnoses, saveDiagnosis } from "@/lib/history/storage";
import { validateImageFile } from "@/lib/image/validation";

const metadata = { name: "test", version: "0.1.0", format: "onnx" as const };

describe("critical offline behavior", () => {
  it("validates image selection, type, and size", () => {
    expect(validateImageFile()).toContain("No image");
    expect(validateImageFile({ type: "image/gif", size: 10 })).toContain("JPG");
    expect(validateImageFile({ type: "image/jpeg", size: 11 * 1024 * 1024 })).toContain("too large");
    expect(validateImageFile({ type: "image/jpeg", size: 100 })).toBeNull();
  });

  it("maps the highest model output index to the correct disease", () => {
    const result = postprocess([0.02, 0.03, 0.85, 0.03, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01], metadata);
    expect(result).toMatchObject({ status: "prediction", prediction: { classId: 2, diseaseId: "tomato_early_blight", crop: "Tomato" } });
  });

  it("rejects non-tomato and low-confidence images instead of guessing", () => {
    expect(postprocess([0.9, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01], metadata)).toMatchObject({ status: "rejected", reason: "not-tomato" });
    expect(postprocess([0.1, 0.05, 0.45, 0.3, 0.02, 0.02, 0.02, 0.01, 0.01, 0.01, 0.01], metadata)).toMatchObject({ status: "rejected", reason: "low-confidence" });
  });

  it("has guidance for every label the model can return", () => {
    for (const label of MODEL_LABELS.filter((l) => l.diseaseId !== "not_tomato")) {
      expect(getDiseaseInfoRw(label.diseaseId).name).not.toBe("Ibisubizo by'isuzuma");
      expect(getRecommendation(label.diseaseId)).toBeDefined();
    }
    expect(getDiseaseInfo("tomato_mosaic_virus", "en").treatment[0]).toContain("no cure");
  });

  it("returns safe Kinyarwanda fallback content", () => {
    expect(getDiseaseInfoRw("potato_late_blight").name).toContain("Late blight");
    expect(getDiseaseInfoRw("unknown").warning).toBeTruthy();
  });

  it("finds verified local recommendations", () => {
    expect(getRecommendation("tomato_early_blight")?.actions.length).toBeGreaterThan(0);
    expect(getRecommendation("unknown")).toBeUndefined();
  });

  it("persists and clears diagnosis history locally", async () => {
    await clearDiagnoses();
    await saveDiagnosis({ id: "test-1", createdAt: "2026-01-01T00:00:00.000Z", crop: "Potato", disease: "Early blight", diseaseId: "potato_early_blight", confidence: 0.9, modelVersion: "0.1.0" });
    expect((await getDiagnoses()).map((record) => record.id)).toEqual(["test-1"]);
    await clearDiagnoses();
    expect(await getDiagnoses()).toEqual([]);
  });
});
