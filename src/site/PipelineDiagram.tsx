"use client";
import { ArrowRight } from "lucide-react";
import { Chip } from "@/primitives/Chip";
import { Stagger, StaggerItem } from "@/motion/Reveal";
import { stagger } from "@/tokens/motion";

export interface PipelineDiagramProps {
  steps: string[];
  ariaLabel: string;
  className?: string;
}

export function PipelineDiagram({ steps, ariaLabel, className }: PipelineDiagramProps) {
  const last = steps.length - 1;
  return (
    <Stagger immediate delay={1.1} stagger={stagger.base} className={className}>
      <ol aria-label={ariaLabel} className="flex flex-col md:flex-row md:flex-wrap items-start md:items-center gap-2 md:gap-3">
        {steps.map((s, i) => (
          <StaggerItem as="li" key={s} className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
            <Chip tone={i === last ? "yellow" : "white"}>{s}</Chip>
            {i < last && <ArrowRight aria-hidden size={18} strokeWidth={1.75} className="text-muted-on-dark rotate-90 md:rotate-0 ml-4 md:ml-0" />}
          </StaggerItem>
        ))}
      </ol>
    </Stagger>
  );
}
