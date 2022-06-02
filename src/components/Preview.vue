<template>
  <div class="preview">
    <img :src="scanObjectUrl" alt="" v-if="scanObjectUrl" />
    <div class="placeholder" v-else>:)</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useScanner from '../composables/useScanner';

export default defineComponent({
  setup() {
    const { scanObjectUrl } = useScanner();

    return { scanObjectUrl };
  },
});
</script>

<style scoped lang="scss">
.preview {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px;

  img {
    height: 100%;
    width: auto;

    box-shadow: 3px 3px 10px #111;

    border: 1px solid rgba(255, 255, 255, 0.75);
    display: block;

    border-radius: 6px;
    overflow: hidden;
  }

  .placeholder {
    font-size: 400px;
    color: rgba(255, 255, 255, 0.05);
  }
}
</style>
