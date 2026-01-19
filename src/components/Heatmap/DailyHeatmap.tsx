import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import type { HeatmapValue } from "@/types/heatmap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

type Props = {
  startDate: string;
  offset: number;
  values: HeatmapValue[];
};

function getMonthRange(base: Date, offset: number) {
  const start = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  const end = new Date(base.getFullYear(), base.getMonth() + offset + 1, 0);
  return { start, end };
}

export function DailyHeatmap({ startDate, offset, values }: Props) {
  const base = new Date(startDate);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const months = [
    getMonthRange(base, offset),
    getMonthRange(base, offset + 1),
    getMonthRange(base, offset + 2),
  ];

  useEffect(() => {
    const checkScroll = () => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
      }
    };

    checkScroll();
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 100;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {/* Стрелки для прокрутки на мобильных */}
      <div className="sm:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10">
        {showLeftArrow && (
          <button
            onClick={() => scroll("left")}
            className="bg-gray-800/70 text-white p-1 rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="sm:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10">
        {showRightArrow && (
          <button
            onClick={() => scroll("right")}
            className="bg-gray-800/70 text-white p-1 rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Контейнер с горизонтальной прокруткой на мобильных */}
      <div
        ref={containerRef}
        className="daily-heatmap-container flex overflow-x-auto sm:overflow-visible sm:flex sm:justify-between gap-2 pb-2 sm:pb-0 scrollbar-thin"
        style={{ scrollbarWidth: "thin" }}
      >
        {months.map((range, idx) => (
          <div
            key={idx}
            className="daily-heatmap-month flex-shrink-0 sm:flex-shrink min-w-[90px] sm:min-w-0 sm:flex-1"
          >
            <div className="text-center text-xs font-medium mb-1 text-foreground truncate">
              {range.start.toLocaleString("en-US", {
                month: "short",
              })}
            </div>

            <div className="heatmap-container overflow-hidden rounded">
              <CalendarHeatmap
                startDate={range.start}
                endDate={range.end}
                values={values}
                showWeekdayLabels={false}
                showMonthLabels={false}
                gutterSize={1}
                classForValue={(v) => {
                  if (!v || v.value === 0) return "color-empty";
                  return `color-scale-${Math.min(4, Math.max(1, v.value))}`;
                }}
                titleForValue={(v) => {
                  if (!v) return "No activity";
                  return `${v.value} activity level on ${new Date(v.date).toLocaleDateString()}`;
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Индикатор прокрутки для мобильных */}
      <div className="sm:hidden text-center text-xs text-gray-500 mt-1">
        ← Scroll → to see all months
      </div>
    </div>
  );
}
