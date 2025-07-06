import { useScanBarcode } from './useProductQuery';

// Legacy hook for backward compatibility
export const useBarcode = () => {
  const scanMutation = useScanBarcode();

  return {
    scanBarcode: async (barcode: string) => {
      try {
        const data = await scanMutation.mutateAsync(barcode);
        return data;
      } catch (error) {
        return null;
      }
    },
    isScanning: scanMutation.isPending,
    error: scanMutation.error?.message || null,
  };
};