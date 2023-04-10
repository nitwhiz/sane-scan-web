import { computed, ref, watch } from 'vue';
import { GotenbergApi, MergeFile } from '../common/GotenbergApi';
import { useEnvironment } from './useEnvironment';

const api = ref(null as GotenbergApi | null);
const apiToken = ref('');
const apiAvailable = computed(() => api.value !== null);

const lastError = ref(null as string | null);

const isRunning = ref(false);

const pdfObjectUrl = ref('');
const pdfObjectBlob = ref(null as Blob | null);

watch(
  pdfObjectBlob,
  (newBlob) => {
    if (pdfObjectUrl.value) {
      URL.revokeObjectURL(pdfObjectUrl.value);

      pdfObjectUrl.value = '';
    }

    if (newBlob) {
      pdfObjectUrl.value = URL.createObjectURL(newBlob);
    }
  },
  {
    immediate: true,
  },
);

const { env } = useEnvironment();

env.then((env) => {
  if (env.gotenbergApiUrl) {
    api.value = new GotenbergApi(env.gotenbergApiUrl);
  }
});

const uploadProgress = ref(1);
const downloadProgress = ref(1);

const merge = (...files: MergeFile[]) => {
  if (isRunning.value) {
    lastError.value = 'merge is already running';

    return;
  }

  isRunning.value = true;

  pdfObjectBlob.value = null;
  lastError.value = null;

  return api.value
    ?.setCredentials(apiToken.value)
    .merge(
      files,
      (event) => {
        uploadProgress.value = event.progress || 0;
      },
      (event) => {
        downloadProgress.value = event.progress || 0;
      },
    )
    .then((res) => {
      lastError.value = res.errorMessage || null;
      isRunning.value = false;

      uploadProgress.value = 1;
      downloadProgress.value = 1;

      return res.pdfFile;
    });
};

export const useGotenberg = () => ({
  apiAvailable,
  isRunning,
  lastError,
  pdfObjectUrl,
  pdfObjectBlob,
  apiToken,
  merge,
  uploadProgress,
  downloadProgress,
});
