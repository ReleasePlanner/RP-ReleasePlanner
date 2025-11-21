import { Typography } from "@mui/material";

export type ComponentDescriptionProps = {
  readonly description: string;
};

export function ComponentDescription({
  description,
}: ComponentDescriptionProps) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ fontSize: "0.875rem", lineHeight: 1.4 }}
    >
      {description}
    </Typography>
  );
}
