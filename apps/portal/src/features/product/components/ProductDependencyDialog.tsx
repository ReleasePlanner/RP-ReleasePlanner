/**
 * Product Dependency Dialog Component
 *
 * Dialog for adding/editing product dependencies
 */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useProducts } from "@/api/hooks/useProducts";
import { useITOwners } from "@/api/hooks/useITOwners";
import { useTalents } from "@/api/hooks/useTalents";
import type {
  ProductDependency,
  CreateProductDependencyDto,
  UpdateProductDependencyDto,
} from "@/api/services/products.service";

interface ProductDependencyDialogProps {
  open: boolean;
  productId: string;
  dependency?: ProductDependency | null;
  onClose: () => void;
  onSave: (
    data: CreateProductDependencyDto | UpdateProductDependencyDto
  ) => void;
  isSaving?: boolean;
}

export function ProductDependencyDialog({
  open,
  productId,
  dependency,
  onClose,
  onSave,
  isSaving = false,
}: ProductDependencyDialogProps) {
  const isEditing = !!dependency;

  // Form state
  const [dependencyProductId, setDependencyProductId] = useState<string>("");
  const [ownerId, setOwnerId] = useState<string>("");
  const [technicalLeadId, setTechnicalLeadId] = useState<string>("");

  // Data hooks
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: owners = [], isLoading: ownersLoading } = useITOwners();
  const { data: talents = [], isLoading: talentsLoading } = useTalents();

  // Filter out the current product from available dependencies
  const availableProducts = products.filter((p) => p.id !== productId);

  // Initialize form when dependency changes
  useEffect(() => {
    if (dependency) {
      setDependencyProductId(dependency.dependencyProductId || "");
      setOwnerId(dependency.ownerId || "");
      setTechnicalLeadId(dependency.technicalLeadId || "");
    } else {
      setDependencyProductId("");
      setOwnerId("");
      setTechnicalLeadId("");
    }
  }, [dependency]);

  const handleSave = () => {
    if (!dependencyProductId) {
      return;
    }

    const data: CreateProductDependencyDto | UpdateProductDependencyDto = {
      dependencyProductId,
      ownerId: ownerId || undefined,
      technicalLeadId: technicalLeadId || undefined,
    };

    onSave(data);
  };

  const isValid = !!dependencyProductId;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        {isEditing ? "Edit Product Dependency" : "Add Product Dependency"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Dependency Product */}
          <FormControl fullWidth size="small" required>
            <InputLabel>Dependency Product</InputLabel>
            <Select
              value={dependencyProductId}
              onChange={(e) => setDependencyProductId(e.target.value)}
              label="Dependency Product"
              disabled={productsLoading || isSaving}
            >
              {productsLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={16} />
                  <Box sx={{ ml: 1 }}>Loading products...</Box>
                </MenuItem>
              ) : availableProducts.length === 0 ? (
                <MenuItem disabled>No products available</MenuItem>
              ) : (
                availableProducts.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {/* Owner */}
          <FormControl fullWidth size="small">
            <InputLabel>Owner</InputLabel>
            <Select
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              label="Owner"
              disabled={ownersLoading || isSaving}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {ownersLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={14} />
                  <Box sx={{ ml: 1 }}>Loading owners...</Box>
                </MenuItem>
              ) : (
                owners.map((owner) => (
                  <MenuItem key={owner.id} value={owner.id}>
                    {owner.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {/* Technical Lead */}
          <FormControl fullWidth size="small">
            <InputLabel>Technical Lead</InputLabel>
            <Select
              value={technicalLeadId}
              onChange={(e) => setTechnicalLeadId(e.target.value)}
              label="Technical Lead"
              disabled={talentsLoading || isSaving}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {talentsLoading ? (
                <MenuItem disabled>
                  <CircularProgress size={14} />
                  <Box sx={{ ml: 1 }}>Loading talents...</Box>
                </MenuItem>
              ) : (
                talents.map((talent) => (
                  <MenuItem key={talent.id} value={talent.id}>
                    {talent.name}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {isSaving && (
            <Alert severity="info">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2">Saving dependency...</Typography>
              </Box>
            </Alert>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!isValid || isSaving}
        >
          {isSaving
            ? "Saving..."
            : isEditing
            ? "Save Changes"
            : "Add Dependency"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
