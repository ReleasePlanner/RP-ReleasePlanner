import { useMemo } from "react";
import React from "react";
import { useTheme } from "@mui/material";
import {
  Comment as CommentIcon,
  AttachFile as FileIcon,
  Link as LinkIcon,
} from "@mui/icons-material";

export type DataItem = {
  readonly type: "comment" | "file" | "link";
  readonly count: number;
  readonly icon: React.ReactNode;
  readonly color: string;
};

export function useDataItems(
  commentsCount: number,
  filesCount: number,
  linksCount: number
): DataItem[] {
  const theme = useTheme();

  return useMemo(() => {
    const items: DataItem[] = [];
    if (commentsCount > 0) {
      items.push({
        type: "comment",
        count: commentsCount,
        icon: <CommentIcon sx={{ fontSize: 10 }} />,
        color: theme.palette.info.main,
      });
    }
    if (filesCount > 0) {
      items.push({
        type: "file",
        count: filesCount,
        icon: <FileIcon sx={{ fontSize: 10 }} />,
        color: theme.palette.success.main,
      });
    }
    if (linksCount > 0) {
      items.push({
        type: "link",
        count: linksCount,
        icon: <LinkIcon sx={{ fontSize: 10 }} />,
        color: theme.palette.primary.main,
      });
    }
    return items;
  }, [commentsCount, filesCount, linksCount, theme]);
}

