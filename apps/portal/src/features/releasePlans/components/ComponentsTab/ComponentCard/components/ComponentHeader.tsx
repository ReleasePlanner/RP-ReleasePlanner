import { Box, Typography, Chip } from "@mui/material";
import type { ComponentConfig } from "@/builders";

export type ComponentHeaderProps = {
  readonly config: ComponentConfig;
};

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function ComponentHeader({ config }: ComponentHeaderProps) {
  return (
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="h6"
        sx={{
          fontSize: "1rem",
          fontWeight: 600,
          lineHeight: 1.2,
          mb: 0.5,
        }}
      >
        {config.name}
      </Typography>
      <Chip
        label={capitalizeFirst(config.color)}
        size="small"
        color={config.color}
        sx={{ height: 20, fontSize: "0.75rem" }}
      />
    </Box>
  );
}

