import { useState } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import {
  Info as InfoIcon,
  Extension as ExtensionIcon,
  Inventory as InventoryIcon,
  CalendarMonth as CalendarIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
import { CommonDataCard } from "../CommonDataCard";
import type { Product } from "../CommonDataCard/types";

export type PlanLeftPaneProps = {
  owner: string;
  startDate: string;
  endDate: string;
  id: string;
  selectedProduct: string;
  products: Product[];
  onProductChange: (productId: string) => void;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`plan-tabpanel-${index}`}
      aria-labelledby={`plan-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            height: "100%",
            overflow: "auto",
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `plan-tab-${index}`,
    "aria-controls": `plan-tabpanel-${index}`,
  };
}

export default function PlanLeftPane({
  owner,
  startDate,
  endDate,
  id,
  selectedProduct,
  products,
  onProductChange,
}: PlanLeftPaneProps) {
  const [tabValue, setTabValue] = useState(0);

  console.log("PlanLeftPane rendering with tabs, current tab:", tabValue);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    console.log("Tab changed to:", newValue);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "background.paper",
        borderRadius: 1,
        overflow: "hidden",
        border: 1,
        borderColor: "divider",
      }}
    >
      {/* Tabs Header - Fixed */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          flexShrink: 0,
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="Plan information tabs"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 40,
            "& .MuiTabs-flexContainer": {
              gap: 0.5,
            },
            "& .MuiTab-root": {
              minHeight: 40,
              minWidth: "auto",
              py: 0.75,
              px: { xs: 1.5, sm: 2 },
              textTransform: "none",
              fontWeight: 500,
              fontSize: { xs: "0.8125rem", sm: "0.875rem" },
              color: "text.secondary",
              letterSpacing: "0.01em",
              "&.Mui-selected": {
                color: "primary.main",
                fontWeight: 600,
              },
              "& .MuiTab-iconWrapper": {
                marginRight: { xs: 0.5, sm: 0.75 },
                marginBottom: 0,
              },
            },
            "& .MuiTabs-indicator": {
              height: 2,
            },
          }}
        >
          <Tab
            icon={<InfoIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
            iconPosition="start"
            label="Data"
            {...a11yProps(0)}
          />
          <Tab
            icon={<ExtensionIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
            iconPosition="start"
            label="Features"
            {...a11yProps(1)}
          />
          <Tab
            icon={<InventoryIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
            iconPosition="start"
            label="Components"
            {...a11yProps(2)}
          />
          <Tab
            icon={<CalendarIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
            iconPosition="start"
            label="Calendars"
            {...a11yProps(3)}
          />
          <Tab
            icon={<LinkIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />}
            iconPosition="start"
            label="References"
            {...a11yProps(4)}
          />
        </Tabs>
      </Box>

      {/* Tab Content - Scrollable */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        {/* Tab 1: Common Data */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 2 }}>
            <CommonDataCard
              owner={owner}
              startDate={startDate}
              endDate={endDate}
              id={id}
              selectedProduct={selectedProduct}
              products={products}
              onProductChange={onProductChange}
            />
          </Box>
        </TabPanel>

        {/* Tab 2: Features */}
        <TabPanel value={tabValue} index={1}>
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Features content will be displayed here
          </Box>
        </TabPanel>

        {/* Tab 3: Components */}
        <TabPanel value={tabValue} index={2}>
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Components content will be displayed here
          </Box>
        </TabPanel>

        {/* Tab 4: Calendars */}
        <TabPanel value={tabValue} index={3}>
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            Calendars content will be displayed here
          </Box>
        </TabPanel>

        {/* Tab 5: References */}
        <TabPanel value={tabValue} index={4}>
          <Box
            sx={{
              p: 3,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            References content will be displayed here
          </Box>
        </TabPanel>
      </Box>
    </Box>
  );
}
