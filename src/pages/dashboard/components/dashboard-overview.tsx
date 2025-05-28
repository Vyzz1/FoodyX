import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, PercentIcon, User2 } from "lucide-react";

interface DashboardOverviewProps {
  totalRevenue: number;
  totalProfit: number;
  totalCost: number;
  totalOrders: number;
  totalUsers: number;
  isLoading?: boolean;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function DashboardOverview({
  totalRevenue,
  totalProfit,
  totalCost,
  totalOrders,
  totalUsers,
  isLoading = false,
}: DashboardOverviewProps) {
  const cards = [
    {
      title: "Total Revenue",
      value: formatter.format(totalRevenue),
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Cost",
      value: formatter.format(totalCost),
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Profit",
      value: formatter.format(totalProfit),
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Margin",
      value:
        totalRevenue && totalCost
          ? `${(((totalRevenue - totalCost) / totalRevenue) * 100).toFixed(2)}%`
          : "0%",
      icon: <PercentIcon className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
    },
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      icon: <User2 className="h-4 w-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <span className="text-2xl font-bold">{card.value}</span>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
