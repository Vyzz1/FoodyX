import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpCircle, Calendar, CreditCard } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import React from "react";

interface PaymentCardsProps {
  payments: any;
  isLoading: boolean;
}
const PaymentCards: React.FC<PaymentCardsProps> = ({ payments, isLoading }) => {
  const calculateMetrics = () => {
    if (!payments || !payments.content || payments.content.length === 0) {
      return {
        totalAmount: 0,
        biggestPayment: { amount: 0, date: null },
        recentPayment: { amount: 0, date: null },
      };
    }

    const totalAmount = payments.content.reduce(
      (sum: any, payment: { amount: any }) => sum + (payment.amount || 0),
      0
    );

    const biggestPayment = payments.content.reduce(
      (max: { amount: number }, payment: { amount: number; paidAt: any }) =>
        payment.amount > max.amount
          ? { amount: payment.amount, date: payment.paidAt }
          : max,
      { amount: 0, date: null }
    );

    const totalPayments = payments.content.length || 0;

    return { totalAmount, biggestPayment, totalPayments };
  };

  const { totalAmount, biggestPayment, totalPayments } = isLoading
    ? {
        totalAmount: 0,
        biggestPayment: { amount: 0, date: null },
        totalPayments: { amount: 0, date: null },
      }
    : calculateMetrics();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Amount</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-muted-foreground" />
            {isLoading ? (
              <span className="h-8 w-24 bg-muted animate-pulse rounded"></span>
            ) : (
              formatCurrency(totalAmount)
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Sum of all your payments
          </p>
        </CardContent>
      </Card>

      {/* Biggest Payment Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Biggest Payment</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            <ArrowUpCircle className="mr-2 h-5 w-5 text-muted-foreground" />
            {isLoading ? (
              <span className="h-8 w-24 bg-muted animate-pulse rounded"></span>
            ) : (
              formatCurrency(biggestPayment.amount)
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              <span className="h-4 w-20 bg-muted animate-pulse rounded"></span>
            ) : biggestPayment.date ? (
              `Made on ${formatDate(biggestPayment.date)}`
            ) : (
              "No payments yet"
            )}
          </p>
        </CardContent>
      </Card>

      {/* Recent Payment Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Payments</CardDescription>
          <CardTitle className="text-2xl flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
            {isLoading ? (
              <span className="h-8 w-24 bg-muted animate-pulse rounded"></span>
            ) : (
              totalPayments
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {isLoading ? (
              <span className="h-4 w-20 bg-muted animate-pulse rounded"></span>
            ) : totalPayments ? (
              `Total Payments`
            ) : (
              "No payments yet"
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCards;
