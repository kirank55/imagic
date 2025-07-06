export interface PreventableEvent {
  preventDefault: () => void;
  stopPropagation: () => void;
}

export function preventDefaultAndPropagation(event: PreventableEvent): void {
  // event.stopPropagation() and event.preventDefault() stop the browser's default behavior and allow your code to run instead. Without them, the browser would otherwise navigate away from your page and open the files the user dropped into the browser window.

  // src: https://web.dev/read-files

  event.preventDefault();
  event.stopPropagation();
}

export interface FileSize {
  (size: number): string;
}

export const returnFileSize: FileSize = function (size: number): string {
  if (size < 1024) {
    return `${size} bytes`;
  } else if (size >= 1024 && size < 1048576) {
    return `${(size / 1024).toFixed(1)} KB`;
  } else if (size >= 1048576) {
    return `${(size / 1048576).toFixed(1)} MB`;
  }
  return `${size} bytes`;
};

export function removeDraggingFileClass() {
  document.body.classList.remove("dragging-file");
  const overlay = document.querySelector(".file-drag-overlay");
  if (overlay) {
    overlay.classList.remove("dragging-file");
  }
}

export async function reduce_image_file_size(
  base64Str: string,
  imageType: string,
  compressionLevel: "high" | "medium"
) {
  return await new Promise<string>((resolve) => {
    const img = new window.Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      if (compressionLevel === "high") {
        width = img.width / 2;
        height = img.height / 2;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL(imageType, 0.1));
    };
  });
}
export function calc_image_size(image: string) {
  let y = 1;
  if (image.endsWith("==")) {
    y = 2;
  }
  const x_size = image.length * (3 / 4) - y;
  return Math.round(x_size / 1024);
}
export async function image_to_base64(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result as string);
    fileReader.onerror = (error) => {
      reject(error);
      alert("An Error occurred please try again, File might be corrupt");
    };
    fileReader.readAsDataURL(file);
  });
}
