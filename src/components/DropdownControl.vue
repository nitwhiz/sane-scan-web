<template>
  <div class="control">
    <div class="label">{{ label }}</div>
    <div class="value">
      <select :value="props.modelValue" @change="updateValue">
        <option v-for="o in props.options" :value="o.value">{{ o.label }}</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: number | string;
  label: string;
  options: { label: string | number; value: any }[];
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const updateValue = (event: Event) => emits('update:modelValue', (event.target as HTMLSelectElement).value);
</script>

<style scoped lang="scss">
@use '../styles/controls';
</style>
