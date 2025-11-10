import { useState } from "react";
import { useAppSelector } from "@/store/hooks";

export function useProductSelection() {
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  const products = useAppSelector((state) => state.products.products);
  const selectedProduct = selectedProductId
    ? products.find((p) => p.id === selectedProductId)
    : undefined;

  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
  };

  return {
    products,
    selectedProduct,
    selectedProductId,
    handleProductChange,
  };
}
