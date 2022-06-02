<template>
  <div class="wrapper">
    <Preview />
    <Controls />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Preview from './components/Preview.vue';
import Controls from './components/Controls.vue';

export default defineComponent({
  components: {
    Preview,
    Controls,
  },
});
</script>

<style lang="scss">
* {
  box-sizing: border-box;
  user-select: none;
}

html,
body {
  width: 100%;
  height: 100%;

  overflow: hidden;

  margin: 0;
  padding: 0;
}

body {
  background: #222;
  color: #f1f1f1;

  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app,
.wrapper {
  width: 100%;
  height: 100%;

  overflow: hidden;
}

.wrapper {
  display: flex;

  & > * {
    width: 100%;
  }
}
</style>
