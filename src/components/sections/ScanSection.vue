<template>
  <div class="hidden">
    <a :href="scanObjectUrl" :download="downloadFilename" ref="downloadAnchor"></a>
  </div>
  <div class="section">
    <h3>Scan</h3>
    <div class="controls">
      <DropdownControl label="Format" :options="formats" v-model="requestSettings.format" />
      <DropdownControl label="Resolution" :options="resolutions" v-model="requestSettings.resolution" />
      <DropdownControl label="Mode" :options="modi" v-model="requestSettings.mode" />
    </div>
    <div class="buttons">
      <Button
        :label="isScanning ? 'Scanning ...' : 'Start Scan'"
        :enabled="!isUploading && !isScanning"
        @click="startScan"
        :progress="isScanning ? -1 : 1"
      />
      <Button type="secondary" label="Download" :enabled="canDownload" @click="download" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import DropdownControl from '../DropdownControl.vue';
import Button from '../Button.vue';
import { useScanner } from '../../composables/useScanner';
import { ScanApi } from '../../common/ScanApi';
import { computed, nextTick, ref } from 'vue';
import { useStagecoach } from '../../composables/useStagecoach';

const { scan, isScanning, lastError: scannerError, scanObjectUrl, requestSettings, scanFormat } = useScanner();

const { isUploading, lastError: stagecoachError } = useStagecoach();

const formats = ScanApi.getAvailableFormats().map((f) => ({
  label: f.toUpperCase(),
  value: f,
}));

const resolutions = ScanApi.getAvailableResolutions().map((r) => ({
  label: r,
  value: r,
}));

const modi = ScanApi.getAvailableModi().map((m) => ({
  label: `${m.substring(0, 1).toUpperCase()}${m.substring(1).toLowerCase()}`,
  value: m,
}));

const canDownload = computed(() => scanObjectUrl.value !== '' && !isScanning.value && !scannerError.value);

const downloadTime = ref('1970-01-01_00-00-00');

const downloadFilename = computed(
  () => `scan_${requestSettings.value.resolution}_${downloadTime.value}.${requestSettings.value.format}`,
);

const startScan = () => {
  scannerError.value = null;
  stagecoachError.value = null;

  scanFormat.value = requestSettings.value.format;

  scan();
};

const downloadAnchor = ref(null as null | HTMLAnchorElement);

const download = () => {
  if (!canDownload.value) {
    return;
  }

  downloadTime.value = new Date()
    .toLocaleString()
    .replace(/[^\d\-]/g, '-')
    .replace(/-{2,}/g, '-');

  nextTick(() => {
    downloadAnchor.value?.click();
  });
};
</script>

<style lang="scss" scoped>
@use '../../styles/section';
</style>
