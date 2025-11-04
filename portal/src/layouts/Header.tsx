import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import { useAppDispatch } from "../store/hooks";
import { toggleLeftSidebar, toggleRightSidebar } from "../store/store";
import { addPlan } from "../features/releasePlans/slice";
import type { Plan } from "../features/releasePlans/types";

export function Header() {
  const dispatch = useAppDispatch();

  return (
    <AppBar position="sticky" color="primary" enableColorOnDark>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          aria-label="open navigation"
          sx={{ mr: 2 }}
          onClick={() => dispatch(toggleLeftSidebar())}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Release Planner
        </Typography>
        <Button
          color="secondary"
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          sx={{ mr: 1, display: { xs: "none", sm: "inline-flex" } }}
          onClick={() => {
            const now = new Date();
            const year = now.getFullYear();
            const id = `plan-${Date.now()}`;
            const newPlan: Plan = {
              id,
              metadata: {
                id,
                name: "New Release",
                owner: "Unassigned",
                startDate: `${year}-01-01`,
                endDate: `${year}-12-31`,
                status: "planned",
                description: "",
              },
              tasks: [],
            };
            dispatch(addPlan(newPlan));
          }}
        >
          Add Release
        </Button>
        <IconButton
          color="inherit"
          aria-label="open right panel"
          onClick={() => dispatch(toggleRightSidebar())}
        >
          <MoreVertIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
