<template>
  <div class="section">
    <h3>Paperless</h3>
    <div class="controls">
      <InputControl label="API-Token" type="password" v-model="apiToken" />
      <InputControl label="File Name" type="text" v-model="fileName" />
    </div>
    <div class="buttons">
      <Button
        :label="uploadLabel"
        :enabled="!isGotenbergRunning && !isStagecoachUploading && !isScanning && !isImageEditorProcessing"
        @click="start"
        :progress="progress"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import InputControl from '../InputControl.vue';
import Button from '../Button.vue';
import { computed, ref } from 'vue';
import { useScanner } from '../../composables/useScanner';
import { useStagecoach } from '../../composables/useStagecoach';
import { useScanImageEditor } from '../../composables/useScanImageEditor';
import { useGotenberg } from '../../composables/useGotenberg';

const { isScanning, lastError: scannerError, multiScanManager } = useScanner();
const {
  apiToken: stagecoachApiToken,
  lastError: stagecoachError,
  isUploading: isStagecoachUploading,
  uploadProgress: stagecoachUploadProgress,
  upload,
} = useStagecoach();
const { isProcessing: isImageEditorProcessing } = useScanImageEditor();
const {
  apiToken: gotenbergApiToken,
  isRunning: isGotenbergRunning,
  lastError: gotenbergError,
  merge,
  uploadProgress: gotenbergUploadProgress,
  downloadProgress: gotenbergDownloadProgress,
} = useGotenberg();

const progress = computed(() => {
  const v =
    stagecoachUploadProgress.value * 0.33 +
    gotenbergUploadProgress.value * 0.33 +
    gotenbergDownloadProgress.value * 0.33;

  if (v === 0) {
    return 1;
  }

  return Math.min(1, v + 0.01);
});

const apiToken = computed({
  get: () => (stagecoachApiToken.value === gotenbergApiToken.value ? stagecoachApiToken.value : ''),
  set: (token: string) => {
    stagecoachApiToken.value = token;
    gotenbergApiToken.value = token;
  },
});

const fileName = ref('');

const uploadLabel = computed(() => {
  if (isGotenbergRunning.value) {
    return 'Processing ...';
  }

  if (isStagecoachUploading.value) {
    return 'Uploading ...';
  }

  return 'Upload PDF';
});

const startGotenbergProcessing = () => {
  const files = multiScanManager.getAll();

  if (files.length !== 0) {
    return merge(
      ...files.map((f) => ({
        file: f.file,
        extension: f.format,
      })),
    );
  }
};

const startStagecoachUpload = (pdfFile: Blob | null) => {
  if (pdfFile) {
    return upload(pdfFile, {
      fileName: `${fileName.value || `scan_${Date.now()}`}.pdf`,
    });
  }
};

const start = () => {
  scannerError.value = null;
  stagecoachError.value = null;
  gotenbergError.value = null;

  gotenbergUploadProgress.value = 0;
  gotenbergDownloadProgress.value = 0;
  stagecoachUploadProgress.value = 0;

  startGotenbergProcessing()
    ?.then((pdfFile) => startStagecoachUpload(pdfFile))
    .finally(() => {
      gotenbergUploadProgress.value = 1;
      gotenbergDownloadProgress.value = 1;
      stagecoachUploadProgress.value = 1;
    });
};
</script>

<style lang="scss" scoped>
@use '../../styles/section';
</style>
