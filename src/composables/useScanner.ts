import { ScanApi, ScanRequest } from '../common/ScanApi';
import { computed, ref } from 'vue';
import { useEnvironment } from './useEnvironment';

const api = ref(null as ScanApi | null);
const apiAvailable = computed(() => api.value !== null);

const lastError = ref(null as string | null);

const isScanning = ref(false);

const requestSettings = ref({
  format: 'png',
  resolution: 300,
  mode: 'color',
} as ScanRequest);

const scanObjectUrl = ref('');
const scanObjectBlob = ref(null as Blob | null);
const scanFormat = ref('');

const { env } = useEnvironment();

env.then((env) => {
  if (env.saneScanApiUrl) {
    api.value = new ScanApi(env.saneScanApiUrl);
  }
});

const scan = () => {
  if (isScanning.value) {
    lastError.value = 'scanner is already running';

    return;
  }

  isScanning.value = true;
  scanFormat.value = requestSettings.value.format;

  if (scanObjectUrl.value !== '') {
    URL.revokeObjectURL(scanObjectUrl.value);
  }

  scanObjectUrl.value = '';
  scanObjectBlob.value = null;
  lastError.value = null;

  return api.value?.scan(requestSettings.value).then((res) => {
    lastError.value = res.errorMessage || null;

    if (res.success && res.body !== null) {
      scanObjectBlob.value = res.body;
      scanObjectUrl.value = URL.createObjectURL(res.body);
    } else {
      scanObjectBlob.value = null;
      scanObjectUrl.value = '';
    }

    isScanning.value = false;
  });
};

export const useScanner = () => {
  return {
    apiAvailable,
    isScanning,
    requestSettings,
    scanObjectUrl,
    scanObjectBlob,
    lastError,
    scanFormat,
    scan,
  };
};
