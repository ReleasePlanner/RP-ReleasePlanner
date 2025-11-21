import { IconButton, Tooltip } from "@mui/material";
import { Today as TodayIcon } from "@mui/icons-material";
import { TIMELINE_POSITIONS } from "../constants";
import { useTodayButtonStyles } from "./hooks/useTodayButtonStyles";
import { ButtonContainer } from "./components/ButtonContainer";

export type TodayButtonProps = {
  readonly onJumpToToday: () => void;
};

export function TodayButton({ onJumpToToday }: TodayButtonProps) {
  const styles = useTodayButtonStyles();

  return (
    <ButtonContainer>
      <Tooltip title="Ir a hoy" arrow placement="left">
        <IconButton
          aria-label="Jump to today"
          onClick={onJumpToToday}
          size="small"
          sx={styles.button}
        >
          <TodayIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
    </ButtonContainer>
  );
}

