import { ScanApi, ScanRequest } from '../common/ScanApi';
import { computed, ref, watch } from 'vue';
import { useEnvironment } from './useEnvironment';
import { MultiScanManager } from '../common/MultiScanManager';

const multiScanManager = new MultiScanManager();
const multiScanIndex = ref(0);

const api = ref(null as ScanApi | null);
const apiAvailable = computed(() => api.value !== null);

const lastError = ref(null as string | null);

const isScanning = ref(false);

const requestSettings = ref({
  format: 'png',
  resolution: 300,
  mode: 'color',
  gamma: 1.6,
} as ScanRequest);

const scanObjectUrl = ref('');
const scanObjectBlob = ref(null as Blob | null);
const scanFormat = ref('');

watch(
  scanObjectBlob,
  (newBlob) => {
    if (scanObjectUrl.value) {
      URL.revokeObjectURL(scanObjectUrl.value);

      scanObjectUrl.value = '';
    }

    if (newBlob) {
      scanObjectUrl.value = URL.createObjectURL(newBlob);
    }
  },
  {
    immediate: true,
  },
);

const { env } = useEnvironment();

env.then((env) => {
  if (env.saneScanApiUrl) {
    api.value = new ScanApi(env.saneScanApiUrl);
  }
});

const scan = (addPage: boolean = false) => {
  if (isScanning.value) {
    lastError.value = 'scanner is already running';

    return;
  }

  isScanning.value = true;
  scanFormat.value = requestSettings.value.format;

  scanObjectBlob.value = null;
  lastError.value = null;

  if (!addPage) {
    multiScanManager.clear();
    multiScanIndex.value = 0;
  }

  return api.value?.scan(requestSettings.value).then((res) => {
    lastError.value = res.errorMessage || null;

    if (res.success && res.body !== null) {
      scanObjectBlob.value = res.body;

      ++multiScanIndex.value;
      multiScanManager.put(multiScanIndex.value, res.body, requestSettings.value.format);
    } else {
      scanObjectBlob.value = null;
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
    multiScanManager,
    multiScanIndex,
  };
};
