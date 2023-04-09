import axios, { Axios } from 'axios';

type ScanFormat = 'pnm' | 'tiff' | 'png' | 'jpeg';
type ScanResolution = 75 | 150 | 300 | 600 | 1200;
type ScanMode = 'color' | 'gray' | 'lineart';

export interface ScanRequest {
  format: ScanFormat;
  resolution: ScanResolution;
  mode: ScanMode;
}

export interface ScanResult {
  success: boolean;
  errorMessage: string | null;
  body: Blob | null;
}

export class ScanApi {
  private axios: Axios;

  constructor(baseUrl: string) {
    this.axios = axios.create({
      baseURL: baseUrl,
    });
  }

  public static getAvailableFormats(): ScanFormat[] {
    return ['pnm', 'png', 'tiff', 'jpeg'];
  }

  public static getAvailableResolutions(): ScanResolution[] {
    return [75, 150, 300, 600, 1200];
  }

  public static getAvailableModi(): ScanMode[] {
    return ['color', 'gray', 'lineart'];
  }

  public scan(req: ScanRequest): Promise<ScanResult> {
    return this.axios
      .get<Blob>('/scan', {
        params: {
          ...req,
        },
        responseType: 'blob',
        timeout: 30000,
      })
      .then(({ data }) => ({
        success: true,
        errorMessage: null,
        body: data,
      }))
      .catch(
        (reason) =>
          ({
            success: false,
            errorMessage: String(reason),
            body: null,
          } as ScanResult),
      );
  }
}
