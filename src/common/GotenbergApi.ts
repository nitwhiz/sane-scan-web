import axios, { Axios, AxiosProgressEvent } from 'axios';

export interface MergeResult {
  success: boolean;
  errorMessage: string | null;
  pdfFile: Blob | null;
}

export interface MergeFile {
  extension: string;
  file: Blob;
}

export class GotenbergApi {
  private readonly axios: Axios;

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

  public async merge(
    files: MergeFile[],
    onUploadProgress?: (e: AxiosProgressEvent) => void,
    onDownloadProgress?: (e: AxiosProgressEvent) => void,
  ): Promise<MergeResult> {
    if (!this.token) {
      return Promise.resolve({
        success: false,
        errorMessage: 'missing token',
        pdfFile: null,
      });
    }

    const html = [
      '<!doctype html>',
      '<html><head><style>img { display: block; width: 100%; height: auto; page-break-after: auto; }</style></head><body>',
    ];

    for (const file of files) {
      const b64File = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file.file);
      });

      html.push(`<img src="${b64File}" /><div class="pagebreak"></div>`);
    }

    html.push('</body></html>');

    const htmlBlob = new Blob(html, { type: 'text/html' });

    const formData = new FormData();

    formData.append('files', htmlBlob, 'index.html');

    formData.append('paperWidth', '8.3');
    formData.append('paperHeight', '11.7');

    formData.append('marginTop', '0');
    formData.append('marginRight', '0');
    formData.append('marginBottom', '0');
    formData.append('marginLeft', '0');

    return this.axios
      .post<Blob>('/forms/chromium/convert/html', formData, {
        responseType: 'blob',
        auth: {
          username: 'gotenberg',
          password: this.token,
        },
        onUploadProgress,
        onDownloadProgress,
      })
      .then(({ data: pdfFile }) => {
        console.log(pdfFile);

        return {
          success: true,
          errorMessage: null,
          pdfFile,
        };
      });
  }
}
