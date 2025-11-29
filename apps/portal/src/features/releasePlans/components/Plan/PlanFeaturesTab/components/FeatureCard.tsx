import { 
  Box, 
  Typography, 
  Chip, 
  Card, 
  CardContent, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  Stack,
  Divider,
  Tooltip
} from "@mui/material";
import { 
  InfoOutlined, 
  Close as CloseIcon,
  Category,
  Delete as DeleteIcon,
  CheckCircle,
  Schedule,
  Person
} from "@mui/icons-material";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import type { Feature } from "../../../../../feature/types";
import { STATUS_LABELS, STATUS_COLORS } from "../../../../../feature/constants";
import { CircularProgress } from "@mui/material";

export type FeatureCardProps = {
  readonly feature: Feature;
  readonly isRemoving: boolean;
  readonly onDelete: (featureId: string) => void;
};

export function FeatureCard({ 
  feature, 
  isRemoving,
  onDelete 
}: FeatureCardProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  
  const statusColor = STATUS_COLORS[feature.status] || "default";
  const statusLabel = STATUS_LABELS[feature.status] || feature.status;

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: theme.shadows[4],
            transform: "translateY(-2px)",
          },
          borderLeft: `4px solid ${theme.palette[statusColor]?.main || theme.palette.primary.main}`,
        }}
      >
        <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
            {/* Información principal */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                  }}
                  title={feature.name}
                >
                  {feature.name}
                </Typography>
                {feature.category && (
                  <Chip
                    label={feature.category.name}
                    size="small"
                    sx={{
                      fontSize: "0.7rem",
                      height: 20,
                      bgcolor: theme.palette.primary.light + "20",
                      color: theme.palette.primary.main,
                    }}
                  />
                )}
                <Chip
                  label={statusLabel}
                  size="small"
                  color={statusColor}
                  variant="outlined"
                  sx={{
                    fontSize: "0.7rem",
                    height: 20,
                  }}
                />
              </Box>

              {/* Descripción compacta */}
              {feature.description && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: "text.secondary", 
                    fontSize: "0.7rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                  title={feature.description}
                >
                  {feature.description}
                </Typography>
              )}
            </Box>

            {/* Botones de acción */}
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Tooltip title="View details">
                <IconButton
                  size="small"
                  onClick={() => setOpen(true)}
                  sx={{
                    color: theme.palette.primary.main,
                    "&:hover": {
                      bgcolor: theme.palette.primary.light + "20",
                    },
                  }}
                >
                  <InfoOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Remove feature">
                <IconButton
                  size="small"
                  onClick={() => onDelete(feature.id)}
                  disabled={isRemoving}
                  sx={{
                    color: theme.palette.error.main,
                    "&:hover": {
                      bgcolor: theme.palette.error.light + "20",
                    },
                    "&:disabled": {
                      opacity: 0.5,
                    },
                  }}
                >
                  {isRemoving ? (
                    <CircularProgress size={16} />
                  ) : (
                    <DeleteIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Dialog con detalles completos */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Feature Details
          <IconButton
            size="small"
            onClick={() => setOpen(false)}
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {/* Name */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <CheckCircle fontSize="small" sx={{ color: "text.secondary" }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Name
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {feature.name}
              </Typography>
            </Box>

            <Divider />

            {/* Description */}
            {feature.description && (
              <>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Description
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.secondary", whiteSpace: "pre-wrap" }}>
                    {feature.description}
                  </Typography>
                </Box>
                <Divider />
              </>
            )}

            {/* Category */}
            {feature.category && (
              <>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Category fontSize="small" sx={{ color: "text.secondary" }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Category
                    </Typography>
                  </Box>
                  <Chip 
                    label={feature.category.name} 
                    size="small"
                    sx={{
                      bgcolor: theme.palette.primary.light + "20",
                      color: theme.palette.primary.main,
                    }}
                  />
                </Box>
                <Divider />
              </>
            )}

            {/* Status */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Schedule fontSize="small" sx={{ color: "text.secondary" }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Status
                </Typography>
              </Box>
              <Chip 
                label={statusLabel} 
                size="small" 
                color={statusColor}
                variant="outlined"
              />
            </Box>

            {/* Created By */}
            {feature.createdBy && (
              <>
                <Divider />
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Person fontSize="small" sx={{ color: "text.secondary" }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Created By
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {feature.createdBy.name}
                  </Typography>
                </Box>
              </>
            )}

            {/* Technical Description */}
            {feature.technicalDescription && (
              <>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Technical Description
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", whiteSpace: "pre-wrap" }}>
                    {feature.technicalDescription}
                  </Typography>
                </Box>
              </>
            )}

            {/* Business Description */}
            {feature.businessDescription && (
              <>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Business Description
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", whiteSpace: "pre-wrap" }}>
                    {feature.businessDescription}
                  </Typography>
                </Box>
              </>
            )}

            {/* Dates */}
            {(feature.createdAt || feature.updatedAt) && (
              <>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Dates
                  </Typography>
                  {feature.createdAt && (
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                      Created: {new Date(feature.createdAt).toLocaleDateString()}
                    </Typography>
                  )}
                  {feature.updatedAt && (
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                      Updated: {new Date(feature.updatedAt).toLocaleDateString()}
                    </Typography>
                  )}
                </Box>
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

