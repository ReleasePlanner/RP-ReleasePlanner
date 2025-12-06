import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
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
  TextField,
} from "@mui/material";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { planRcasService } from "@/api/services/planRcas.service";
import type { PlanRca } from "../../../types";

export type PlanRcaTabProps = {
  readonly planId: string;
};

export function PlanRcaTab({ planId }: PlanRcaTabProps) {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [editingRca, setEditingRca] = useState<PlanRca | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch RCAs
  const { data: rcas = [], isLoading, error } = useQuery({
    queryKey: ["plans", planId, "rcas"],
    queryFn: () => planRcasService.getByPlanId(planId),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: Parameters<typeof planRcasService.create>[1]) =>
      planRcasService.create(planId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans", planId, "rcas"] });
      setIsDialogOpen(false);
      setEditingRca(null);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof planRcasService.update>[2] }) =>
      planRcasService.update(planId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans", planId, "rcas"] });
      setIsDialogOpen(false);
      setEditingRca(null);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => planRcasService.delete(planId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans", planId, "rcas"] });
    },
  });

  const handleAdd = useCallback(() => {
    setEditingRca(null);
    setIsDialogOpen(true);
  }, []);

  const handleEdit = useCallback((rca: PlanRca) => {
    setEditingRca(rca);
    setIsDialogOpen(true);
  }, []);

  const handleDelete = useCallback((id: string) => {
    if (window.confirm("¿Está seguro de que desea eliminar este RCA?")) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  const handleClose = useCallback(() => {
    setIsDialogOpen(false);
    setEditingRca(null);
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
          p: { xs: 1.5, sm: 2 },
        }}
      >
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 1.5, sm: 2 } }}>
        <Alert severity="error">
          Error loading RCAs: {error instanceof Error ? error.message : "Unknown error"}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: "fit-content",
      }}
    >
      <Stack spacing={2} sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        {/* RCA Section */}
        <Box
          sx={{
            flex: "0 0 auto",
            border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box sx={{ p: { xs: 1.5, sm: 2 }, flexShrink: 0 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
                pb: 1,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                flexShrink: 0,
                flexWrap: { xs: "wrap", sm: "nowrap" },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                  color: theme.palette.text.primary,
                  flex: { xs: "1 1 100%", sm: "0 1 auto" },
                }}
              >
                Root Cause Analysis ({rcas.length})
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                onClick={handleAdd}
                sx={{
                  textTransform: "none",
                  fontSize: { xs: "0.625rem", sm: "0.6875rem" },
                  fontWeight: 500,
                  px: { xs: 1, sm: 1.25 },
                  py: 0.5,
                  borderRadius: 1,
                  minHeight: 26,
                  borderColor: alpha(theme.palette.primary.main, 0.5),
                  color: theme.palette.primary.main,
                  flexShrink: 0,
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                Add RCA
              </Button>
            </Box>
          </Box>

          <Divider />

          {/* RCAs List */}
          <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", p: { xs: 1.5, sm: 2 } }}>
            {rcas.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 200,
                  color: theme.palette.text.secondary,
                }}
              >
                <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                  No RCAs found
                </Typography>
                <Typography variant="caption" sx={{ mt: 1, fontSize: "0.75rem" }}>
                  Click "Add RCA" to create a new Root Cause Analysis record
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {rcas.map((rca) => (
                  <RcaCard
                    key={rca.id}
                    rca={rca}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </Stack>
            )}
          </Box>
        </Box>
      </Stack>

      {/* Edit/Create Dialog */}
      <RcaDialog
        open={isDialogOpen}
        rca={editingRca}
        planId={planId}
        onClose={handleClose}
        onSave={(data) => {
          if (editingRca) {
            updateMutation.mutate({ id: editingRca.id, data });
          } else {
            createMutation.mutate(data);
          }
        }}
        isSaving={createMutation.isPending || updateMutation.isPending}
      />
    </Box>
  );
}

type RcaCardProps = {
  rca: PlanRca;
  onEdit: (rca: PlanRca) => void;
  onDelete: (id: string) => void;
};

function RcaCard({ rca, onEdit, onDelete }: RcaCardProps) {
  const theme = useTheme();

  return (
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
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack spacing={1.5}>
              {(rca.supportTicketNumber || rca.rcaNumber) && (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                  {rca.supportTicketNumber && (
                    <Chip
                      label={`Ticket: ${rca.supportTicketNumber}`}
                      size="small"
                      sx={{
                        fontSize: "0.7rem",
                        height: 20,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                      }}
                    />
                  )}
                  {rca.rcaNumber && (
                    <Chip
                      label={`RCA: ${rca.rcaNumber}`}
                      size="small"
                      sx={{
                        fontSize: "0.7rem",
                        height: 20,
                        bgcolor: alpha(theme.palette.secondary.main, 0.1),
                        color: theme.palette.secondary.main,
                        border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`,
                      }}
                    />
                  )}
                </Box>
              )}

              {rca.keyIssuesTags && rca.keyIssuesTags.length > 0 && (
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                      display: "block",
                      mb: 0.5,
                    }}
                  >
                    Key Issues:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {rca.keyIssuesTags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{
                          fontSize: "0.7rem",
                          height: 20,
                          bgcolor: alpha(theme.palette.error.main, 0.1),
                          color: theme.palette.error.main,
                          border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {rca.learningsTags && rca.learningsTags.length > 0 && (
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                      display: "block",
                      mb: 0.5,
                    }}
                  >
                    Learnings:
                  </Typography>
                  <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {rca.learningsTags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{
                          fontSize: "0.7rem",
                          height: 20,
                          bgcolor: alpha(theme.palette.success.main, 0.1),
                          color: theme.palette.success.main,
                          border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {rca.technicalDescription && (
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.6875rem",
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                      display: "block",
                      mb: 0.5,
                    }}
                  >
                    Technical Description:
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.875rem",
                      color: theme.palette.text.primary,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {rca.technicalDescription}
                  </Typography>
                </Box>
              )}

              {rca.referenceFileUrl && (
                <Box>
                  <Button
                    component="a"
                    href={rca.referenceFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    startIcon={<LinkIcon sx={{ fontSize: 14 }} />}
                    size="small"
                    variant="outlined"
                    sx={{
                      textTransform: "none",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      px: 1.25,
                      py: 0.5,
                      borderRadius: 1,
                      minHeight: 26,
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                      color: theme.palette.primary.main,
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                      },
                    }}
                  >
                    Reference File
                  </Button>
                </Box>
              )}
            </Stack>
          </Box>

          <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
            <Tooltip title="Edit RCA" arrow placement="top">
              <IconButton
                size="small"
                onClick={() => onEdit(rca)}
                sx={{
                  width: 28,
                  height: 28,
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    color: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                <EditIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete RCA" arrow placement="top">
              <IconButton
                size="small"
                onClick={() => onDelete(rca.id)}
                sx={{
                  width: 28,
                  height: 28,
                  color: theme.palette.text.secondary,
                  "&:hover": {
                    color: theme.palette.error.main,
                    bgcolor: alpha(theme.palette.error.main, 0.08),
                  },
                }}
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

type RcaDialogProps = {
  open: boolean;
  rca: PlanRca | null;
  planId: string;
  onClose: () => void;
  onSave: (data: Parameters<typeof planRcasService.create>[1]) => void;
  isSaving: boolean;
};

function RcaDialog({ open, rca, planId, onClose, onSave, isSaving }: RcaDialogProps) {
  const [supportTicketNumber, setSupportTicketNumber] = useState(rca?.supportTicketNumber || "");
  const [rcaNumber, setRcaNumber] = useState(rca?.rcaNumber || "");
  const [keyIssuesTags, setKeyIssuesTags] = useState<string[]>(rca?.keyIssuesTags || []);
  const [learningsTags, setLearningsTags] = useState<string[]>(rca?.learningsTags || []);
  const [technicalDescription, setTechnicalDescription] = useState(rca?.technicalDescription || "");
  const [referenceFileUrl, setReferenceFileUrl] = useState(rca?.referenceFileUrl || "");
  const [newKeyIssueTag, setNewKeyIssueTag] = useState("");
  const [newLearningTag, setNewLearningTag] = useState("");

  const handleAddKeyIssueTag = () => {
    if (newKeyIssueTag.trim() && !keyIssuesTags.includes(newKeyIssueTag.trim())) {
      setKeyIssuesTags([...keyIssuesTags, newKeyIssueTag.trim()]);
      setNewKeyIssueTag("");
    }
  };

  const handleRemoveKeyIssueTag = (tag: string) => {
    setKeyIssuesTags(keyIssuesTags.filter((t) => t !== tag));
  };

  const handleAddLearningTag = () => {
    if (newLearningTag.trim() && !learningsTags.includes(newLearningTag.trim())) {
      setLearningsTags([...learningsTags, newLearningTag.trim()]);
      setNewLearningTag("");
    }
  };

  const handleRemoveLearningTag = (tag: string) => {
    setLearningsTags(learningsTags.filter((t) => t !== tag));
  };

  const handleSave = () => {
    onSave({
      supportTicketNumber: supportTicketNumber || undefined,
      rcaNumber: rcaNumber || undefined,
      keyIssuesTags: keyIssuesTags.length > 0 ? keyIssuesTags : undefined,
      learningsTags: learningsTags.length > 0 ? learningsTags : undefined,
      technicalDescription: technicalDescription || undefined,
      referenceFileUrl: referenceFileUrl || undefined,
    });
  };

  const handleClose = () => {
    setSupportTicketNumber(rca?.supportTicketNumber || "");
    setRcaNumber(rca?.rcaNumber || "");
    setKeyIssuesTags(rca?.keyIssuesTags || []);
    setLearningsTags(rca?.learningsTags || []);
    setTechnicalDescription(rca?.technicalDescription || "");
    setReferenceFileUrl(rca?.referenceFileUrl || "");
    setNewKeyIssueTag("");
    setNewLearningTag("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {rca ? "Edit RCA" : "Create RCA"}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Support Ticket Number"
            value={supportTicketNumber}
            onChange={(e) => setSupportTicketNumber(e.target.value)}
            fullWidth
            size="small"
          />

          <TextField
            label="RCA Number"
            value={rcaNumber}
            onChange={(e) => setRcaNumber(e.target.value)}
            fullWidth
            size="small"
          />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Key Issues Tags
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                placeholder="Add key issue tag"
                value={newKeyIssueTag}
                onChange={(e) => setNewKeyIssueTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddKeyIssueTag();
                  }
                }}
                size="small"
                sx={{ flex: 1 }}
              />
              <Button onClick={handleAddKeyIssueTag} variant="outlined" size="small">
                Add
              </Button>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {keyIssuesTags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  color="error"
                  onDelete={() => handleRemoveKeyIssueTag(tag)}
                />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Learnings Tags
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                placeholder="Add learning tag"
                value={newLearningTag}
                onChange={(e) => setNewLearningTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddLearningTag();
                  }
                }}
                size="small"
                sx={{ flex: 1 }}
              />
              <Button onClick={handleAddLearningTag} variant="outlined" size="small">
                Add
              </Button>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
              {learningsTags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  color="success"
                  onDelete={() => handleRemoveLearningTag(tag)}
                />
              ))}
            </Box>
          </Box>

          <TextField
            label="Technical Description"
            value={technicalDescription}
            onChange={(e) => setTechnicalDescription(e.target.value)}
            fullWidth
            multiline
            rows={4}
            size="small"
          />

          <TextField
            label="Reference File URL"
            value={referenceFileUrl}
            onChange={(e) => setReferenceFileUrl(e.target.value)}
            fullWidth
            size="small"
            placeholder="https://example.com/files/rca-document.pdf"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={isSaving}>
          {isSaving ? "Saving..." : rca ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

