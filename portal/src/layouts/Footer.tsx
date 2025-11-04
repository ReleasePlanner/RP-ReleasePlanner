import { useMemo } from "react";
import {
  Box,
  Container,
} from "@mui/material";

export function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <Box component="footer" className="border-t border-gray-200 bg-white">
      <Container
        maxWidth="xl"
        className="py-3 text-sm text-gray-600 flex items-center justify-between"
      >
        <span>© {year} Release Planner</span>
        <a className="hover:text-primary-600" href="#top">
          Back to top
        </a>
      </Container>
    </Box>
  );
}