"use client"

import * as React from "react"
import { Star, StarHalf } from "lucide-react"
import { cn } from "@/lib/utils"

export interface RatingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: number
  defaultValue?: number
  count?: number
  size?: "sm" | "md" | "lg"
  color?: string
  emptyColor?: string
  emptyIcon?: React.ReactNode
  filledIcon?: React.ReactNode
  halfIcon?: React.ReactNode
  readOnly?: boolean
  disabled?: boolean
  precision?: 0.5 | 1
  onChange?: (value: number) => void
  name?: string
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value,
      defaultValue = 0,
      count = 5,
      size = "md",
      color = "text-yellow-400",
      emptyColor = "text-gray-300",
      emptyIcon,
      filledIcon,
      halfIcon,
      readOnly = false,
      disabled = false,
      precision = 1,
      onChange,
      name,
      className,
      ...props
    },
    ref,
  ) => {
    const [rating, setRating] = React.useState(value ?? defaultValue)
    const [hoverRating, setHoverRating] = React.useState<number | null>(null)
    const isControlled = value !== undefined

    React.useEffect(() => {
      if (isControlled && value !== rating) {
        setRating(value)
      }
    }, [isControlled, value, rating])

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>, index: number) => {
      if (readOnly || disabled) return

      const { left, width } = event.currentTarget.getBoundingClientRect()
      const percent = (event.clientX - left) / width

      if (precision === 0.5) {
        setHoverRating(percent <= 0.5 ? index + 0.5 : index + 1)
      } else {
        setHoverRating(index + 1)
      }
    }

    const handleMouseLeave = () => {
      if (readOnly || disabled) return
      setHoverRating(null)
    }

    const handleClick = (newRating: number) => {
      if (readOnly || disabled) return

      const newValue = rating === newRating ? 0 : newRating

      if (!isControlled) {
        setRating(newValue)
      }

      onChange?.(newValue)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
      if (readOnly || disabled) return

      if (event.key === "ArrowRight" || event.key === "ArrowUp") {
        event.preventDefault()
        const newRating = Math.min(count, precision === 0.5 ? rating + 0.5 : rating + 1)
        if (!isControlled) {
          setRating(newRating)
        }
        onChange?.(newRating)
      } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
        event.preventDefault()
        const newRating = Math.max(0, precision === 0.5 ? rating - 0.5 : rating - 1)
        if (!isControlled) {
          setRating(newRating)
        }
        onChange?.(newRating)
      } else if (event.key === " " || event.key === "Enter") {
        event.preventDefault()
        const newValue = rating === index + 1 ? 0 : index + 1
        if (!isControlled) {
          setRating(newValue)
        }
        onChange?.(newValue)
      }
    }

    const sizeClasses = {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-6 w-6",
    }

    const displayRating = hoverRating !== null ? hoverRating : rating

    const renderIcon = (index: number) => {
      const isActive = index + 1 <= displayRating
      const isHalf = precision === 0.5 && Math.ceil(displayRating) === index + 1 && displayRating % 1 !== 0

      if (isHalf) {
        return halfIcon || <StarHalf className={cn(sizeClasses[size], color)} />
      }

      if (isActive) {
        return filledIcon || <Star className={cn(sizeClasses[size], color, "fill-current")} />
      }

      return emptyIcon || <Star className={cn(sizeClasses[size], emptyColor)} />
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-center", disabled && "opacity-50 cursor-not-allowed", className)}
        {...props}
      >
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "inline-flex items-center justify-center cursor-pointer",
              readOnly && "cursor-default",
              disabled && "cursor-not-allowed",
            )}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index + 1)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={readOnly || disabled ? -1 : 0}
            role="radio"
            aria-checked={Math.ceil(rating) > index}
            aria-label={`${index + 1} stars`}
          >
            {renderIcon(index)}
            {name && (
              <input
                type="radio"
                name={name}
                value={index + 1}
                checked={Math.ceil(rating) === index + 1}
                onChange={() => {}}
                className="sr-only"
              />
            )}
          </div>
        ))}
      </div>
    )
  },
)

Rating.displayName = "Rating"

export { Rating }
