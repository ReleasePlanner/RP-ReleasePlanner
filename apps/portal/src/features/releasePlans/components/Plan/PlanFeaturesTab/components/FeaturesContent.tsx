import { Box, Stack } from "@mui/material";
import { FeaturesLoadingState } from "./FeaturesLoadingState";
import { FeaturesEmptyState } from "./FeaturesEmptyState";
import { FeatureCard } from "./FeatureCard";
import type { Feature } from "../../../../feature/types";

export type FeaturesContentProps = {
  readonly isLoadingFeatures: boolean;
  readonly allProductFeatures: Feature[];
  readonly planFeatures: Feature[];
  readonly isRemoving: string | null;
  readonly onDeleteFeature: (featureId: string) => void;
};

export function FeaturesContent({
  isLoadingFeatures,
  allProductFeatures,
  planFeatures,
  isRemoving,
  onDeleteFeature,
}: FeaturesContentProps) {
  if (isLoadingFeatures && allProductFeatures.length === 0) {
    return <FeaturesLoadingState />;
  }

  if (planFeatures.length === 0) {
    return <FeaturesEmptyState />;
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        p: { xs: 1.5, sm: 2 },
      }}
    >
      <Stack spacing={2}>
        {planFeatures.map((feature) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            isRemoving={isRemoving === feature.id}
            onDelete={onDeleteFeature}
          />
        ))}
      </Stack>
    </Box>
  );
}

