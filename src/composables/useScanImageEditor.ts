import { useImageEditor } from './useImageEditor';
import { useScanner } from './useScanner';

const { scanObjectBlob, scanFormat } = useScanner();
const imageEditor = useImageEditor(scanObjectBlob, scanFormat);

export const useScanImageEditor = () => imageEditor;
