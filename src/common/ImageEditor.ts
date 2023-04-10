export type RotationDirection = 'left' | 'right';

export type BlobType = 'png' | 'jpeg';

export class ImageEditor {
  private canvasContext: OffscreenCanvasRenderingContext2D | null = null;

  private image: HTMLImageElement | null = null;

  public loadImage(imageBlob: Blob): Promise<this> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const imgUrl = URL.createObjectURL(imageBlob);

      img.addEventListener('load', () => {
        URL.revokeObjectURL(imgUrl);

        this.canvasContext = new OffscreenCanvas(img.width, img.height).getContext('2d');

        if (!this.canvasContext) {
          reject(new Error('unable to get offscreen canvas context'));
          return;
        }

        this.image = img;

        resolve(this);
      });

      img.addEventListener('error', (e) => {
        URL.revokeObjectURL(imgUrl);
        reject(e);
      });

      img.src = imgUrl;
    });
  }

  public rotate(dir: RotationDirection): this {
    if (!this.canvasContext) {
      throw new Error('unable to rotate: no canvas context');
    }

    if (!this.image) {
      throw new Error('unable to rotate: no image');
    }

    const angle = dir === 'left' ? -90 : 90;

    const oW = this.canvasContext.canvas.width;
    const oH = this.canvasContext.canvas.height;

    const nW = oH;
    const nH = oW;

    this.canvasContext.canvas.width = nW;
    this.canvasContext.canvas.height = nH;

    this.canvasContext.translate(nW / 2, nH / 2);
    this.canvasContext.rotate((angle * Math.PI) / 180);
    this.canvasContext.translate(-oW / 2, -oH / 2);

    this.canvasContext.drawImage(this.image, 0, 0);

    return this;
  }

  public getBlob(type: BlobType): Promise<Blob> {
    if (!this.canvasContext) {
      throw new Error('unable to rotate: no canvas context');
    }

    return this.canvasContext.canvas.convertToBlob({
      type: `image/${type}`,
      quality: 1,
    });
  }
}
