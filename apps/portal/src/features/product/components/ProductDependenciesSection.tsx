/**
 * Product Dependencies Section Component
 *
 * Displays and manages product dependencies
 */

import { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { ProductDependencyDialog } from "./ProductDependencyDialog";
import {
  useProductDependencies,
  useAddProductDependency,
  useUpdateProductDependency,
  useDeleteProductDependency,
} from "@/api/hooks/useProducts";
import type {
  ProductDependency,
  CreateProductDependencyDto,
  UpdateProductDependencyDto,
} from "@/api/services/products.service";

interface ProductDependenciesSectionProps {
  productId: string;
}

export function ProductDependenciesSection({
  productId,
}: ProductDependenciesSectionProps) {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDependency, setEditingDependency] =
    useState<ProductDependency | null>(null);

  const {
    data: dependencies = [],
    isLoading,
    error,
  } = useProductDependencies(productId);
  const addMutation = useAddProductDependency(productId);
  const updateMutation = useUpdateProductDependency(productId);
  const deleteMutation = useDeleteProductDependency(productId);

  const handleAdd = () => {
    setEditingDependency(null);
    setDialogOpen(true);
  };

  const handleEdit = (dependency: ProductDependency) => {
    setEditingDependency(dependency);
    setDialogOpen(true);
  };

  const handleDelete = async (dependencyId: string) => {
    if (
      globalThis.confirm("Are you sure you want to delete this dependency?")
    ) {
      await deleteMutation.mutateAsync(dependencyId);
    }
  };

  const handleSave = async (
    data: CreateProductDependencyDto | UpdateProductDependencyDto
  ) => {
    try {
      if (editingDependency) {
        await updateMutation.mutateAsync({
          dependencyId: editingDependency.id,
          data: data as UpdateProductDependencyDto,
        });
      } else {
        await addMutation.mutateAsync(data as CreateProductDependencyDto);
      }
      setDialogOpen(false);
      setEditingDependency(null);
    } catch (error) {
      console.error("Error saving dependency:", error);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingDependency(null);
  };

  const isSaving = addMutation.isPending || updateMutation.isPending;

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
          Product Dependencies
        </Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAdd}
          size="small"
          variant="outlined"
          disabled={isLoading}
        >
          Add Dependency
        </Button>
      </Stack>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load dependencies. Please try again.
        </Alert>
      )}

      {!isLoading && !error && dependencies.length === 0 && (
        <Alert severity="info">
          No dependencies configured. Click "Add Dependency" to add one.
        </Alert>
      )}

      {!isLoading && !error && dependencies.length > 0 && (
        <Stack spacing={1}>
          {dependencies.map((dependency, index) => (
            <Card
              key={dependency.id}
              variant="outlined"
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                borderColor: alpha(theme.palette.divider, 0.08),
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                <Stack spacing={1.5}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.8125rem",
                          mb: 0.5,
                        }}
                      >
                        {dependency.dependencyProductName || "Unknown Product"}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {dependency.ownerName && (
                          <Chip
                            label={`Owner: ${dependency.ownerName}`}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.625rem",
                              bgcolor: alpha(theme.palette.info.main, 0.1),
                              color: theme.palette.info.main,
                            }}
                          />
                        )}
                        {dependency.technicalLeadName && (
                          <Chip
                            label={`Lead: ${dependency.technicalLeadName}`}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.625rem",
                              bgcolor: alpha(theme.palette.success.main, 0.1),
                              color: theme.palette.success.main,
                            }}
                          />
                        )}
                      </Stack>
                    </Box>
                    <Stack direction="row" spacing={0.5}>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(dependency)}
                        disabled={deleteMutation.isPending}
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
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(dependency.id)}
                        disabled={deleteMutation.isPending}
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
                        {deleteMutation.isPending ? (
                          <CircularProgress size={14} />
                        ) : (
                          <DeleteIcon fontSize="inherit" />
                        )}
                      </IconButton>
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <ProductDependencyDialog
        open={dialogOpen}
        productId={productId}
        dependency={editingDependency}
        onClose={handleClose}
        onSave={handleSave}
        isSaving={isSaving}
      />
    </Box>
  );
}
