import EventEmitter from 'eventemitter3';

export interface BlobFile {
  format: string;
  file: Blob;
}

export class MultiScanManager extends EventEmitter<{
  update: (blobs: BlobFile[]) => void;
}> {
  private blobs: Record<number, Blob> = {};

  private blobFormats: Record<number, string> = {};

  public clear(): void {
    this.blobs = {};

    this.emit('update', this.getAll());
  }

  public put(idx: number, blob: Blob, format?: string): void {
    this.blobs[idx] = blob;

    if (format) {
      this.blobFormats[idx] = format;
    }

    this.emit('update', this.getAll());
  }

  public getAll(): BlobFile[] {
    return Object.entries(this.blobs)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map((e) => ({
        format: this.blobFormats[Number(e[0])] || 'png',
        file: e[1],
      }));
  }
}
