import { otpSchema, OTPValues } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import axios from "@/api/axios";
import { useAuth } from "@/hooks/useAuth";
import useSetTitle from "@/hooks/useSetTitle";

const VerifyAccount = () => {
  useSetTitle("Verify Your Account");
  const [params, setParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  const token = params.get("token");

  const expiry = params.get("expiryDate");

  const email = params.get("email");

  const navigator = useNavigate();

  useEffect(() => {
    if (!token || !expiry) {
      navigator("/login", { replace: true });
    }
  }, [token, expiry, navigator]);

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  useEffect(() => {
    const calculateTimeLeft = () => {
      const expiryTime = new Date(expiry!).getTime();

      console.log(expiryTime);
      const now = new Date().getTime();
      const difference = expiryTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        return 0;
      }

      return Math.floor(difference / 1000);
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          setIsExpired(true);
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [expiry]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const { setAuth, updateCurrentUser } = useAuth();

  const handleSubmit = async (data: OTPValues) => {
    try {
      setLoading(true);
      const res = await axios.post("/auth/verify-account", {
        ...data,
        token: token,
      });

      if (res) {
        toast.success("Account verified successfully");

        const { accessToken, fullName, role, email, photoUrl, id } = res.data;

        setAuth(accessToken);

        updateCurrentUser({
          name: fullName,
          email,
          role,
          id,
          photoUrl: photoUrl ?? null,
        });
        navigator("/", { replace: true });
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message ?? "Invalid OTP");
    } finally {
      setLoading(false);
      form.reset({ otp: "" });
    }
  };

  const handleResend = async () => {
    try {
      form.reset({ otp: "" });
      setResending(true);

      setLoading(true);
      const res = await axios.post("/auth/resend-otp", {
        email: email,
      });
      if (res) {
        toast.success("OTP resent successfully");

        const { token, expiryDate } = res.data;

        setParams({ ...params, token, expiryDate });
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message ?? "Invalid OTP");
    } finally {
      setLoading(false);
      setResending(false);
      setIsExpired(false);
    }
  };

  const form = useForm<OTPValues>({
    resolver: zodResolver(otpSchema),
  });

  return (
    <section className=" px-4 py-8 dark:bg-neutral-900 bg-gray-50  h-screen">
      <div className="max-w-2xl mx-auto border mb-28  dark:border-neutral-700 border-neutral-300 rounded-lg shadow-md p-8 bg-white dark:bg-neutral-800">
        <div className="my-5 space-y-2">
          <h2 className="text-amber-500 font-semibold text-2xl text-center  uppercase">
            Verify your account
          </h2>
          <p className="text-muted-foreground text-sm text-center  dark:text-stone-100">
            A verification code has been sent to your email. Please enter the
            code to verify your account.
          </p>
        </div>
        <Form {...form}>
          <form
            className="space-y-6 w-full "
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col items-center justify-center">
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot
                          className="dark:border-stone-200"
                          index={0}
                        />
                        <InputOTPSlot
                          className="dark:border-stone-200"
                          index={1}
                        />
                        <InputOTPSlot
                          className="dark:border-stone-200"
                          index={2}
                        />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot
                          className="dark:border-stone-200"
                          index={3}
                        />
                        <InputOTPSlot
                          className="dark:border-stone-200"
                          index={4}
                        />
                        <InputOTPSlot
                          className="dark:border-stone-200"
                          index={5}
                        />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-center ">
              {isExpired ? (
                <div className="flex items-center justify-center gap-1">
                  <p>The code expired </p>
                  <Button
                    variant="outline"
                    disabled={resending}
                    onClick={handleResend}
                  >
                    Resend OTP
                  </Button>
                  .
                </div>
              ) : (
                `OTP Code expires in ${formatTime(timeLeft)}`
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || isExpired || resending}
              className="w-full bg-amber-500 text-white hover:bg-amber-600 transition-all duration-300"
              size="lg"
            >
              {loading && <Loader className="mr-2 animate-spin" />}
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
};

export default VerifyAccount;
