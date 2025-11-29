import { memo } from "react";
import type { Team } from "@/api/services/teams.service";
import { TeamsLoadingState } from "./TeamsLoadingState";
import { TeamsErrorState } from "./TeamsErrorState";
import { TeamsEmptyState } from "./TeamsEmptyState";
import { TeamsList } from "./TeamsList";
import type { PlanTeamsStyles } from "../hooks/usePlanTeamsStyles";

export type TeamsContentProps = {
  readonly isLoading: boolean;
  readonly hasError: boolean;
  readonly teams: Team[];
  readonly teamIds: string[]; // Add teamIds to know if we're waiting for data
  readonly onDelete: (id: string) => void;
  readonly styles: PlanTeamsStyles;
};

export const TeamsContent = memo(function TeamsContent({
  isLoading,
  hasError,
  teams,
  teamIds,
  onDelete,
  styles,
}: TeamsContentProps) {
  // Show loading state if we're loading and have teamIds to load
  if (isLoading && teamIds.length > 0) {
    return <TeamsLoadingState />;
  }

  if (hasError) {
    return <TeamsErrorState />;
  }

  // Only show empty state if we have no teamIds at all (not loading and no pending IDs)
  if (teams.length === 0 && teamIds.length === 0 && !isLoading) {
    return <TeamsEmptyState />;
  }

  // If we have teamIds but no teams yet (still loading or waiting for data), show loading
  if (teamIds.length > 0 && teams.length === 0) {
    return <TeamsLoadingState />;
  }

  return <TeamsList teams={teams} onDelete={onDelete} styles={styles} />;
});

