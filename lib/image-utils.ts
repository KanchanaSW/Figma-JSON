export const MAX_IMAGE_WIDTH = 1280;

export function resizeImageFile(
  file: File,
  maxWidth = MAX_IMAGE_WIDTH
): Promise<{ file: File; preview: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;

      if (width <= maxWidth) {
        const reader = new FileReader();
        reader.onload = () =>
          resolve({ file, preview: reader.result as string });
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      const scale = maxWidth / width;
      width = maxWidth;
      height = Math.round(height * scale);

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to resize image"));
            return;
          }
          const resized = new File([blob], file.name, { type: file.type });
          resolve({ file: resized, preview: canvas.toDataURL(file.type) });
        },
        file.type,
        0.92
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

export function validateImageFile(file: File): string | null {
  const allowed = ["image/png", "image/jpeg", "image/webp"];
  if (!allowed.includes(file.type)) {
    return "Invalid file type. Use PNG, JPG, or WebP.";
  }
  if (file.size > 10 * 1024 * 1024) {
    return "File too large. Maximum size is 10MB.";
  }
  return null;
}
