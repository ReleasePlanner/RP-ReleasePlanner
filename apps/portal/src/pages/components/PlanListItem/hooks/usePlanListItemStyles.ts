import { useMemo } from "react";
import { useTheme, alpha } from "@mui/material";

/**
 * Hook for memoized styles used in PlanListItem
 */
export function usePlanListItemStyles() {
  const theme = useTheme();

  const headerStyles = useMemo(
    () => ({
      px: 2,
      py: 1.5,
      width: "100%",
      display: "flex",
      flexDirection: "row" as const,
      alignItems: "center",
      gap: 1,
      cursor: "pointer",
      "&:hover": {
        bgcolor: alpha(theme.palette.primary.main, 0.04),
      },
    }),
    [theme.palette.primary.main]
  );

  const expandIconStyles = useMemo(
    () => ({
      fontSize: 16,
      p: 0.75,
      color: theme.palette.text.secondary,
      transform: "rotate(0deg)",
      transition: "transform 0.15s ease",
      "&:hover": {
        bgcolor: alpha(theme.palette.primary.main, 0.08),
      },
    }),
    [theme.palette.text.secondary, theme.palette.primary.main]
  );

  const expandIconExpandedStyles = useMemo(
    () => ({
      transform: "rotate(180deg)",
    }),
    []
  );

  const infoContainerStyles = useMemo(
    () => ({
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column" as const,
      gap: 0.25,
    }),
    []
  );

  const planNameStyles = useMemo(
    () => ({
      fontWeight: 500,
      fontSize: "0.8125rem",
      color: theme.palette.text.primary,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap" as const,
    }),
    [theme.palette.text.primary]
  );

  const infoStackStyles = useMemo(
    () => ({
      flexWrap: "wrap" as const,
      gap: 0.5,
    }),
    []
  );

  const statusChipStyles = useMemo(
    () => ({
      height: 18,
      fontSize: "0.625rem",
      fontWeight: 500,
      "& .MuiChip-label": {
        px: 0.75,
      },
    }),
    []
  );

  const infoTextStyles = useMemo(
    () => ({
      fontSize: "0.6875rem",
      color: theme.palette.text.secondary,
    }),
    [theme.palette.text.secondary]
  );

  const actionsStackStyles = useMemo(
    () => ({
      ml: "auto",
      flexShrink: 0,
    }),
    []
  );

  const getSaveButtonStyles = useMemo(
    () => (hasPendingChanges: boolean) => ({
      fontSize: 16,
      p: 0.75,
      color: hasPendingChanges
        ? theme.palette.success.main
        : theme.palette.text.disabled,
      "&:hover:not(:disabled)": {
        bgcolor: alpha(theme.palette.success.main, 0.08),
      },
    }),
    [theme.palette.success.main, theme.palette.text.disabled]
  );

  const actionButtonStyles = useMemo(
    () => ({
      fontSize: 16,
      p: 0.75,
      color: theme.palette.text.secondary,
    }),
    [theme.palette.text.secondary]
  );

  const copyButtonStyles = useMemo(
    () => ({
      ...actionButtonStyles,
      "&:hover": {
        color: theme.palette.primary.main,
        bgcolor: alpha(theme.palette.primary.main, 0.08),
      },
    }),
    [actionButtonStyles, theme.palette.primary.main]
  );

  const deleteButtonStyles = useMemo(
    () => ({
      ...actionButtonStyles,
      "&:hover": {
        color: theme.palette.error.main,
        bgcolor: alpha(theme.palette.error.main, 0.08),
      },
    }),
    [actionButtonStyles, theme.palette.error.main]
  );

  const dividerStyles = useMemo(
    () => ({
      borderColor: alpha(theme.palette.divider, 0.08),
    }),
    [theme.palette.divider]
  );

  const expandedContentStyles = useMemo(
    () => ({
      borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
      width: "100%",
      overflow: "hidden",
    }),
    [theme.palette.divider]
  );

  const loadingFallbackStyles = useMemo(
    () => ({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      py: 4,
    }),
    []
  );

  return {
    theme,
    headerStyles,
    expandIconStyles,
    expandIconExpandedStyles,
    infoContainerStyles,
    planNameStyles,
    infoStackStyles,
    statusChipStyles,
    infoTextStyles,
    actionsStackStyles,
    getSaveButtonStyles,
    copyButtonStyles,
    deleteButtonStyles,
    dividerStyles,
    expandedContentStyles,
    loadingFallbackStyles,
  };
}

