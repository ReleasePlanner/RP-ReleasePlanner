import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
} from "@mui/material";
import { useState } from "react";
import { useRoles } from "@/api/hooks/useRoles";
import type { Team } from "@/api/services/teams.service";

interface CreateTalentDialogProps {
  open: boolean;
  team: Team | null;
  onClose: () => void;
  onSave: (talentData: {
    name: string;
    email?: string;
    phone?: string;
    roleId?: string;
    allocationPercentage: number;
  }) => void;
}

export function CreateTalentDialog({
  open,
  team,
  onClose,
  onSave,
}: CreateTalentDialogProps) {
  const theme = useTheme();
  const { data: roles = [], isLoading: rolesLoading } = useRoles();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState<string>("");
  const [allocationPercentage, setAllocationPercentage] = useState<number>(100);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isValid =
    !!name.trim() &&
    allocationPercentage >= 0 &&
    allocationPercentage <= 100;

  const handleClose = () => {
    setName("");
    setEmail("");
    setPhone("");
    setRoleId("");
    setAllocationPercentage(100);
    setErrors({});
    onClose();
  };

  const handleSave = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (allocationPercentage < 0 || allocationPercentage > 100) {
      newErrors.allocationPercentage = "Allocation must be between 0 and 100";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: name.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      roleId: roleId || undefined,
      allocationPercentage,
    });
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontSize: "1rem",
          fontWeight: 600,
          pb: 1,
        }}
      >
        Create New Talent
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="Name"
            placeholder="e.g., John Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) {
                setErrors({ ...errors, name: "" });
              }
            }}
            required
            error={!!errors.name}
            helperText={errors.name}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: "0.75rem",
                fontWeight: 500,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "0.875rem",
              },
            }}
          />
          <TextField
            fullWidth
            size="small"
            label="Email"
            type="email"
            placeholder="john.doe@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: "0.75rem",
                fontWeight: 500,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "0.875rem",
              },
            }}
          />
          <TextField
            fullWidth
            size="small"
            label="Phone"
            placeholder="+1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: "0.75rem",
                fontWeight: 500,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "0.875rem",
              },
            }}
          />
          <FormControl fullWidth size="small">
            <InputLabel
              shrink
              sx={{
                fontSize: "0.75rem",
                fontWeight: 500,
              }}
            >
              Role/Profile
            </InputLabel>
            <Select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              displayEmpty
              disabled={rolesLoading}
              sx={{
                fontSize: "0.875rem",
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            size="small"
            label="Allocation %"
            type="number"
            inputProps={{
              min: 0,
              max: 100,
              step: 0.01,
            }}
            placeholder="100"
            value={allocationPercentage}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                const clampedValue = Math.max(0, Math.min(100, value));
                setAllocationPercentage(clampedValue);
                if (errors.allocationPercentage) {
                  setErrors({ ...errors, allocationPercentage: "" });
                }
              }
            }}
            error={!!errors.allocationPercentage}
            helperText={errors.allocationPercentage || "Percentage of time allocated to this team"}
            InputLabelProps={{
              shrink: true,
              sx: {
                fontSize: "0.75rem",
                fontWeight: 500,
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "0.875rem",
              },
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        }}
      >
        <Button onClick={handleClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!isValid}
        >
          Create & Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

