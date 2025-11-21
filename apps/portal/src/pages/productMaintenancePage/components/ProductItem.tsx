import { memo } from "react";
import {
  Box,
  Typography,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { Product } from "@/api/services/products.service";

export type ProductItemProps = {
  readonly product: Product;
  readonly isLast: boolean;
  readonly isDeleting: boolean;
  readonly onEdit: (product: Product) => void;
  readonly onDelete: (productId: string) => void;
};

/**
 * Component for a single product item in the list
 */
export const ProductItem = memo(function ProductItem({
  product,
  isLast,
  isDeleting,
  onEdit,
  onDelete,
}: ProductItemProps) {
  const theme = useTheme();

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
          py: 1.5,
          transition: theme.transitions.create(["background-color"], {
            duration: theme.transitions.duration.shorter,
          }),
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.04),
          },
        }}
      >
        {/* Product Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: theme.palette.text.primary,
              mb: 0.25,
            }}
          >
            {product.name}
          </Typography>
          {product.description && (
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.6875rem",
                color: theme.palette.text.secondary,
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {product.description}
            </Typography>
          )}
          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
            <Chip
              label={`${product.components.length} component${
                product.components.length !== 1 ? "s" : ""
              }`}
              size="small"
              sx={{
                height: 18,
                fontSize: "0.625rem",
                fontWeight: 500,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                "& .MuiChip-label": {
                  px: 0.75,
                },
              }}
            />
          </Stack>
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={0.25} sx={{ ml: 2 }}>
          <Tooltip title="Edit product">
            <IconButton
              size="small"
              onClick={() => onEdit(product)}
              sx={{
                fontSize: 16,
                p: 0.75,
                color: theme.palette.text.secondary,
                "&:hover": {
                  color: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                },
              }}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete product">
            <IconButton
              size="small"
              onClick={() => onDelete(product.id)}
              disabled={isDeleting}
              sx={{
                fontSize: 16,
                p: 0.75,
                color: theme.palette.text.secondary,
                "&:hover": {
                  color: theme.palette.error.main,
                  bgcolor: alpha(theme.palette.error.main, 0.08),
                },
              }}
            >
              {isDeleting ? (
                <CircularProgress size={14} />
              ) : (
                <DeleteIcon fontSize="inherit" />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      {!isLast && (
        <Divider sx={{ borderColor: alpha(theme.palette.divider, 0.08) }} />
      )}
    </Box>
  );
});

