import { describe, expect, it, vi } from "vitest";
import { MAX_IMAGE_SIZE_BYTES, validateImageFile } from "./imageUpload";

function createImageFile(type, bytes, size = bytes.length) {
  return {
    type,
    size,
    slice: vi.fn(() => ({
      arrayBuffer: async () => Uint8Array.from(bytes).buffer,
    })),
  };
}

describe("validateImageFile", () => {
  it("accepts an image when its MIME type and signature match", async () => {
    const png = createImageFile(
      "image/png",
      [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
    );

    await expect(validateImageFile(png)).resolves.toBeUndefined();
  });

  it("rejects a file whose signature does not match its declared MIME type", async () => {
    const disguisedFile = createImageFile("image/png", [0xff, 0xd8, 0xff]);

    await expect(validateImageFile(disguisedFile)).rejects.toThrow(
      "ไฟล์รูปภาพไม่ตรงกับชนิดที่ระบุ"
    );
  });

  it("rejects an oversized file before reading its contents", async () => {
    const oversizedFile = createImageFile(
      "image/jpeg",
      [0xff, 0xd8, 0xff],
      MAX_IMAGE_SIZE_BYTES + 1
    );

    await expect(validateImageFile(oversizedFile)).rejects.toThrow(
      "รูปภาพต้องมีขนาดไม่เกิน 5 MB"
    );
    expect(oversizedFile.slice).not.toHaveBeenCalled();
  });
});
