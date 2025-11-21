import { memo } from "react";
import { Paper, useTheme, alpha } from "@mui/material";
import type { Country } from "@/api/services/countries.service";
import { CountryItem } from "./CountryItem";

export type CountryMaintenanceListProps = {
  readonly countries: Country[];
  readonly isDeleting: boolean;
  readonly onEdit: (country: Country) => void;
  readonly onDelete: (countryId: string) => void;
};

/**
 * Component for the list of countries
 */
export const CountryMaintenanceList = memo(function CountryMaintenanceList({
  countries,
  isDeleting,
  onEdit,
  onDelete,
}: CountryMaintenanceListProps) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {countries.map((country, index) => (
        <CountryItem
          key={country.id}
          country={country}
          isLast={index === countries.length - 1}
          isDeleting={isDeleting}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Paper>
  );
});

