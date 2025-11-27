import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { MainLayout } from "./layouts/MainLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthPage } from "./components/auth/AuthPage";

// Lazy load pages for better performance and code splitting
const ReleasePlanner = lazy(() => import("./pages/ReleasePlanner"));
const ProductMaintenancePage = lazy(() => import("./pages/productMaintenancePage"));
const FeatureMaintenancePage = lazy(() => import("./pages/featureMaintenancePage"));
const CalendarMaintenancePage = lazy(() => import("./pages/calendarMaintenancePage"));
const ITOwnerMaintenancePage = lazy(() => import("./pages/itOwnerMaintenancePage"));
const ComponentTypeMaintenancePage = lazy(() => import("./pages/componentTypeMaintenancePage"));
const FeatureCategoryMaintenancePage = lazy(() => import("./pages/featureCategoryMaintenancePage"));
const CountryMaintenancePage = lazy(() => import("./pages/countryMaintenancePage"));
const PhasesMaintenancePage = lazy(() => import("./pages/phasesMaintenancePage"));
const IndicatorMaintenancePage = lazy(() => import("./pages/indicatorMaintenancePage"));
const TeamMaintenancePage = lazy(() => import("./pages/teamMaintenancePage"));
const RoleMaintenancePage = lazy(() => import("./pages/roleMaintenancePage"));

// Loading fallback component
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public auth routes */}
        <Route path="auth/login" element={<AuthPage />} />
        <Route path="auth/register" element={<AuthPage />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ReleasePlanner />} />
          <Route path="release-planner" element={<ReleasePlanner />} />
          <Route
            path="phases-maintenance"
            element={<PhasesMaintenancePage />}
          />
          <Route
            path="product-maintenance"
            element={<ProductMaintenancePage />}
          />
          <Route path="features" element={<FeatureMaintenancePage />} />
          <Route path="calendars" element={<CalendarMaintenancePage />} />
          <Route path="it-owners" element={<ITOwnerMaintenancePage />} />
          <Route path="component-types" element={<ComponentTypeMaintenancePage />} />
          <Route path="feature-categories" element={<FeatureCategoryMaintenancePage />} />
          <Route path="countries" element={<CountryMaintenancePage />} />
          <Route path="indicators-maintenance" element={<IndicatorMaintenancePage />} />
          <Route path="teams-maintenance" element={<TeamMaintenancePage />} />
          <Route path="roles-maintenance" element={<RoleMaintenancePage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
