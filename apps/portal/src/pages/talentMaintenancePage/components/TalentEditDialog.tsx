import {
  TextField,
  Stack,
  Box,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  alpha,
} from "@mui/material";
import { BaseEditDialog } from "@/components";
import type { Talent } from "@/api/services/talents.service";
import { useRoles } from "@/api/hooks/useRoles";

interface TalentEditDialogProps {
  open: boolean;
  talent: Talent | null;
  onClose: () => void;
  onSave: () => void;
  onTalentChange: (talent: Talent) => void;
}

export function TalentEditDialog({
  open,
  talent,
  onClose,
  onSave,
  onTalentChange,
}: TalentEditDialogProps) {
  const theme = useTheme();
  const { data: roles = [], isLoading: rolesLoading } = useRoles();
  const isEditing = talent?.id && !talent.id.startsWith("talent-");

  if (!talent) return null;

  const isValid = !!talent.name?.trim() && 
    (!talent.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(talent.email));

  return (
    <BaseEditDialog
      open={open}
      onClose={onClose}
      editing={isEditing}
      title={isEditing ? "Edit Talent" : "New Talent"}
      subtitle="Manage talent information and role"
      maxWidth="sm"
      onSave={onSave}
      saveButtonText={isEditing ? "Save Changes" : "Create Talent"}
      isFormValid={isValid}
    >
      <Stack spacing={3} sx={{ width: "100%" }}>
        <Box sx={{ pt: 1 }} />

        {/* Talent Name */}
        <TextField
          autoFocus
          fullWidth
          size="small"
          label="Talent Name"
          placeholder="e.g., John Doe"
          value={talent.name || ""}
          onChange={(e) =>
            onTalentChange({ ...talent, name: e.target.value })
          }
          required
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.6875rem",
              "& input": {
                py: 0.625,
                fontSize: "0.6875rem",
              },
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                },
              },
            },
          }}
        />

        {/* Email */}
        <TextField
          fullWidth
          size="small"
          label="Email"
          type="email"
          placeholder="e.g., john.doe@example.com"
          value={talent.email || ""}
          onChange={(e) =>
            onTalentChange({ ...talent, email: e.target.value })
          }
          error={!!talent.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(talent.email)}
          helperText={
            talent.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(talent.email)
              ? "Invalid email format"
              : ""
          }
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.6875rem",
              "& input": {
                py: 0.625,
                fontSize: "0.6875rem",
              },
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                },
              },
            },
            "& .MuiFormHelperText-root": {
              marginTop: "4px",
              marginLeft: "0px",
              fontSize: "0.625rem",
            },
          }}
        />

        {/* Phone */}
        <TextField
          fullWidth
          size="small"
          label="Phone"
          placeholder="e.g., +1234567890"
          value={talent.phone || ""}
          onChange={(e) =>
            onTalentChange({ ...talent, phone: e.target.value })
          }
          InputLabelProps={{
            shrink: true,
            sx: {
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontSize: "0.6875rem",
              "& input": {
                py: 0.625,
                fontSize: "0.6875rem",
              },
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                },
              },
            },
          }}
        />

        {/* Role */}
        <FormControl fullWidth size="small">
          <InputLabel
            shrink
            sx={{
              fontSize: "0.625rem",
              fontWeight: 500,
              "&.MuiInputLabel-shrink": {
                backgroundColor: theme.palette.background.paper,
                paddingLeft: "6px",
                paddingRight: "6px",
                zIndex: 1,
              },
            }}
          >
            Role
          </InputLabel>
          <Select
            value={talent.roleId || ""}
            onChange={(e) =>
              onTalentChange({ ...talent, roleId: e.target.value || undefined })
            }
            displayEmpty
            disabled={rolesLoading}
            sx={{
              fontSize: "0.6875rem",
              "& .MuiSelect-select": {
                py: 0.625,
                fontSize: "0.6875rem",
              },
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "&.Mui-focused": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          >
            <MenuItem value="" sx={{ fontSize: "0.6875rem" }}>
              <em>No role assigned</em>
            </MenuItem>
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id} sx={{ fontSize: "0.6875rem" }}>
                {role.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
    </BaseEditDialog>
  );
}

