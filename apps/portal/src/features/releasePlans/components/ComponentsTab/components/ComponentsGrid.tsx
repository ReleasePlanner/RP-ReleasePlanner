import { Box } from "@mui/material";
import { buildComponentConfig } from "@/builders/componentConfigBuilder";
import { ComponentCard } from "../ComponentCard";

export type ComponentsGridProps = {
  readonly components: Array<string | { id: string; name: string }>;
};

export function ComponentsGrid({ components }: ComponentsGridProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
        },
      }}
    >
      {components.map((comp) => {
        const name = typeof comp === "string" ? comp : comp.name;
        const key = typeof comp === "string" ? comp : comp.id;
        const config = buildComponentConfig(name);
        return <ComponentCard key={key} config={config} />;
      })}
    </Box>
  );
}

