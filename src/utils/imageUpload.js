const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const SIGNATURE_BYTES_TO_READ = 12;

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

function hasExpectedSignature(type, bytes) {
  switch (type) {
    case "image/jpeg":
      return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    case "image/png":
      return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]
        .every((byte, index) => bytes[index] === byte);
    case "image/gif":
      return String.fromCharCode(...bytes.slice(0, 6)) === "GIF87a"
        || String.fromCharCode(...bytes.slice(0, 6)) === "GIF89a";
    case "image/webp":
      return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF"
        && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
    default:
      return false;
  }
}

function getFileType(file) {
  return file?.type?.toLowerCase() ?? "";
}

export async function validateImageFile(file) {
  const type = getFileType(file);

  if (!file || !ALLOWED_IMAGE_TYPES.has(type)) {
    throw new Error("รองรับเฉพาะไฟล์ JPEG, PNG, WebP และ GIF");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("รูปภาพต้องมีขนาดไม่เกิน 5 MB");
  }

  let header;

  try {
    header = new Uint8Array(
      await file.slice(0, SIGNATURE_BYTES_TO_READ).arrayBuffer()
    );
  } catch (error) {
    throw new Error("ไม่สามารถตรวจสอบไฟล์รูปภาพได้ กรุณาลองใหม่อีกครั้ง", { cause: error });
  }

  if (!hasExpectedSignature(type, header)) {
    throw new Error("ไฟล์รูปภาพไม่ตรงกับชนิดที่ระบุ กรุณาเลือกไฟล์ใหม่");
  }
}

export async function readImageFile(file) {
  await validateImageFile(file);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("ไม่สามารถอ่านไฟล์รูปภาพได้ กรุณาลองใหม่อีกครั้ง"));
    reader.onabort = () => reject(new Error("การอ่านไฟล์รูปภาพถูกยกเลิก"));
    reader.readAsDataURL(file);
  });
}
