import imageCompression from "browser-image-compression";

const COMPRESSION_OPTIONS = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: "image/jpeg" as const,
  initialQuality: 0.8,
};

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.size < 500_000) {
    return file;
  }

  try {
    const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
    const newName = file.name.replace(/\.[^.]+$/, ".jpg");
    return new File([compressed], newName, { type: "image/jpeg" });
  } catch (error) {
    console.error("[compressImage] Compression failed, using original:", error);
    return file;
  }
}
