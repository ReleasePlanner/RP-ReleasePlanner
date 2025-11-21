import { memo } from "react";
import { Paper, useTheme, alpha } from "@mui/material";
import type { Product } from "@/api/services/products.service";
import { ProductItem } from "./ProductItem";

export type ProductMaintenanceListProps = {
  readonly products: Product[];
  readonly isDeleting: boolean;
  readonly onEdit: (product: Product) => void;
  readonly onDelete: (productId: string) => void;
};

/**
 * Component for the list of products
 */
export const ProductMaintenanceList = memo(function ProductMaintenanceList({
  products,
  isDeleting,
  onEdit,
  onDelete,
}: ProductMaintenanceListProps) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {products.map((product, index) => (
        <ProductItem
          key={product.id}
          product={product}
          isLast={index === products.length - 1}
          isDeleting={isDeleting}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Paper>
  );
});

