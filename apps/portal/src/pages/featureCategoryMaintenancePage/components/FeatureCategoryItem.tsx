import { memo } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Divider,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import type { FeatureCategory } from "@/api/services/featureCategories.service";

export type FeatureCategoryItemProps = {
  readonly category: FeatureCategory;
  readonly isLast: boolean;
  readonly isDeleting: boolean;
  readonly onEdit: (category: FeatureCategory) => void;
  readonly onDelete: (categoryId: string) => void;
};

/**
 * Component for a single feature category item in the list
 */
export const FeatureCategoryItem = memo(function FeatureCategoryItem({
  category,
  isLast,
  isDeleting,
  onEdit,
  onDelete,
}: FeatureCategoryItemProps) {
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
        {/* Category Info */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: theme.palette.text.primary,
            }}
          >
            {category.name}
          </Typography>
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={0.25} sx={{ ml: 2 }}>
          <Tooltip title="Edit Feature Category">
            <IconButton
              size="small"
              onClick={() => onEdit(category)}
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
          <Tooltip title="Delete Feature Category">
            <IconButton
              size="small"
              onClick={() => onDelete(category.id)}
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

