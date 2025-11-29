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
  Tooltip,
  Grid
} from "@mui/material";
import { 
  InfoOutlined, 
  Close as CloseIcon,
  Category,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Code,
  Update
} from "@mui/icons-material";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import type { ComponentWithDetails } from "../hooks/usePlanComponents";

export type ComponentCardProps = {
  readonly component: ComponentWithDetails;
  readonly onEdit: (component: ComponentWithDetails) => void;
  readonly onDelete: (componentId: string) => void;
};

export function ComponentCard({ 
  component, 
  onEdit,
  onDelete 
}: ComponentCardProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

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
          borderLeft: `4px solid ${theme.palette.primary.main}`,
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
                  title={component.name}
                >
                  {component.name || component.id}
                </Typography>
                <Chip
                  label={component.type}
                  size="small"
                  sx={{
                    fontSize: "0.7rem",
                    height: 20,
                    bgcolor: theme.palette.secondary.light + "20",
                    color: theme.palette.secondary.main,
                  }}
                />
              </Box>

              {/* Versiones compactas */}
              <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                    Current:
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                      fontWeight: 500
                    }}
                  >
                    {component.currentVersion || "N/A"}
                  </Typography>
                </Box>
                {component.finalVersion && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                      Final:
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        fontFamily: "monospace",
                        color: theme.palette.primary.main, 
                        fontWeight: 600,
                        fontSize: "0.75rem"
                      }}
                    >
                      {component.finalVersion}
                    </Typography>
                  </Box>
                )}
              </Stack>
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
              <Tooltip title="Edit version">
                <IconButton
                  size="small"
                  onClick={() => onEdit(component)}
                  sx={{
                    color: theme.palette.primary.main,
                    "&:hover": {
                      bgcolor: theme.palette.primary.light + "20",
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete component">
                <IconButton
                  size="small"
                  onClick={() => onDelete(component.planComponentId)}
                  sx={{
                    color: theme.palette.error.main,
                    "&:hover": {
                      bgcolor: theme.palette.error.light + "20",
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
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
          Component Details
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
                <Code fontSize="small" sx={{ color: "text.secondary" }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Name
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {component.name || component.id}
              </Typography>
            </Box>

            <Divider />

            {/* Type */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Category fontSize="small" sx={{ color: "text.secondary" }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Type
                </Typography>
              </Box>
              <Chip 
                label={component.type} 
                size="small"
                sx={{
                  bgcolor: theme.palette.secondary.light + "20",
                  color: theme.palette.secondary.main,
                }}
              />
            </Box>

            <Divider />

            {/* Versions */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <Update fontSize="small" sx={{ color: "text.secondary" }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Versions
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                    Current Version
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: "monospace",
                      fontWeight: 500,
                      mt: 0.5
                    }}
                  >
                    {component.currentVersion || "Not set"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                    Final Version
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: "monospace",
                      fontWeight: component.finalVersion ? 600 : 400,
                      color: component.finalVersion ? theme.palette.primary.main : "text.disabled",
                      fontStyle: component.finalVersion ? "normal" : "italic",
                      mt: 0.5
                    }}
                  >
                    {component.finalVersion || "Not set"}
                  </Typography>
                </Grid>
                {component.previousVersion && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="caption" sx={{ color: "text.secondary", fontSize: "0.7rem" }}>
                      Previous Version
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontFamily: "monospace",
                        color: "text.secondary",
                        mt: 0.5
                      }}
                    >
                      {component.previousVersion}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* Component Type */}
            {component.componentType && (
              <>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Component Type
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {component.componentType.name}
                  </Typography>
                </Box>
              </>
            )}

            {/* Dates */}
            {(component.createdAt || component.updatedAt) && (
              <>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Dates
                  </Typography>
                  {component.createdAt && (
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                      Created: {new Date(component.createdAt).toLocaleDateString()}
                    </Typography>
                  )}
                  {component.updatedAt && (
                    <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                      Updated: {new Date(component.updatedAt).toLocaleDateString()}
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

