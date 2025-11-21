import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";

interface ProductWithId {
  id: string;
  name: string;
}

export type PlanProductFieldProps = {
  readonly productId: string;
  readonly products: ProductWithId[];
  readonly error: string | null;
  readonly isSubmitting: boolean;
  readonly onChange: (productId: string) => void;
  readonly onErrorClear: () => void;
};

export function PlanProductField({
  productId,
  products,
  error,
  isSubmitting,
  onChange,
  onErrorClear,
}: PlanProductFieldProps) {
  return (
    <FormControl fullWidth size="small" required>
      <InputLabel id="product-label" sx={{ fontSize: "0.875rem" }}>
        Producto
      </InputLabel>
      <Select
        id="add-plan-product-select"
        name="planProductId"
        labelId="product-label"
        value={productId}
        label="Producto"
        onChange={(e: SelectChangeEvent) => {
          onChange(e.target.value);
          onErrorClear();
        }}
        disabled={isSubmitting}
        error={!!error && error.toLowerCase().includes("producto")}
        sx={{
          fontSize: "0.875rem",
          borderRadius: 1.5,
        }}
      >
        <MenuItem value="" sx={{ fontSize: "0.875rem" }}>
          <em>Seleccione un producto</em>
        </MenuItem>
        {products.map((product) => (
          <MenuItem
            key={product.id}
            value={product.id}
            sx={{ fontSize: "0.875rem" }}
          >
            {product.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

