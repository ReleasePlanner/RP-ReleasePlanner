import { useCallback } from "react";
import type {
  Product,
  ComponentVersion,
} from "@/api/services/products.service";
import type { ComponentType } from "@/api/services/componentTypes.service";

interface EditingProduct {
  product: Product;
  component?: ComponentVersion;
}

interface UseProductMaintenanceHandlersProps {
  products: Product[];
  componentTypes: ComponentType[];
  editingProduct: EditingProduct | null;
  selectedProduct: Product | null;
  setEditingProduct: (product: EditingProduct | null) => void;
  setSelectedProduct: (product: Product | null) => void;
  setOpenDialog: (open: boolean) => void;
  setOpenProductDialog: (open: boolean) => void;
  createMutation: {
    mutateAsync: (data: {
      name: string;
      components?: unknown[];
    }) => Promise<unknown>;
  };
  updateMutation: {
    mutateAsync: (params: {
      id: string;
      data: {
        name: string;
        components?: unknown[];
      };
    }) => Promise<unknown>;
  };
  deleteMutation: {
    mutateAsync: (id: string) => Promise<unknown>;
    isPending: boolean;
  };
}

/**
 * Helper function to check if a string is a valid UUID
 */
function isValidUUID(str: string | undefined): boolean {
  if (!str) return false;
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Hook for managing ProductMaintenancePage event handlers
 */
export function useProductMaintenanceHandlers({
  products,
  componentTypes,
  editingProduct,
  selectedProduct,
  setEditingProduct,
  setSelectedProduct,
  setOpenDialog,
  setOpenProductDialog,
  createMutation,
  updateMutation,
  deleteMutation,
}: UseProductMaintenanceHandlersProps) {
  const handleAddProduct = useCallback(() => {
    setEditingProduct({
      product: {
        id: `prod-${Date.now()}`,
        name: "",
        description: "",
        components: [],
        features: [],
      },
    });
    setSelectedProduct(null);
    setOpenProductDialog(true);
  }, [setEditingProduct, setSelectedProduct, setOpenProductDialog]);

  const handleEditProduct = useCallback(
    (product: Product) => {
      setEditingProduct({ product });
      setSelectedProduct(null);
      setOpenProductDialog(true);
    },
    [setEditingProduct, setSelectedProduct, setOpenProductDialog]
  );

  const handleDeleteProduct = useCallback(
    async (productId: string) => {
      if (
        !globalThis.confirm("Are you sure you want to delete this product?")
      ) {
        return;
      }

      try {
        await deleteMutation.mutateAsync(productId);
      } catch (error: unknown) {
        console.error("Error deleting product:", error);
        if (globalThis.alert) {
          globalThis.alert("Error deleting product. Please try again.");
        }
      }
    },
    [deleteMutation]
  );

  const handleEditComponent = useCallback(
    (product: Product, component: ComponentVersion) => {
      setSelectedProduct(product);
      // Map backend component format to dialog format
      let componentTypeId =
        (component as Record<string, unknown>).componentTypeId ||
        (component as Record<string, unknown>).componentType?.id;

      // If no componentTypeId but we have a type code, try to find the ComponentType by code
      if (!componentTypeId && component.type) {
        const foundType = componentTypes.find(
          (ct) =>
            ct.code?.toLowerCase() === component.type?.toLowerCase() ||
            ct.name?.toLowerCase() === component.type?.toLowerCase()
        );
        if (foundType) {
          componentTypeId = foundType.id;
        }
      }

      const mappedComponent = {
        ...component,
        name: component.name || component.type || "",
        type: component.type || "",
        version: component.currentVersion || component.version || "",
        description: component.description || "",
        componentTypeId: componentTypeId,
      };
      setEditingProduct({
        product,
        component: mappedComponent as ComponentVersion,
      });
      setOpenDialog(true);
    },
    [componentTypes, setSelectedProduct, setEditingProduct, setOpenDialog]
  );

  const handleDeleteComponent = useCallback(
    async (productId: string, componentId: string) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      try {
        await updateMutation.mutateAsync({
          id: productId,
          data: {
            components: product.components
              .filter((c: ComponentVersion) => c.id !== componentId)
              .map((c: ComponentVersion) => {
                let componentTypeId =
                  (c as Record<string, unknown>).componentTypeId ||
                  (c as Record<string, unknown>).componentType?.id;

                if (!componentTypeId && c.type) {
                  const foundType = componentTypes.find(
                    (ct) =>
                      ct.code?.toLowerCase() === c.type?.toLowerCase() ||
                      ct.name?.toLowerCase() === c.type?.toLowerCase()
                  );
                  if (foundType) {
                    componentTypeId = foundType.id;
                  }
                }

                if (!componentTypeId) {
                  console.error(
                    "handleDeleteComponent - Missing componentTypeId for component:",
                    c
                  );
                  throw new Error(
                    `Component type is required. Component "${
                      (c as Record<string, unknown>).name || c.type || "unknown"
                    }" is missing componentTypeId.`
                  );
                }

                return {
                  ...(c.id && isValidUUID(c.id) && { id: c.id }),
                  componentTypeId: componentTypeId,
                  name: ((c as Record<string, unknown>).name as string) || "",
                  currentVersion: c.currentVersion,
                  previousVersion: c.previousVersion,
                };
              }),
          },
        });
      } catch (error: unknown) {
        console.error("Error deleting component:", error);
      }
    },
    [products, componentTypes, updateMutation]
  );

  const handleAddComponent = useCallback(
    (product: Product) => {
      setSelectedProduct(product);
      setEditingProduct({
        product,
        component: {
          id: `comp-${Date.now()}`,
          name: "",
          type: "",
          version: "",
          description: "",
        } as ComponentVersion,
      });
      setOpenDialog(true);
    },
    [setSelectedProduct, setEditingProduct, setOpenDialog]
  );

  const handleSaveProduct = useCallback(
    async (product: Product) => {
      if (!product.name.trim()) return;

      try {
        const existingProduct = products.find((p) => p.id === product.id);
        if (existingProduct) {
          await updateMutation.mutateAsync({
            id: product.id,
            data: {
              name: product.name,
              components: product.components?.map((c: ComponentVersion) => {
                const componentData: any = {
                  ...(c.id && isValidUUID(c.id) && { id: c.id }),
                  currentVersion: c.currentVersion,
                  previousVersion: c.previousVersion,
                };
                
                // Prefer componentTypeId over type (legacy)
                if (c.componentTypeId) {
                  componentData.componentTypeId = c.componentTypeId;
                } else if (c.componentType?.id) {
                  componentData.componentTypeId = c.componentType.id;
                } else if (c.type && ['web', 'services', 'mobile'].includes(c.type)) {
                  // Only send type if it's a valid enum value (for backward compatibility)
                  componentData.type = c.type;
                }
                
                // Include name if present
                if (c.name) {
                  componentData.name = c.name;
                }
                
                return componentData;
              }),
            },
          });
        } else {
          await createMutation.mutateAsync({
            name: product.name,
            components: product.components?.map((c: ComponentVersion) => {
              const componentData: any = {
                currentVersion: c.currentVersion,
                previousVersion: c.previousVersion,
              };
              
              // Prefer componentTypeId over type (legacy)
              if (c.componentTypeId) {
                componentData.componentTypeId = c.componentTypeId;
              } else if (c.componentType?.id) {
                componentData.componentTypeId = c.componentType.id;
              } else if (c.type && ['web', 'services', 'mobile'].includes(c.type)) {
                // Only send type if it's a valid enum value (for backward compatibility)
                componentData.type = c.type;
              }
              
              // Include name if present
              if (c.name) {
                componentData.name = c.name;
              }
              
              return componentData;
            }),
          });
        }
        setOpenProductDialog(false);
        setEditingProduct(null);
        setSelectedProduct(null);
      } catch (error: unknown) {
        console.error("Error saving product:", error);
      }
    },
    [
      products,
      createMutation,
      updateMutation,
      setOpenProductDialog,
      setEditingProduct,
      setSelectedProduct,
    ]
  );

  const handleSaveComponent = useCallback(
    async (updatedComponent?: ComponentVersion) => {
      const componentToSave = updatedComponent || editingProduct?.component;
      if (!componentToSave) return;

      const product = selectedProduct || editingProduct?.product;
      if (!product) return;

      const existingProduct = products.find((p) => p.id === product.id);
      if (!existingProduct) return;

      try {
        const editingComponentId = componentToSave.id;
        const componentData = componentToSave as Record<string, unknown>;

        const componentExists =
          editingComponentId &&
          isValidUUID(editingComponentId) &&
          existingProduct.components.some(
            (c: ComponentVersion) =>
              c.id && isValidUUID(c.id) && c.id === editingComponentId
          );

        let currentVersion =
          (componentData.version as string) ||
          (componentData.currentVersion as string) ||
          "";

        if (!componentExists) {
          if (!currentVersion || currentVersion.trim() === "") {
            console.error("Missing currentVersion for new component", {
              componentData,
            });
            throw new Error(
              "Component currentVersion is required. Please enter a Current Version in the dialog."
            );
          }
        } else {
          if (!currentVersion || currentVersion.trim() === "") {
            const existingComp = existingProduct.components.find(
              (c: ComponentVersion) => c.id === editingComponentId
            );
            currentVersion = existingComp?.currentVersion || "";
            if (!currentVersion || currentVersion.trim() === "") {
              console.error("Missing currentVersion for existing component", {
                editingComponentId,
                existingComp,
              });
              throw new Error("Component currentVersion is required");
            }
          }
        }

        let previousVersion =
          (componentData.previousVersion as string) || "";

        if (componentExists) {
          const existingComp = existingProduct.components.find(
            (c: ComponentVersion) => c.id === editingComponentId
          );
          if (existingComp) {
            if (
              currentVersion &&
              existingComp.currentVersion !== currentVersion
            ) {
              previousVersion = existingComp.currentVersion || "";
            } else if (!previousVersion) {
              previousVersion = existingComp.previousVersion || "";
            }
          }
        } else {
          if (!previousVersion) {
            previousVersion = currentVersion;
          }
        }

        if (!currentVersion) {
          console.error("Missing currentVersion");
          throw new Error("Component currentVersion is required");
        }

        if (!previousVersion) {
          previousVersion = currentVersion;
        }

        let componentType =
          (componentData.type as string) || "";
        let componentTypeId = componentData.componentTypeId as string | undefined;

        if (componentExists) {
          const existingComp = existingProduct.components.find(
            (c: ComponentVersion) => c.id === editingComponentId
          );
          if (existingComp) {
            if (!componentType) {
              componentType = existingComp.type || "";
            }
            if (!componentTypeId) {
              componentTypeId = (existingComp as Record<string, unknown>)
                .componentTypeId as string | undefined;
            }
          }
        }

        if (componentType) {
          componentType = componentType.toLowerCase();
          if (componentType === "service") {
            componentType = "services";
          }
        }

        if (!componentType && !componentTypeId) {
          console.error("Missing component type", {
            componentData,
            componentExists,
            componentType,
            componentTypeId,
          });
          throw new Error(
            "Component type is required. Please select a Component Type in the dialog."
          );
        }

        if (
          !componentData.name ||
          (componentData.name as string).trim() === ""
        ) {
          console.error("Missing component name", { componentData });
          throw new Error(
            "Component name is required. Please enter a Component Name in the dialog."
          );
        }

        const updatedComponents = componentExists
          ? existingProduct.components.map((c: ComponentVersion) =>
              c.id === editingComponentId
                ? {
                    ...c,
                    name:
                      (componentData.name as string) ||
                      ((c as Record<string, unknown>).name as string),
                    type: componentType || c.type,
                    currentVersion: currentVersion,
                    previousVersion: previousVersion || c.previousVersion,
                    componentTypeId:
                      componentTypeId ||
                      ((c as Record<string, unknown>)
                        .componentTypeId as string),
                  }
                : c
            )
          : [
              ...existingProduct.components,
              {
                name: (componentData.name as string) || "",
                type: componentType,
                currentVersion: currentVersion,
                previousVersion: previousVersion,
                componentTypeId: componentTypeId,
                version: currentVersion,
              } as ComponentVersion,
            ];

        const componentsPayload = updatedComponents.map(
          (c: ComponentVersion) => {
            const compCurrentVersion =
              c.currentVersion || ((c as Record<string, unknown>).version as string) || "";
            const compPreviousVersion =
              c.previousVersion || compCurrentVersion || "";

            let compComponentTypeId =
              (c as Record<string, unknown>).componentTypeId ||
              (c as Record<string, unknown>).componentType?.id;

            if (!compComponentTypeId && c.type) {
              const foundType = componentTypes.find(
                (ct) =>
                  ct.code?.toLowerCase() === c.type?.toLowerCase() ||
                  ct.name?.toLowerCase() === c.type?.toLowerCase()
              );
              if (foundType) {
                compComponentTypeId = foundType.id;
              }
            }

            if (!compComponentTypeId || !isValidUUID(compComponentTypeId)) {
              console.error(
                "handleSaveComponent - Missing componentTypeId for component:",
                {
                  id: c.id,
                  name: (c as Record<string, unknown>).name,
                  type: c.type,
                  componentTypeId: (c as Record<string, unknown>).componentTypeId,
                  componentType: (c as Record<string, unknown>).componentType,
                }
              );
              throw new Error(
                `Component type is required. Component "${
                  (c as Record<string, unknown>).name || c.type || "unknown"
                }" is missing componentTypeId.`
              );
            }

            const componentPayload: Record<string, unknown> = {
              name: ((c as Record<string, unknown>).name as string) || "",
              componentTypeId: compComponentTypeId,
              currentVersion: compCurrentVersion,
              previousVersion: compPreviousVersion,
            };

            if (c.id && isValidUUID(c.id)) {
              componentPayload.id = c.id;
            }

            return componentPayload;
          }
        );

        await updateMutation.mutateAsync({
          id: product.id,
          data: {
            components: componentsPayload,
          },
        });

        setOpenDialog(false);
        setEditingProduct(null);
        setSelectedProduct(null);
      } catch (error: unknown) {
        console.error("Error saving component:", error);
        const errorWithResponse = error as {
          message?: string;
          response?: { data?: { message?: string } };
        };
        const errorMessage =
          errorWithResponse?.message ||
          errorWithResponse?.response?.data?.message ||
          "Error saving component. Please try again.";
        if (globalThis.alert) {
          globalThis.alert(errorMessage);
        }
      }
    },
    [
      editingProduct,
      selectedProduct,
      products,
      componentTypes,
      updateMutation,
      setOpenDialog,
      setEditingProduct,
      setSelectedProduct,
    ]
  );

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingProduct(null);
    setSelectedProduct(null);
  }, [setOpenDialog, setEditingProduct, setSelectedProduct]);

  const handleCloseProductDialog = useCallback(() => {
    setOpenProductDialog(false);
    setEditingProduct(null);
    setSelectedProduct(null);
  }, [setOpenProductDialog, setEditingProduct, setSelectedProduct]);

  return {
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleEditComponent,
    handleDeleteComponent,
    handleAddComponent,
    handleSaveProduct,
    handleSaveComponent,
    handleCloseDialog,
    handleCloseProductDialog,
  };
}

