import { ConfirmDialog } from "~/components/comfirm-dialog";
import { Button } from "~/components/ui/button";

interface RecordNavigationProps {
  currentIndex: number;
  totalRecords: number;
  onNavigate: (dir: "next" | "prev" | "first" | "last") => void;
  isNew?: boolean;
  isDirty?: boolean;
  className?: string;
  showLabels?: boolean;
}

export function RecordNavigation({
  currentIndex,
  totalRecords,
  onNavigate,
  isNew = false,
  isDirty = false,
  className = "",
  showLabels = true,
}: RecordNavigationProps) {
  return (
    <div className={`flex justify-evenly items-center gap-2 ${className}`}>
      {/* Left controls */}
      <div className="flex gap-1 sm:gap-4">
        {isDirty || isNew ? (
          <ConfirmDialog
            title={isNew ? "Discard new record?" : "Discard changes?"}
            description={
              isNew
                ? "You have unsaved data in the new record. Discard it?"
                : "You have unsaved changes. Do you want to discard them?"
            }
            confirmText="Discard"
            cancelText="Stay"
            onConfirm={() => onNavigate("first")}
            trigger={
              <Button variant="outline" disabled={currentIndex === 0} size="sm">
                ⏮{" "}
                {showLabels && (
                  <span className="hidden sm:inline ml-1">First</span>
                )}
              </Button>
            }
          />
        ) : (
          <Button
            variant="outline"
            onClick={() => onNavigate("first")}
            disabled={currentIndex === 0}
            size="sm"
          >
            ⏮{" "}
            {showLabels && <span className="hidden sm:inline ml-1">First</span>}
          </Button>
        )}

        {isDirty || isNew ? (
          <ConfirmDialog
            title={isNew ? "Discard new record?" : "Discard changes?"}
            description={
              isNew
                ? "You have unsaved data in the new record. Discard it?"
                : "You have unsaved changes. Do you want to discard them?"
            }
            confirmText="Discard"
            cancelText="Stay"
            onConfirm={() => onNavigate("prev")}
            trigger={
              <Button variant="outline" disabled={currentIndex === 0} size="sm">
                ◀{" "}
                {showLabels && (
                  <span className="hidden sm:inline ml-1">Previous</span>
                )}
              </Button>
            }
          />
        ) : (
          <Button
            variant="outline"
            onClick={() => onNavigate("prev")}
            disabled={currentIndex === 0}
            size="sm"
          >
            ◀{" "}
            {showLabels && (
              <span className="hidden sm:inline ml-1">Previous</span>
            )}
          </Button>
        )}
      </div>

      {/* Middle indicator */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="min-w-[80px] justify-center text-xs px-1"
          size="sm"
        >
          {isNew
            ? `${totalRecords + 1}/${totalRecords + 1}`
            : `${currentIndex + 1}/${totalRecords}`}
        </Button>
      </div>

      {/* Right controls */}
      <div className="flex gap-1 sm:gap-4">
        {isDirty || isNew ? (
          <ConfirmDialog
            title={isNew ? "Discard new record?" : "Discard changes?"}
            description={
              isNew
                ? "You have unsaved data in the new record. Discard it?"
                : "You have unsaved changes. Do you want to discard them?"
            }
            confirmText="Discard"
            cancelText="Stay"
            onConfirm={() => onNavigate("next")}
            trigger={
              <Button
                variant="outline"
                disabled={currentIndex === totalRecords - 1}
                size="sm"
              >
                {showLabels && (
                  <span className="hidden sm:inline mr-1">Next</span>
                )}
                ▶
              </Button>
            }
          />
        ) : (
          <Button
            variant="outline"
            onClick={() => onNavigate("next")}
            disabled={currentIndex === totalRecords - 1}
            size="sm"
          >
            {showLabels && <span className="hidden sm:inline mr-1">Next</span>}
            ▶
          </Button>
        )}

        {isDirty || isNew ? (
          <ConfirmDialog
            title={isNew ? "Discard new record?" : "Discard changes?"}
            description={
              isNew
                ? "You have unsaved data in the new record. Discard it?"
                : "You have unsaved changes. Do you want to discard them?"
            }
            confirmText="Discard"
            cancelText="Stay"
            onConfirm={() => onNavigate("last")}
            trigger={
              <Button
                variant="outline"
                disabled={currentIndex === totalRecords - 1}
                size="sm"
              >
                {showLabels && (
                  <span className="hidden sm:inline mr-1">Last</span>
                )}
                ⏭
              </Button>
            }
          />
        ) : (
          <Button
            variant="outline"
            onClick={() => onNavigate("last")}
            disabled={currentIndex === totalRecords - 1}
            size="sm"
          >
            {showLabels && <span className="hidden sm:inline mr-1">Last</span>}
            ⏭
          </Button>
        )}
      </div>
    </div>
  );
}
