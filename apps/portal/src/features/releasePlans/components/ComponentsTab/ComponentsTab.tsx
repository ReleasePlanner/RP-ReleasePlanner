/**
 * Components Tab - Shows components based on selected product
 *
 * This component demonstrates how the product selection in Common Data
 * can be used to filter and display relevant components.
 */

import { Box, Typography, useTheme } from "@mui/material";
import { getProductById } from "../../lib/productData";
import { NoProductState } from "./components/NoProductState";
import { ComponentsGrid } from "./components/ComponentsGrid";
import { EmptyComponentsState } from "./components/EmptyComponentsState";

export type ComponentsTabProps = {
  readonly selectedProduct?: string;
};

export function ComponentsTab({ selectedProduct }: ComponentsTabProps) {
  const theme = useTheme();
  const product = selectedProduct ? getProductById(selectedProduct) : null;

  if (!selectedProduct || !product) {
    return <NoProductState />;
  }

  const components = product.components as Array<
    string | { id: string; name: string }
  >;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: "1.125rem",
            color: theme.palette.text.primary,
            mb: 0.5,
          }}
        >
          Components for {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: "0.875rem" }}
        >
          {product.description}
        </Typography>
      </Box>

      {components.length === 0 ? (
        <EmptyComponentsState />
      ) : (
        <ComponentsGrid components={components} />
      )}
    </Box>
  );
}

export default ComponentsTab;
