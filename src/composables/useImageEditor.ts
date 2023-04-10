import { Ref, ref, watch } from 'vue';
import { BlobType, ImageEditor, RotationDirection } from '../common/ImageEditor';

export const useImageEditor = (imageBlob: Ref<Blob | null>, imageFormat: Ref<string>) => {
  const imageEditorPromise = ref(Promise.resolve(new ImageEditor()));

  const isProcessing = ref(false);

  watch(
    imageBlob,
    (newBlob) => {
      if (newBlob) {
        imageEditorPromise.value = imageEditorPromise.value.then((imageEditor) => imageEditor.loadImage(newBlob));
      }
    },
    {
      immediate: true,
    },
  );

  const rotate = async (dir: RotationDirection) => {
    isProcessing.value = true;

    imageBlob.value = await imageEditorPromise.value.then((imageEditor) =>
      imageEditor.rotate(dir).getBlob(imageFormat.value as BlobType),
    );

    isProcessing.value = false;
  };

  return {
    rotate,
    isProcessing,
  };
};
