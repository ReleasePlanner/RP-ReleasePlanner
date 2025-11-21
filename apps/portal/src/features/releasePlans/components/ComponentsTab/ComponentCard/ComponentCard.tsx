import { Card, CardContent, Box } from "@mui/material";
import type { ComponentConfig } from "@/builders";
import { ComponentIcon } from "./components/ComponentIcon";
import { ComponentHeader } from "./components/ComponentHeader";
import { ComponentDescription } from "./components/ComponentDescription";
import { useComponentCardStyles } from "./hooks/useComponentCardStyles";

export type ComponentCardProps = {
  readonly config: ComponentConfig;
};

export function ComponentCard({ config }: ComponentCardProps) {
  const styles = useComponentCardStyles();

  return (
    <Card sx={styles.card}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
          <ComponentIcon config={config} />
          <ComponentHeader config={config} />
        </Box>
        <ComponentDescription description={config.description} />
      </CardContent>
    </Card>
  );
}

