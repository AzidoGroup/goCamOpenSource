namespace Avs {

  export namespace Helper {

    export class Canvas {

      public static canvasToImage(canvasElement: HTMLCanvasElement) {

        const dataURL      = canvasElement.toDataURL();
        const imageElement = document.createElement('img');
        imageElement.setAttribute('src', dataURL);

        return imageElement;

      }

      public static grayscaleCanvas(canvas: HTMLCanvasElement) {

        const canvasContext = canvas.getContext('2d');
        const imgData       = canvasContext.getImageData(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
        const pixels        = imgData.data;

        for (let i = 0; i < pixels.length; i += 4) {
          const lightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
          pixels[i]     = lightness;
          pixels[i + 1] = lightness;
          pixels[i + 2] = lightness;
        }

        canvasContext.putImageData(imgData, 0, 0);

      }

      public static contrastCanvas(canvas: HTMLCanvasElement, contrast: number) {

        const canvasContext = canvas.getContext('2d');
        const imgData       = canvasContext.getImageData(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
        const pixels        = imgData.data;

        contrast      = (contrast / 100) + 1;
        const intercept = 128 * (1 - contrast);
        for (let i = 0; i < pixels.length; i += 4) {
          pixels[i]     = pixels[i] * contrast + intercept;
          pixels[i + 1] = pixels[i + 1] * contrast + intercept;
          pixels[i + 2] = pixels[i + 2] * contrast + intercept;
        }

        canvasContext.putImageData(imgData, 0, 0);

      }

      public static brightnessCanvas(canvas: HTMLCanvasElement, brightness: number) {

        const canvasContext = canvas.getContext('2d');
        const imgData       = canvasContext.getImageData(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
        const pixels        = imgData.data;

        for (let i = 0; i < pixels.length; i += 4) {
          const red   = pixels[i];
          const green = pixels[i + 1];
          const blue  = pixels[i + 2];

          const brightenedRed   = (brightness + 100) / 100 * red;
          const brightenedGreen = (brightness + 100) / 100 * green;
          const brightenedBlue  = (brightness + 100) / 100 * blue;

          pixels[i]     = brightenedRed;
          pixels[i + 1] = brightenedGreen;
          pixels[i + 2] = brightenedBlue;
        }

        canvasContext.putImageData(imgData, 0, 0);

      }

      public static thresholdCanvas(canvas: HTMLCanvasElement, threshold: number) {

        const canvasContext = canvas.getContext('2d');
        const imgData       = canvasContext.getImageData(0, 0, canvasContext.canvas.width, canvasContext.canvas.height);
        const pixels        = imgData.data;

        for (let i = 0; i < pixels.length; i += 4) {
          const r     = pixels[i];
          const g     = pixels[i + 1];
          const b     = pixels[i + 2];
          const v     = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) ? 255 : 0;
          pixels[i] = pixels[i + 1] = pixels[i + 2] = v
        }

        canvasContext.putImageData(imgData, 0, 0);

      }

      public static fileToCanvas(file: Blob, canvas: HTMLCanvasElement) {

        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = (readerLoadEvent: ProgressEvent) => {

          const image = new Image();
          image.src = (<any>readerLoadEvent.target).result;

          image.onload = (onloadEvent: Event) => {
            canvas.width  = image.width;
            canvas.height = image.height;
            const ctx       = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
          }

        }

      }

    }

  }

}
