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
        :label="isScanning ? 'Scanning ...' : 'New Scan'"
        :enabled="!isGotenbergRunning && !isStagecoachUploading && !isScanning && !isImageEditorProcessing"
        @click="() => startScan(false)"
        :progress="isScanning ? -1 : 1"
      />
      <Button type="secondary" label="Download" :enabled="canDownload" @click="download" />
    </div>
    <div class="buttons">
      <Button
        :label="isScanning ? 'Scanning ...' : `Add Scan (${multiScanCount})`"
        :enabled="!isGotenbergRunning && !isStagecoachUploading && !isScanning && !isImageEditorProcessing"
        @click="() => startScan(true)"
        :progress="isScanning ? -1 : 1"
      />
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
import { useScanImageEditor } from '../../composables/useScanImageEditor';
import { useGotenberg } from '../../composables/useGotenberg';

const {
  scan,
  isScanning,
  lastError: scannerError,
  scanObjectUrl,
  requestSettings,
  scanFormat,
  multiScanManager,
} = useScanner();
const { isUploading: isStagecoachUploading, lastError: stagecoachError } = useStagecoach();
const { isProcessing: isImageEditorProcessing } = useScanImageEditor();
const { isRunning: isGotenbergRunning } = useGotenberg();

const multiScanCount = ref(0);

multiScanManager.on('update', (blobs) => (multiScanCount.value = blobs.length));

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

const canDownload = computed(
  () => !isImageEditorProcessing.value && scanObjectUrl.value !== '' && !isScanning.value && !scannerError.value,
);

const downloadTime = ref('1970-01-01_00-00-00');

const downloadFilename = computed(
  () => `scan_${requestSettings.value.resolution}_${downloadTime.value}.${requestSettings.value.format}`,
);

const startScan = (isMulti: boolean) => {
  scannerError.value = null;
  stagecoachError.value = null;

  scanFormat.value = requestSettings.value.format;

  scan(isMulti);
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
