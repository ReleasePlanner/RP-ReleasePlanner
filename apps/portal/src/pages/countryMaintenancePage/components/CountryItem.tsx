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
import type { Country } from "@/api/services/countries.service";

export type CountryItemProps = {
  readonly country: Country;
  readonly isLast: boolean;
  readonly isDeleting: boolean;
  readonly onEdit: (country: Country) => void;
  readonly onDelete: (countryId: string) => void;
};

/**
 * Component for a single country item in the list
 */
export const CountryItem = memo(function CountryItem({
  country,
  isLast,
  isDeleting,
  onEdit,
  onDelete,
}: CountryItemProps) {
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
        {/* Country Info */}
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
            {country.name}
          </Typography>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
            <Chip
              label={country.code}
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
            {country.isoCode && (
              <Chip
                label={country.isoCode}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  bgcolor: alpha(theme.palette.text.secondary, 0.1),
                  color: theme.palette.text.secondary,
                  "& .MuiChip-label": {
                    px: 0.75,
                  },
                }}
              />
            )}
            {country.region && (
              <Chip
                label={country.region}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  "& .MuiChip-label": {
                    px: 0.75,
                  },
                }}
              />
            )}
          </Stack>
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={0.25} sx={{ ml: 2 }}>
          <Tooltip title="Edit Country">
            <IconButton
              size="small"
              onClick={() => onEdit(country)}
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
          <Tooltip title="Delete Country">
            <IconButton
              size="small"
              onClick={() => onDelete(country.id)}
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

