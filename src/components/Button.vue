<template>
  <div class="button" :class="[`type-${props.type}`, enabled ? 'enabled' : 'disabled']" @click="handleClick">
    <div class="progress-infinite" v-if="props.progress === -1" />
    <div class="progress-fill" :style="fillStyle" />
    <div class="progress-bg" :style="bgStyle" />
    <div class="label">{{ props.label }}</div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

interface Props {
  label: string;
  type?: 'primary' | 'secondary';
  progress?: number;
  enabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  progress: 1,
  type: 'primary',
  enabled: true,
});

interface Emits {
  (e: 'click'): void;
}

const emits = defineEmits<Emits>();

const fillStyle = computed(() => ({
  width: props.progress === -1 ? '100%' : `${props.progress * 100}%`,
}));

const bgStyle = computed(() => ({
  left: props.progress === -1 ? '100%' : `${props.progress * 100}%`,
  width: props.progress === -1 ? '0%' : `${100 - props.progress * 100}%`,
}));

const handleClick = (e: Event) => {
  e.stopPropagation();

  if (props.enabled) {
    emits('click');
  }
};
</script>

<style lang="scss" scoped>
.button {
  position: relative;
  overflow: hidden;

  cursor: pointer;

  width: 100%;
  height: 34px;

  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;

  border-radius: 3px;

  .progress-infinite,
  .progress-fill,
  .progress-bg,
  .label {
    position: absolute;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
  }

  .progress-bg,
  .progress-fill {
    z-index: 10;
  }

  .progress-infinite {
    z-index: 20;

    background: linear-gradient(
        -45deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0) 30%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0) 80%,
        rgba(255, 255, 255, 0) 100%
      )
      no-repeat;
    background-size: 200% 100%;

    @keyframes infinity {
      0% {
        background-position-x: 200%;
      }

      50% {
        background-position-x: 0;
      }

      100% {
        background-position-x: -200%;
      }
    }

    animation-name: infinity;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-direction: normal;
    animation-timing-function: linear;
  }

  .label {
    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 30;
  }

  &.type-primary {
    border: 1px solid rgba(50, 255, 50, 0.4);

    .progress-fill {
      background-color: rgba(50, 255, 50, 0.2);
    }

    .progress-bg {
      background-color: rgba(50, 255, 50, 0.1);
    }
  }

  &.type-secondary {
    border: 1px solid rgba(50, 100, 220, 0.4);

    .progress-fill {
      background-color: rgba(50, 100, 220, 0.2);
    }

    .progress-bg {
      background-color: rgba(50, 100, 220, 0.1);
    }
  }

  &.disabled {
    cursor: default;
    opacity: 0.5;
  }
}
</style>
