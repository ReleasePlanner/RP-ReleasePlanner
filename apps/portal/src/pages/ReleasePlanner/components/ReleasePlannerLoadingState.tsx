import { Box, LinearProgress, Skeleton } from "@mui/material";
import { PageLayout } from "@/components";

/**
 * Component for loading state
 */
export function ReleasePlannerLoadingState() {
  return (
    <PageLayout
      title="Release Planner"
      description="Manage and visualize your release plans"
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <LinearProgress sx={{ mb: 2 }} />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={120}
            sx={{ borderRadius: 2 }}
          />
        ))}
      </Box>
    </PageLayout>
  );
}

