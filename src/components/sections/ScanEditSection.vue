<template>
  <div class="section">
    <h3>Edit</h3>
    <div class="buttons">
      <Button type="secondary" label="Rotate Left" @click="() => rotate('left')" :enabled="!isProcessing" />
      <Button type="secondary" label="Rotate Right" @click="() => rotate('right')" :enabled="!isProcessing" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from '../Button.vue';
import { useScanImageEditor } from '../../composables/useScanImageEditor';

const { rotate, isProcessing } = useScanImageEditor();
</script>

<style lang="scss" scoped>
@use '../../styles/section';
</style>
