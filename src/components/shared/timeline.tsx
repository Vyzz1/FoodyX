import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const timelineVariants = cva("relative", {
  variants: {
    orientation: {
      vertical: "space-y-6",
      horizontal: "flex space-x-6",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export interface TimelineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineVariants> {
  items: TimelineItemProps[];
}

export function Timeline({
  className,
  orientation = "vertical",
  items,
  ...props
}: TimelineProps) {
  return (
    <div
      className={cn(timelineVariants({ orientation }), className)}
      {...props}
    >
      {items.map((item, index) => (
        <TimelineItem
          key={index}
          orientation={orientation}
          isLast={index === items.length - 1}
          {...item}
        />
      ))}
    </div>
  );
}

const timelineItemVariants = cva("relative", {
  variants: {
    orientation: {
      vertical: "pl-10 pb-2",
      horizontal: "pb-10 pt-1",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

export interface TimelineItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineItemVariants> {
  title: string;
  description?: string;
  date?: string;
  icon?: React.ReactNode;
  isLast?: boolean;
}

export function TimelineItem({
  className,
  orientation = "vertical",
  title,
  description,
  date,
  icon,
  isLast = false,
  ...props
}: TimelineItemProps) {
  return (
    <div
      className={cn(timelineItemVariants({ orientation }), className)}
      {...props}
    >
      {orientation === "vertical" ? (
        <>
          <div className="absolute size-6 left-0 top-1 rounded-full border border-amber-200 bg-white flex items-center justify-center">
            {icon}
          </div>
          {!isLast && (
            <div className="absolute left-3 top-7 bottom-0 w-px bg-amber-200" />
          )}
          <div>
            <div className="flex items-baseline justify-between">
              <h3 className="font-medium">{title}</h3>
              {date && (
                <span className="text-xs text-muted-foreground">{date}</span>
              )}
            </div>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <div>
            <div className="mb-2 flex items-center justify-center">
              <div className="size-12 rounded-full border border-amber-200 bg-white flex items-center justify-center">
                {icon}
              </div>
            </div>
            {!isLast && (
              <div className="absolute left-10 top-4 h-px w-full bg-amber-200" />
            )}
            <div className="text-center">
              <h3 className="font-medium">{title}</h3>
              {date && (
                <span className="text-xs text-muted-foreground block">
                  {date}
                </span>
              )}
              {description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
