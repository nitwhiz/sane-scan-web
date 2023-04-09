<template>
  <aside>
    <div class="error" v-if="lastErrors.length !== 0">
      <div v-for="e in lastErrors">{{ e }}</div>
    </div>
    <ScanSection v-if="scannerEnabled" />
    <PaperlessSection v-if="stagecoachEnabled" />
  </aside>
</template>

<script lang="ts" setup>
import { useScanner } from '../composables/useScanner';
import { useStagecoach } from '../composables/useStagecoach';
import { computed } from 'vue';
import ScanSection from './sections/ScanSection.vue';
import PaperlessSection from './sections/PaperlessSection.vue';

const { apiAvailable: scannerEnabled, lastError: scannerError } = useScanner();
const { apiAvailable: stagecoachEnabled, lastError: stagecoachError } = useStagecoach();

const lastErrors = computed(() => [scannerError.value, stagecoachError.value].filter((e) => e));
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
}
</style>
