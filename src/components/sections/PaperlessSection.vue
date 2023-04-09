<template>
  <div class="section">
    <h3>Paperless</h3>
    <div class="controls">
      <InputControl label="API-Token" type="password" v-model="stagecoachApiToken" />
      <InputControl label="File Name" type="text" v-model="fileName" />
    </div>
    <div class="buttons">
      <Button
        :label="uploadLabel"
        :enabled="!isUploading && !isScanning"
        @click="startStagecoachUpload"
        :progress="uploadProgress"
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

const { isScanning, lastError: scannerError, scanObjectBlob, scanFormat } = useScanner();

const {
  apiToken: stagecoachApiToken,
  lastError: stagecoachError,
  isUploading,
  uploadProgress,
  upload,
} = useStagecoach();

const fileName = ref('');

const uploadLabel = computed(() =>
  isUploading.value ? 'Uploading ...' : `Upload${scanFormat.value ? ' ' + scanFormat.value : ''}`,
);

const startStagecoachUpload = () => {
  scannerError.value = null;
  stagecoachError.value = null;

  if (scanObjectBlob.value) {
    upload(scanObjectBlob.value as Blob, {
      fileName: `${fileName.value || `scan_${Date.now()}`}.${scanFormat.value.toLowerCase()}`,
    });
  }
};
</script>

<style lang="scss" scoped>
@use '../../styles/section';
</style>
