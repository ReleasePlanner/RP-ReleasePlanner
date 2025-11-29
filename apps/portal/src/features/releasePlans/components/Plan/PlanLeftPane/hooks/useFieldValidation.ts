import { useMemo, useEffect } from "react";

export function useFieldValidation(
  localProductId: string | undefined,
  localItOwner: string | undefined,
  localLeadId: string | undefined,
  products: Array<{ id: string }>,
  itOwners: Array<{ id: string }>,
  talents: Array<{ id: string }>,
  isLoadingProducts: boolean,
  isLoadingITOwners: boolean,
  isLoadingTalents: boolean,
  onProductChange?: (productId: string) => void,
  onITOwnerChange?: (itOwnerId: string) => void,
  onLeadIdChange?: (leadId: string) => void
) {
  // Validate that the current values exist in the available options
  const validProductId = useMemo(() => {
    if (!localProductId) return "";
    if (isLoadingProducts || products.length === 0) return "";
    const exists = products.some((p) => p.id === localProductId);
    return exists ? localProductId : "";
  }, [localProductId, products, isLoadingProducts]);

  const validItOwner = useMemo(() => {
    if (!localItOwner) return "";
    if (isLoadingITOwners) return "";
    const exists = itOwners.some((o) => o.id === localItOwner);
    return exists ? localItOwner : "";
  }, [localItOwner, itOwners, isLoadingITOwners]);

  const validLeadId = useMemo(() => {
    if (!localLeadId) return "";
    if (isLoadingTalents) return "";
    const exists = talents.some((t) => t.id === localLeadId);
    return exists ? localLeadId : "";
  }, [localLeadId, talents, isLoadingTalents]);

  // Sync local state when validation detects invalid values
  useEffect(() => {
    if (
      !isLoadingProducts &&
      products.length > 0 &&
      localProductId &&
      validProductId !== localProductId
    ) {
      if (onProductChange) {
        onProductChange("");
      }
    }
  }, [
    localProductId,
    validProductId,
    products.length,
    isLoadingProducts,
    onProductChange,
  ]);

  useEffect(() => {
    if (
      !isLoadingITOwners &&
      localItOwner &&
      validItOwner !== localItOwner
    ) {
      if (onITOwnerChange) {
        onITOwnerChange("");
      }
    }
  }, [localItOwner, validItOwner, isLoadingITOwners, onITOwnerChange]);

  useEffect(() => {
    if (
      !isLoadingTalents &&
      localLeadId &&
      validLeadId !== localLeadId
    ) {
      if (onLeadIdChange) {
        onLeadIdChange("");
      }
    }
  }, [localLeadId, validLeadId, isLoadingTalents, onLeadIdChange]);

  return {
    validProductId,
    validItOwner,
    validLeadId,
  };
}

