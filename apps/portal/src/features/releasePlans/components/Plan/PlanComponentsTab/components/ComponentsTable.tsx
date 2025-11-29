import { memo } from "react";
import { Box, Stack } from "@mui/material";
import type { ComponentWithDetails } from "../hooks/usePlanComponents";
import { ComponentCard } from "./ComponentCard";

export type ComponentsTableProps = {
  readonly components: ComponentWithDetails[];
  readonly onEdit: (component: ComponentWithDetails) => void;
  readonly onDelete: (componentId: string) => void;
  readonly styles?: any; // Kept for backward compatibility but not used
};

export const ComponentsTable = memo(function ComponentsTable({
  components,
  onEdit,
  onDelete,
}: ComponentsTableProps) {
  return (
    <Box sx={{ flex: 1, overflow: "auto", minHeight: 0, display: "flex", flexDirection: "column", p: { xs: 1.5, sm: 2 } }}>
      <Stack spacing={2}>
        {components.map((component) => (
          <ComponentCard
            key={component.id}
            component={component}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </Stack>
    </Box>
  );
});

