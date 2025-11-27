import {
  TextField,
  Stack,
  Box,
  useTheme,
} from "@mui/material";
import { BaseEditDialog } from "@/components";
import type { Role } from "@/api/services/roles.service";

interface RoleEditDialogProps {
  open: boolean;
  role: Role | null;
  onClose: () => void;
  onSave: () => void;
  onRoleChange: (role: Role) => void;
}

export function RoleEditDialog({
  open,
  role,
  onClose,
  onSave,
  onRoleChange,
}: RoleEditDialogProps) {
  const theme = useTheme();
  const isEditing = role?.id && !role.id.startsWith('role-');

  if (!role) return null;

  const isValid = !!role.name?.trim();

  return (
    <BaseEditDialog
      open={open}
      onClose={onClose}
      editing={isEditing}
      title={isEditing ? "Edit Role" : "New Role"}
      subtitle="Manage role information"
      maxWidth="sm"
      onSave={onSave}
      saveButtonText={isEditing ? "Save Changes" : "Create Role"}
      isFormValid={isValid}
    >
      <Stack spacing={3} sx={{ width: "100%" }}>
        <Box sx={{ pt: 1 }} />
        
        {/* Role Name */}
        <TextField
          autoFocus
          fullWidth
          size="small"
          label="Role Name"
          placeholder="e.g., Senior Developer, Product Manager"
          value={role.name || ""}
          onChange={(e) =>
            onRoleChange({ ...role, name: e.target.value })
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
            "& .MuiFormHelperText-root": {
              marginTop: "4px",
              marginLeft: "0px",
              fontSize: "0.625rem",
            },
          }}
        />
      </Stack>
    </BaseEditDialog>
  );
}

