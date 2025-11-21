import React from "react";
import { useTheme } from "@mui/material";
import {
  Comment as CommentIcon,
  AttachFile as FileIcon,
  Link as LinkIcon,
} from "@mui/icons-material";

export type DayDataItem = {
  readonly type: "comment" | "file" | "link";
  readonly count: number;
  readonly icon: React.ReactNode;
  readonly color: string;
};

export function useDayDataItems(
  commentsCount: number,
  filesCount: number,
  linksCount: number
): DayDataItem[] {
  const theme = useTheme();

  return React.useMemo(() => {
    const items: DayDataItem[] = [];
    if (commentsCount > 0) {
      items.push({
        type: "comment",
        count: commentsCount,
        icon: <CommentIcon sx={{ fontSize: 8 }} />,
        color: theme.palette.info.main,
      });
    }
    if (filesCount > 0) {
      items.push({
        type: "file",
        count: filesCount,
        icon: <FileIcon sx={{ fontSize: 8 }} />,
        color: theme.palette.success.main,
      });
    }
    if (linksCount > 0) {
      items.push({
        type: "link",
        count: linksCount,
        icon: <LinkIcon sx={{ fontSize: 8 }} />,
        color: theme.palette.primary.main,
      });
    }
    return items;
  }, [commentsCount, filesCount, linksCount, theme]);
}

