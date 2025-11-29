import { useState, useCallback } from "react";
import { Box, Stack } from "@mui/material";
import { SelectTeamsDialog } from "./SelectTeamsDialog";
import { TeamsHeader, TeamsContent } from "./components";
import { usePlanTeams, usePlanTeamsStyles } from "./hooks";

export type PlanTeamsTabProps = {
  readonly teamIds?: string[];
  readonly onTeamIdsChange?: (teamIds: string[]) => void;
};

export function PlanTeamsTab({
  teamIds,
  onTeamIdsChange,
}: PlanTeamsTabProps) {
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  // Ensure teamIds is always an array - compute directly to maintain hook order
  const safeTeamIds = Array.isArray(teamIds) ? teamIds : [];
  
  // Debug: Log teamIds changes
  console.log('[PlanTeamsTab] Received teamIds:', {
    teamIds,
    safeTeamIds,
    safeTeamIdsLength: safeTeamIds.length,
    safeTeamIdsIsArray: Array.isArray(safeTeamIds),
  });
  
  const { planTeams, isLoading, hasError } = usePlanTeams(safeTeamIds);
  const styles = usePlanTeamsStyles();

  const handleAddTeams = useCallback(
    (newTeamIds: string[]) => {
      console.log('[PlanTeamsTab] handleAddTeams called:', {
        newTeamIds,
        newTeamIdsCount: newTeamIds.length,
        currentSafeTeamIds: safeTeamIds,
        currentSafeTeamIdsCount: safeTeamIds.length,
        hasOnTeamIdsChange: !!onTeamIdsChange,
      });
      
      if (onTeamIdsChange) {
        // Filter out duplicates - only add teams that aren't already in the plan
        const uniqueNewIds = newTeamIds.filter(
          (id) => !safeTeamIds.includes(id)
        );
        console.log('[PlanTeamsTab] Unique new IDs:', {
          uniqueNewIds,
          uniqueNewIdsCount: uniqueNewIds.length,
        });
        
        if (uniqueNewIds.length > 0) {
          const updatedTeamIds = [...safeTeamIds, ...uniqueNewIds];
          console.log('[PlanTeamsTab] Calling onTeamIdsChange with:', {
            updatedTeamIds,
            updatedTeamIdsCount: updatedTeamIds.length,
          });
          onTeamIdsChange(updatedTeamIds);
        } else {
          console.log('[PlanTeamsTab] No unique new IDs to add');
        }
      } else {
        console.warn('[PlanTeamsTab] onTeamIdsChange is not defined!');
      }
      setSelectDialogOpen(false);
    },
    [safeTeamIds, onTeamIdsChange]
  );

  const handleDeleteTeam = useCallback(
    (teamId: string) => {
      if (onTeamIdsChange) {
        onTeamIdsChange(safeTeamIds.filter((id) => id !== teamId));
      }
    },
    [safeTeamIds, onTeamIdsChange]
  );

  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Stack
        spacing={1}
        sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
      >
        <TeamsHeader
          teamCount={planTeams.length}
          onAddClick={() => setSelectDialogOpen(true)}
          styles={styles}
        />

        <Box
          sx={{
            flex: 1,
            overflow: "hidden",
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <TeamsContent
            isLoading={isLoading}
            hasError={hasError}
            teams={planTeams}
            teamIds={safeTeamIds}
            onDelete={handleDeleteTeam}
            styles={styles}
          />
        </Box>
      </Stack>

      <SelectTeamsDialog
        open={selectDialogOpen}
        selectedTeamIds={safeTeamIds}
        onClose={() => setSelectDialogOpen(false)}
        onAddTeams={handleAddTeams}
      />
    </Box>
  );
}

