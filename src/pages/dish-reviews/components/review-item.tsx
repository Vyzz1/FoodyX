import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Star } from "lucide-react";

interface ReviewItemProps {
  review: ReviewResponse;
}

export default function ReviewItem({ review }: ReviewItemProps) {
  return (
    <div className="border border-amber-300 dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4 flex-1">
      <div className="flex items-center space-x-4 mb-4">
        <Avatar className="size-12">
          <AvatarFallback>{review.user.fullName}</AvatarFallback>
          <AvatarImage src={review.user.photoUrl} alt={review.user.fullName} />
        </Avatar>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {review.user.fullName}
            </h3>

            <p className="text-sm text-muted-foreground">
              {format(new Date(review.createdAt), "dd/MM/yyyy")}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`size-5 text-amber-500 ${
                  star <= review.rating ? "fill-amber-500" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center space-x-2 my-2">
            {review.optionItemNames.map((option, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-sm text-gray-700 dark:text-gray-300 dark:border-stone-100"
              >
                {option}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{review.content}</p>
      <div className="flex items-center space-x-2 mb-4">
        {review.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Review image ${index + 1}`}
            className="w-20 h-28 rounded-md object-cover"
          />
        ))}
      </div>
    </div>
  );
}
