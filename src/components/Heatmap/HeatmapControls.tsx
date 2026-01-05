import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ArrowRightIcon, Settings2 } from "lucide-react";
import { ProgressModal } from "@/components/DoneModal";

type Props = {
  habitId: string;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  onDone?: (count: number) => void; // функция для отметки прогресса
};

export function HeatmapControls({
  habitId,
  onPrev,
  onNext,
  canPrev,
  canNext,
  onDone,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-1 mt-4">
      {/* Используем модалку вместо обычной кнопки */}
      <ProgressModal habitId={habitId} onDone={onDone} />

      <Button
        variant="outline"
        size="icon"
        onClick={onPrev}
        disabled={!canPrev}
      >
        <ArrowLeftIcon />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        disabled={!canNext}
      >
        <ArrowRightIcon />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={() => navigate(`/habits/${habitId}`)}
      >
        <Settings2 />
      </Button>
    </div>
  );
}
