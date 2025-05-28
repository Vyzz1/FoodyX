
import * as React from "react"
import { useFormField } from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { Rating,RatingProps } from "./rating"

export interface FormRatingProps extends Omit<RatingProps, "defaultValue"> {
  defaultValue?: number
}

const FormRating = React.forwardRef<HTMLDivElement, FormRatingProps>(({ className, ...props }, ref) => {
  const {  name, formDescriptionId, formMessageId } = useFormField()

  return (
    <Rating
      ref={ref}
      name={name}
      aria-describedby={!props.readOnly ? `${formDescriptionId} ${formMessageId}` : undefined}
      className={cn("w-full", className)}
      {...props}
    />
  )
})

FormRating.displayName = "FormRating"

export { FormRating }
