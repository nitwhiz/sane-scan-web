import axios, { Axios, AxiosProgressEvent } from 'axios';

export interface UploadDocumentOptions {
  fileName: string;
}

export interface UploadDocumentResult {
  success: boolean;
  errorMessage: string | null;
}

export class StagecoachApi {
  private axios: Axios;

  private token: string = '';

  constructor(baseUrl: string) {
    this.axios = axios.create({
      baseURL: baseUrl,
    });
  }

  public setCredentials(token: string): this {
    this.token = token;

    return this;
  }

  public upload(
    doc: Blob,
    options: UploadDocumentOptions,
    onUploadProgress?: (e: AxiosProgressEvent) => void,
  ): Promise<UploadDocumentResult> {
    if (!this.token) {
      return Promise.resolve({
        success: false,
        errorMessage: 'missing token',
      });
    }

    const formData = new FormData();

    formData.append('file', doc);
    formData.append('name', options.fileName);

    return this.axios
      .post('/upload', formData, {
        headers: {
          Authorization: `Token ${this.token}`,
          'Content-Type': `multipart/form-data`,
        },
        onUploadProgress: onUploadProgress || undefined,
      })
      .then(() => ({
        success: true,
        errorMessage: null,
      }))
      .catch((reason) => ({
        success: false,
        errorMessage: String(reason),
      }));
  }
}
