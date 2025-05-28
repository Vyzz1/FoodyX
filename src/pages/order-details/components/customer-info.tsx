import { MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerInfoProps {
  specificAddress: string;
  fullAddress: string;
  phoneNumber: string;
  note: string | null;
  fullName: string;
}

export function CustomerInfo({
  specificAddress,
  fullAddress,
  phoneNumber,
  fullName = "Your Name",
  note,
}: CustomerInfoProps) {
  return (
    <Card className="border-amber-100">
      <CardHeader className="pb-3 border-b border-amber-100">
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 text-amber-500" />
            <div>
              <p className="font-medium">Delivery Address</p>
              <p className="text-sm text-muted-foreground font-semibold">
                {fullName}
              </p>

              <p className="text-sm text-muted-foreground">{fullAddress}</p>
              <p className="text-sm text-muted-foreground">{specificAddress}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-amber-500" />
            <div>
              <p className="font-medium">Contact</p>
              <p className="text-sm text-muted-foreground">{phoneNumber}</p>
            </div>
          </div>
          {note && (
            <div className="mt-2 rounded-md bg-amber-50 p-3 text-sm border border-amber-100">
              <p className="font-medium text-amber-800">Note:</p>
              <p>{note}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
