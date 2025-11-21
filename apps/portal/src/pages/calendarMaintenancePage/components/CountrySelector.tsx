import { memo } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material";

export type CountrySelectorProps = {
  readonly countries: Array<{
    id: string;
    name: string;
    code: string;
    region?: string;
  }>;
  readonly selectedCountryId: string | undefined;
  readonly onCountryChange: (countryId: string | undefined) => void;
};

/**
 * Component for country selection dropdown
 */
export const CountrySelector = memo(function CountrySelector({
  countries,
  selectedCountryId,
  onCountryChange,
}: CountrySelectorProps) {
  const theme = useTheme();

  return (
    <FormControl fullWidth size="small">
      <InputLabel
        sx={{
          fontSize: "0.75rem",
        }}
      >
        Country
      </InputLabel>
      <Select
        value={selectedCountryId || ""}
        label="Country"
        onChange={(e) => {
          const countryId = e.target.value || undefined;
          onCountryChange(countryId);
        }}
        renderValue={(value) => {
          if (!value) return "Select a country";
          const country = countries.find((c) => c.id === value);
          return country ? `${country.name} (${country.code})` : "";
        }}
        sx={{
          fontSize: "0.75rem",
          "& .MuiSelect-select": {
            py: 0.75,
            fontSize: "0.75rem",
          },
          borderRadius: 1.5,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha(theme.palette.divider, 0.3),
          },
        }}
      >
        {countries.map((country) => (
          <MenuItem
            key={country.id}
            value={country.id}
            sx={{ fontSize: "0.75rem", py: 0.5, minHeight: 32 }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                width: "100%",
              }}
            >
              <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                {country.name}
              </Typography>
              <Chip
                label={country.code}
                size="small"
                sx={{
                  height: 18,
                  fontSize: "0.625rem",
                  fontWeight: 500,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  "& .MuiChip-label": {
                    px: 0.75,
                  },
                }}
              />
              {country.region && (
                <Typography
                  variant="caption"
                  sx={{
                    ml: "auto",
                    fontSize: "0.6875rem",
                    color: theme.palette.text.secondary,
                  }}
                >
                  {country.region}
                </Typography>
              )}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});

