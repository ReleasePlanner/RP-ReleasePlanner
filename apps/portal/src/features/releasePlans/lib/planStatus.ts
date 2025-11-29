/**
 * Plan Status Utilities
 * 
 * Utility functions for working with plan statuses
 */

import type { PlanStatus } from "../types";

export type StatusChipProps = {
  label: string;
  color: "info" | "primary" | "success" | "warning" | "default";
};

/**
 * Get Material-UI Chip props for a plan status
 * Pure function - no dependencies, can be used outside React components
 * 
 * @param status - The plan status
 * @returns Chip props with label and color
 */
export function getStatusChipProps(status: PlanStatus): StatusChipProps {
  switch (status) {
    case "planned":
      return {
        label: "Planned",
        color: "info",
      };
    case "in_progress":
      return {
        label: "In Progress",
        color: "primary",
      };
    case "done":
      return {
        label: "Completed",
        color: "success",
      };
    case "paused":
      return {
        label: "Paused",
        color: "warning",
      };
    default:
      return { label: status, color: "default" };
  }
}

