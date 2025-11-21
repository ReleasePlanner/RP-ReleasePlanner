import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { CalendarDay } from "@/features/calendar/types";
import type { CreateCalendarDto } from "@/api/services/calendars.service";
import { generateCalendarDayId } from "@/features/calendar";
import type { EditingState } from "./useCalendarMaintenanceState";

interface UseCalendarMaintenanceHandlersProps {
  selectedCountryId: string | undefined;
  selectedCountry: { id: string; name: string; code: string } | undefined;
  currentCalendar: {
    id: string;
    days?: CalendarDay[];
  } | undefined;
  editingState: EditingState | null;
  setEditingState: (state: EditingState | null) => void;
  setOpenDialog: (open: boolean) => void;
  createMutation: {
    mutateAsync: (data: CreateCalendarDto) => Promise<{ id: string }>;
  };
  updateMutation: {
    mutateAsync: (params: { id: string; data: { days: unknown[] } }) => Promise<unknown>;
  };
}

/**
 * Hook for managing CalendarMaintenancePage event handlers
 */
export function useCalendarMaintenanceHandlers({
  selectedCountryId,
  selectedCountry,
  currentCalendar,
  editingState,
  setEditingState,
  setOpenDialog,
  createMutation,
  updateMutation,
}: UseCalendarMaintenanceHandlersProps) {
  const queryClient = useQueryClient();

  const handleAddDay = useCallback(async () => {
    if (!selectedCountryId || !selectedCountry) return;

    // If calendar doesn't exist, create it first
    let calendarId = currentCalendar?.id;
    if (!calendarId || calendarId === "") {
      try {
        const calendarData: CreateCalendarDto = {
          name: `${selectedCountry.name} Calendar`,
          description: `Holidays and special days for ${selectedCountry.name}`,
          countryId: selectedCountryId,
        };
        const createdCalendar = await createMutation.mutateAsync(calendarData);
        calendarId = createdCalendar.id;

        // Refresh calendars data to update currentCalendar
        await queryClient.refetchQueries({
          queryKey: ["calendars", "list", selectedCountryId || "all"],
        });
      } catch (error) {
        console.error("Error creating calendar:", error);
        return;
      }
    }

    if (!calendarId) {
      console.error("Calendar ID is required but was not found");
      return;
    }

    setEditingState({
      calendarId,
      day: {
        id: generateCalendarDayId(),
        name: "",
        date: new Date().toISOString().split("T")[0],
        type: "holiday",
        description: "",
        recurring: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
    setOpenDialog(true);
  }, [
    selectedCountryId,
    selectedCountry,
    currentCalendar?.id,
    createMutation,
    queryClient,
    setEditingState,
    setOpenDialog,
  ]);

  const handleEditDay = useCallback(
    (day: CalendarDay) => {
      if (!currentCalendar?.id) return;

      setEditingState({
        calendarId: currentCalendar.id,
        day,
      });
      setOpenDialog(true);
    },
    [currentCalendar?.id, setEditingState, setOpenDialog]
  );

  const handleDeleteDay = useCallback(
    async (dayId: string) => {
      if (!currentCalendar?.id) return;

      try {
        const updatedDays = (currentCalendar.days || [])
          .filter((d: CalendarDay) => d.id !== dayId)
          .map((d: CalendarDay) => ({
            name: d.name,
            date: d.date,
            type: d.type,
            description: d.description,
            recurring: d.recurring,
          }));
        await updateMutation.mutateAsync({
          id: currentCalendar.id,
          data: {
            days: updatedDays,
          },
        });
      } catch (error) {
        console.error("Error deleting day:", error);
      }
    },
    [currentCalendar, updateMutation]
  );

  const handleSaveDay = useCallback(async () => {
    if (!editingState || !selectedCountryId || !selectedCountry) return;

    // Ensure calendar exists before saving
    let calendarId = editingState.calendarId;
    let existingDays: CalendarDay[] = [];

    if (!calendarId || calendarId === "" || !currentCalendar?.id) {
      // Calendar doesn't exist, create it first
      try {
        const calendarData: CreateCalendarDto = {
          name: `${selectedCountry.name} Calendar`,
          description: `Holidays and special days for ${selectedCountry.name}`,
          countryId: selectedCountryId,
        };
        const createdCalendar = await createMutation.mutateAsync(calendarData);
        calendarId = createdCalendar.id;

        // Update editingState with the new calendarId
        setEditingState({
          ...editingState,
          calendarId: calendarId,
        });

        // Newly created calendar has no days yet, so existingDays is empty
        existingDays = [];

        // Refresh calendars data to update the UI
        await queryClient.refetchQueries({
          queryKey: ["calendars", "list", selectedCountryId || "all"],
        });
      } catch (error) {
        console.error("Error creating calendar:", error);
        return;
      }
    } else {
      // Calendar exists, use its current days
      existingDays = currentCalendar?.days || [];
    }

    const day = editingState.day;
    const isNew = !existingDays.some((d: CalendarDay) => d.id === day.id);

    try {
      const updatedDays = isNew
        ? [
            ...existingDays.map((d: CalendarDay) => ({
              id: d.id, // Include id for existing days
              name: d.name,
              date: d.date,
              type: d.type,
              description: d.description || undefined,
              recurring: d.recurring,
            })),
            {
              // New day without id - backend will create it
              name: day.name.trim(),
              date: day.date,
              type: day.type,
              description: day.description?.trim() || undefined,
              recurring: day.recurring,
            },
          ]
        : existingDays.map((d: CalendarDay) =>
            d.id === day.id
              ? {
                  id: d.id, // Include id for updated day
                  name: day.name.trim(),
                  date: day.date,
                  type: day.type,
                  description: day.description?.trim() || undefined,
                  recurring: day.recurring,
                }
              : {
                  id: d.id, // Include id for unchanged days
                  name: d.name,
                  date: d.date,
                  type: d.type,
                  description: d.description || undefined,
                  recurring: d.recurring,
                }
          );

      await updateMutation.mutateAsync({
        id: calendarId,
        data: {
          days: updatedDays,
        },
      });

      setOpenDialog(false);
      setEditingState(null);
    } catch (error) {
      console.error("Error saving day:", error);
      throw error; // Re-throw to let React Query handle it
    }
  }, [
    editingState,
    selectedCountryId,
    selectedCountry,
    currentCalendar,
    createMutation,
    updateMutation,
    queryClient,
    setEditingState,
    setOpenDialog,
  ]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingState(null);
  }, [setOpenDialog, setEditingState]);

  return {
    handleAddDay,
    handleEditDay,
    handleDeleteDay,
    handleSaveDay,
    handleCloseDialog,
  };
}

