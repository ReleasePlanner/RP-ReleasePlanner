import { Box, Badge, useTheme, alpha } from "@mui/material";
import type { DataItem } from "../hooks";

export type DataIndicatorsProps = {
  readonly dataItems: DataItem[];
  readonly hasMultipleItems: boolean;
};

export function DataIndicators({
  dataItems,
  hasMultipleItems,
}: DataIndicatorsProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 1,
        left: 1,
        zIndex: 2,
        display: "flex",
        flexDirection: hasMultipleItems ? "column" : "row",
        gap: hasMultipleItems ? 0.25 : 0.5,
        alignItems: "flex-start",
      }}
    >
      {dataItems.map((item) => (
        <Badge
          key={item.type}
          badgeContent={item.count}
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.5rem",
              height: 10,
              minWidth: 10,
              padding: "0 2px",
              backgroundColor: item.color,
              color: theme.palette.getContrastText(item.color),
              fontWeight: 600,
              border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
              boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.2)}`,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 12,
              height: 12,
              borderRadius: "2px",
              backgroundColor: alpha(item.color, 0.15),
              border: `1px solid ${alpha(item.color, 0.3)}`,
              color: item.color,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: alpha(item.color, 0.25),
                transform: "scale(1.1)",
              },
            }}
          >
            {item.icon}
          </Box>
        </Badge>
      ))}
    </Box>
  );
}

