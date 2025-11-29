import { Box } from "@mui/material";
import type { PlanComponent } from "../../../../../types";
import { CurrentVersionDisplay, VersionTextField } from "./components";
import { useVersionForm } from "./hooks";
import { BaseEditDialog } from "../../../../../../components/BaseEditDialog";

export type ComponentVersionEditDialogProps = {
  readonly open: boolean;
  readonly component: PlanComponent | null;
  readonly currentVersion: string;
  readonly onClose: () => void;
  readonly onSave: (component: PlanComponent) => void;
};

export function ComponentVersionEditDialog({
  open,
  component,
  currentVersion,
  onClose,
  onSave,
}: ComponentVersionEditDialogProps) {
  const { finalVersion, versionError, handleVersionChange, validateForm } = useVersionForm(
    open,
    component,
    currentVersion
  );

  const handleSave = () => {
    if (!component || !finalVersion) return;

    if (!validateForm()) {
      return;
    }

    onSave({
      ...component,
      finalVersion,
    });
  };

  if (!component) return null;

  const isFormValid = !!finalVersion && !versionError;

  return (
    <BaseEditDialog
      open={open}
      onClose={onClose}
      editing={true}
      title="Edit New Version"
      subtitle="Update the final version for this component"
      maxWidth="sm"
      fullWidth={true}
      onSave={handleSave}
      saveButtonText="Save"
      cancelButtonText="Cancel"
      isFormValid={isFormValid}
      saveButtonDisabled={!isFormValid}
      showDefaultActions={true}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {currentVersion && <CurrentVersionDisplay currentVersion={currentVersion} />}

        <VersionTextField value={finalVersion} error={versionError} onChange={handleVersionChange} />
      </Box>
    </BaseEditDialog>
  );
}

