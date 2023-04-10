import { useImageEditor } from './useImageEditor';
import { useScanner } from './useScanner';

const { scanObjectBlob, scanFormat, multiScanManager, multiScanIndex } = useScanner();
const imageEditor = useImageEditor(scanObjectBlob, scanFormat, (newBlob: Blob, format: string) => {
  multiScanManager.put(multiScanIndex.value, newBlob, format);
});

export const useScanImageEditor = () => imageEditor;
