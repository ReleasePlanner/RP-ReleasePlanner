import type { PlanReference } from "../../../types";
import {
  useContextMenu,
  useCellReferences,
  useCellHandlers,
  useDataItems,
} from "./hooks";
import {
  CellContainer,
  MilestoneIndicator,
  DataIndicators,
  HoverOverlay,
  ContextMenu,
} from "./components";

export type GanttCellProps = {
  readonly phaseId: string;
  readonly date: string; // ISO date (YYYY-MM-DD)
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  // Note: cellData has been removed - use cellReferences instead
  readonly cellReferences?: PlanReference[]; // References for this specific cell (day-level with phaseId)
  readonly milestoneReference?: PlanReference; // Full milestone reference with title, description, etc.
  readonly onAddComment?: (phaseId: string, date: string) => void;
  readonly onAddFile?: (phaseId: string, date: string) => void;
  readonly onAddLink?: (phaseId: string, date: string) => void;
  readonly onToggleMilestone?: (phaseId: string, date: string) => void;
};

export default function GanttCell({
  phaseId,
  date,
  left,
  top,
  width,
  height,
  cellReferences = [],
  milestoneReference,
  onAddComment,
  onAddFile,
  onAddLink,
  onToggleMilestone,
}: GanttCellProps) {
  const { contextMenu, handleContextMenu, handleClose } = useContextMenu();
  const cellRefsByType = useCellReferences(cellReferences, phaseId, date);
  const handlers = useCellHandlers(
    handleClose,
    phaseId,
    date,
    onAddComment,
    onAddFile,
    onAddLink,
    onToggleMilestone
  );

  const commentsCount = cellRefsByType.comments.length;
  const filesCount = cellRefsByType.files.length;
  const linksCount = cellRefsByType.links.length;
  const hasData = commentsCount > 0 || filesCount > 0 || linksCount > 0;
  const totalDataItems = commentsCount + filesCount + linksCount;
  const hasMultipleItems = totalDataItems > 1;
  const dataItems = useDataItems(commentsCount, filesCount, linksCount);
  const isMilestone = milestoneReference !== undefined;

  return (
    <>
      <CellContainer
        left={left}
        top={top}
        width={width}
        height={height}
        onContextMenu={handleContextMenu}
      >
        {isMilestone && milestoneReference && (
          <MilestoneIndicator
            milestoneReference={milestoneReference}
            date={date}
          />
        )}
        {hasData && (
          <DataIndicators
            dataItems={dataItems}
            hasMultipleItems={hasMultipleItems}
          />
        )}
        <HoverOverlay />
      </CellContainer>
      <ContextMenu
        contextMenu={contextMenu}
        onClose={handleClose}
        handlers={handlers}
        commentsCount={commentsCount}
        filesCount={filesCount}
        linksCount={linksCount}
        isMilestone={isMilestone}
      />
    </>
  );
}
