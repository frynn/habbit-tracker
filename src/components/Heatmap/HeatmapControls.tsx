import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon, Settings2, Target } from "lucide-react";
import { ProgressModal } from "@/components/DoneModal";

type Props = {
  habitId: string;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  onDone?: (count: number) => void;
  goal?: number;
  goalUnit?: string;
};

export function HeatmapControls({
  habitId,
  onPrev,
  onNext,
  canPrev,
  canNext,
  onDone,
  goal,
  goalUnit,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between gap-3 pt-4 border-t">
      {/* Левая группа: Навигация */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrev}
          disabled={!canPrev}
          className="h-9 w-9"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          disabled={!canNext}
          className="h-9 w-9"
        >
          <ArrowRightIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Центральная группа: Прогресс */}
      <div className="flex items-center gap-2">
        <ProgressModal
          habitId={habitId}
          onDone={onDone}
          goal={goal}
          goalUnit={goalUnit}
        >
          <Button
            size="sm"
            className="gap-2 bg-primary hover:bg-primary/90 shadow-sm"
          >
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Log Progress</span>
            <span className="sm:hidden">Log</span>
          </Button>
        </ProgressModal>
      </div>

      {/* Правая группа: Действия */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/habits/${habitId}`)}
          className="gap-2"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
