import { computed, ref } from 'vue';
import { StagecoachApi, UploadDocumentOptions } from '../common/StagecoachApi';
import { useEnvironment } from './useEnvironment';

const api = ref(null as StagecoachApi | null);
const apiToken = ref('');
const apiAvailable = computed(() => api.value !== null);

const lastError = ref(null as string | null);

const isUploading = ref(false);
const uploadProgress = ref(1);

const { env } = useEnvironment();

env.then((env) => {
  if (env.stagecoachApiUrl) {
    api.value = new StagecoachApi(env.stagecoachApiUrl);
  }
});

const upload = (doc: Blob, options: UploadDocumentOptions) => {
  if (isUploading.value) {
    lastError.value = 'document is already uploading';

    return;
  }

  isUploading.value = true;

  lastError.value = null;

  return api.value
    ?.setCredentials(apiToken.value)
    .upload(doc, options, (event) => {
      uploadProgress.value = event.progress || 0;
    })
    .then((res) => {
      lastError.value = res.errorMessage || null;

      isUploading.value = false;
      uploadProgress.value = 1;
    });
};

export const useStagecoach = () => {
  return {
    apiAvailable,
    apiToken,
    lastError,
    isUploading,
    uploadProgress,
    upload,
  };
};
