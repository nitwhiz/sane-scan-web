import { ScanApi, ScanRequest } from '../common/ScanApi';
import { ref } from 'vue';

const isScanning = ref(false);

const requestSettings = ref({
  format: 'png',
  resolution: 300,
  mode: 'color',
} as ScanRequest);

const scanObjectUrl = ref('');
const lastError = ref(null as string | null);

let api: ScanApi | null = null;

fetch('/env.json')
  .then((response) => {
    return response.json() as Promise<{ saneScanApiUrl: string }>;
  })
  .then((json) => {
    if (!json.saneScanApiUrl) {
      throw new Error('`saneScanApiUrl` not found in json');
    }

    api = new ScanApi(json.saneScanApiUrl);
  })
  .catch((reason) => {
    lastError.value = `unable to read web env: ${reason}`;
  });

const scan = () => {
  if (isScanning.value) {
    lastError.value = 'scanner is already running';

    return;
  }

  isScanning.value = true;

  if (scanObjectUrl.value !== '') {
    URL.revokeObjectURL(scanObjectUrl.value);
  }

  scanObjectUrl.value = '';
  lastError.value = null;

  return api?.scan(requestSettings.value).then((res) => {
    lastError.value = res.errorMessage || null;

    if (res.success && res.body !== null) {
      scanObjectUrl.value = URL.createObjectURL(res.body);
    } else {
      scanObjectUrl.value = '';
    }

    isScanning.value = false;
  });
};

const useScanner = () => {
  return {
    isScanning,
    requestSettings,
    scanObjectUrl,
    lastError,
    scan,
  };
};

export default useScanner;
