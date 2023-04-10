<template>
  <div class="section">
    <h3>Edit</h3>
    <div class="buttons">
      <Button type="secondary" label="Rotate Left" @click="() => rotate('left')" :enabled="enabled" />
      <Button type="secondary" label="Rotate Right" @click="() => rotate('right')" :enabled="enabled" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from '../Button.vue';
import { useScanImageEditor } from '../../composables/useScanImageEditor';
import { useScanner } from '../../composables/useScanner';
import { useGotenberg } from '../../composables/useGotenberg';
import { useStagecoach } from '../../composables/useStagecoach';
import { computed } from 'vue';

const { isScanning } = useScanner();
const { isRunning } = useGotenberg();
const { isUploading } = useStagecoach();
const { rotate, isProcessing } = useScanImageEditor();

const enabled = computed(() => !isScanning.value && !isRunning.value && !isUploading.value && !isProcessing.value);
</script>

<style lang="scss" scoped>
@use '../../styles/section';
</style>
