<template>
  <div class="control">
    <div class="label">{{ label }}</div>
    <div class="value">
      <input :type="props.type" :value="props.modelValue" @input="updateValue" />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  modelValue: number | string;
  label: string;
  type?: 'text' | 'password' | 'number';
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
});
const emits = defineEmits<Emits>();

const updateValue = (event: Event) => emits('update:modelValue', (event.target as HTMLSelectElement).value);
</script>

<style scoped lang="scss">
@use '../styles/controls';
</style>
