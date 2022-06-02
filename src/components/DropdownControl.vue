<template>
  <div class="control">
    <div class="label">{{ label }}</div>
    <div class="value">
      <select :value="modelValue" @change="updateValue">
        <option v-for="o in options" :value="o.value">{{ o.label }}</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    modelValue: [Number, String],
    options: {
      type: Array as PropType<{ label: string | number; value: any }[]>,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const updateValue = (event: Event) => {
      context.emit('update:modelValue', (event.target as HTMLSelectElement).value);
    };

    return { updateValue };
  },
});
</script>

<style scoped lang="scss">
.control {
  margin-bottom: 8px;

  .label {
    font-size: 15px;
  }

  .value {
    select {
      color: white;
      padding: 4px 6px;
      font-size: 14px;
      width: 100%;

      background: rgba(255, 255, 255, 0.2);
      border: 0;

      border-bottom: 2px solid rgba(255, 255, 255, 0.4);

      margin: 6px 0;

      &:focus {
        outline: 0;
      }

      option {
        background: rgba(0, 0, 0, 0.8);
      }
    }
  }
}
</style>
