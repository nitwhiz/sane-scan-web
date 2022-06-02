import buildUrl from 'build-url-ts';

type ScanFormat = 'pnm' | 'tiff' | 'png' | 'jpeg';
type ScanResolution = 75 | 150 | 300 | 600 | 1200;
type ScanMode = 'color' | 'gray' | 'lineart';

export interface ScanRequest {
  format: ScanFormat;
  resolution: ScanResolution;
  mode: ScanMode;
}

export interface ScanResponse {
  success: boolean;
  errorMessage: string | null;
  body: Blob | null;
}

export class ScanApi {
  constructor(private baseUrl: string) {}

  public static getAvailableFormats() {
    return ['pnm', 'png', 'tiff', 'jpeg'];
  }

  public static getAvailableResolutions() {
    return [75, 150, 300, 600, 1200];
  }

  public static getAvailableModi() {
    return ['color', 'gray', 'lineart'];
  }

  public scan(req: ScanRequest): Promise<ScanResponse> {
    return fetch(
      buildUrl(this.baseUrl, {
        path: '/scan',
        queryParams: {
          ...req,
        },
      }),
      {
        mode: 'cors',
        cache: 'no-cache',
      },
    )
      .then(async (response) => {
        if (response.ok) {
          return {
            success: true,
            errorMessage: null,
            body: await response.blob(),
          } as ScanResponse;
        }

        return {
          success: false,
          errorMessage: (await response.json())?.error || 'unknown',
          body: null,
        } as ScanResponse;
      })
      .catch(
        (reason) =>
          ({
            success: false,
            errorMessage: String(reason),
            body: null,
          } as ScanResponse),
      );
  }
}
