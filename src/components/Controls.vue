<template>
  <aside>
    <div class="error" v-if="lastError">{{ lastError }}</div>
    <div class="controls">
      <DropdownControl label="Format" :options="formats" v-model="requestSettings.format" />
      <DropdownControl label="Resolution" :options="resolutions" v-model="requestSettings.resolution" />
      <DropdownControl label="Mode" :options="modi" v-model="requestSettings.mode" />
    </div>
    <div class="buttons">
      <a class="scan" :class="[isScanning ? 'disabled' : undefined]" href="javascript:void(0);" @click="scan">{{
        isScanning ? 'Scanning ...' : 'Start Scan'
      }}</a>
      <a class="download" :class="[canDownload ? undefined : 'disabled']" href="javascript:void(0);" @click="download"
        >Save</a
      >
    </div>
    <div class="hidden">
      <a :href="scanObjectUrl" :download="downloadFilename" ref="downloadAnchor"></a>
    </div>
  </aside>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import useScanner from '../composables/useScanner';
import { ScanApi } from '../common/ScanApi';
import DropdownControl from './DropdownControl.vue';

export default defineComponent({
  components: {
    DropdownControl,
  },
  setup() {
    const { scan, isScanning, lastError, scanObjectUrl, requestSettings } = useScanner();

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

    const canDownload = computed(() => scanObjectUrl.value && !isScanning.value && !lastError.value);

    const downloadTime = ref('1970-01-01_00-00-00');

    const downloadFilename = computed(
      () => `scan_${requestSettings.value.resolution}_${downloadTime.value}.${requestSettings.value.format}`,
    );

    return {
      scan,
      isScanning,
      lastError,
      scanObjectUrl,
      requestSettings,
      formats,
      resolutions,
      modi,
      canDownload,
      downloadTime,
      downloadFilename,
    };
  },
  methods: {
    download() {
      if (!this.canDownload) {
        return;
      }

      this.downloadTime = new Date()
        .toLocaleString()
        .replace(/[^\d\-]/g, '-')
        .replace(/-{2,}/g, '-');

      this.$nextTick(() => {
        (this.$refs.downloadAnchor as HTMLAnchorElement).click();
      });
    },
  },
});
</script>

<style scoped lang="scss">
aside {
  width: 300px;
  flex-shrink: 0;

  padding: 18px 22px;

  overflow: hidden;

  border-left: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.025);

  .error {
    background-color: rgba(255, 50, 50, 0.25);
    border: 1px solid rgba(255, 50, 50, 0.25);
    border-radius: 3px;

    font-size: 14px;
    line-height: 20px;

    padding: 12px 18px;
  }

  .error,
  .controls {
    margin-bottom: 24px;
  }

  .buttons {
    display: flex;

    flex-direction: row;
    justify-content: space-between;

    a {
      display: block;

      width: 100%;

      color: white;
      text-decoration: none;
      text-transform: uppercase;

      text-align: center;
      padding: 8px;
      margin-right: 8px;

      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);

      border-radius: 3px;

      &:last-child {
        margin-right: 0;
        margin-bottom: 0;
      }

      &.scan {
        background-color: rgba(50, 255, 50, 0.2);
        border: 1px solid rgba(50, 255, 50, 0.2);
      }

      &.download {
        background-color: rgba(50, 100, 220, 0.2);
        border: 1px solid rgba(50, 100, 220, 0.2);
      }

      &.disabled {
        cursor: default;

        opacity: 0.5;
      }
    }
  }
}
</style>
