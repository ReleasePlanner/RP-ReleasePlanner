// No props currently used; component acts as placeholder for composition

// Minimal shell: legacy composite implementation removed. Use composed export instead.
export default function CommonDataCard() {
  return null;
}

/*
LEGACY REMOVED BELOW (kept only for reference; safe to delete later).
          label="Select Product"
          displayEmpty
          MenuProps={{
            PaperProps: {
              sx: {
                boxShadow: theme.shadows[3],
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
                mt: 0.5,
                "& .MuiMenuItem-root": {
                  fontSize: "0.875rem",
                  py: 1,
                  px: 2,
                  transition: theme.transitions.create(["background-color"], {
                    duration: theme.transitions.duration.shorter,
                  }),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                  "&.Mui-selected": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    },
                  },
                },
              },
            },
          }}
        >
          <MenuItem value="" disabled>
            <em>Select a product...</em>
          </MenuItem>
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  py: 0.5,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, fontSize: "0.875rem" }}
                >
                  {product.name}
                </Typography>
                {product.description && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.75rem", mt: 0.25 }}
                  >
                    {product.description}
                  </Typography>
                )}
                <Typography
                  variant="caption"
                  color="primary.main"
                  sx={{ fontSize: "0.7rem", mt: 0.25, fontStyle: "italic" }}
                >
                  Components: {product.components.join(", ")}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
*/

/* Legacy second implementation block removed.
          pt: 3,
          pb: 0,
        }}
      >
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 600,
            fontSize: "1.125rem",
            lineHeight: 1.3,
            color: theme.palette.text.primary,
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <FolderOpen
            sx={{ fontSize: 20, color: theme.palette.primary.main }}
          />
          Plan Data
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="plan data tabs"
          sx={{
            minHeight: 40,
            "& .MuiTab-root": {
              minHeight: 40,
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              px: 2,
              py: 1,
              transition: theme.transitions.create(
                ["color", "background-color"],
                {
                  duration: theme.transitions.duration.short,
                }
              ),
              "&.Mui-selected": {
                color: theme.palette.primary.main,
              },
            },
            "& .MuiTabs-indicator": {
              height: 2,
              borderRadius: 1,
            },
          }}
        >
          <Tab label="Common Data" {...a11yProps(0)} />
          <Tab label="Components" {...a11yProps(1)} />
          <Tab label="Features" {...a11yProps(2)} />
        </Tabs>
      </Box>

      ...
*/
