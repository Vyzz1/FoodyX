import axios from "@/api/axios";
import RenderFormField from "@/components/form/render-form-field";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Progress } from "@/components/ui/progress";
import ForgotPasswordContext, {
  ForgotPasswordProvider,
} from "@/context/password-context";
import useSetTitle from "@/hooks/useSetTitle";
import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { otpSchema, OTPValues } from "@/schema";

type ForgotPasswordProps = {
  setProgress: React.Dispatch<React.SetStateAction<number>>;
};

const InputEmail = ({ setProgress }: ForgotPasswordProps) => {
  const formSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
  });
  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const { setToken, loading, setLoading, setExpiry, setEmail } = useContext(
    ForgotPasswordContext
  );

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const res = await axios.post("/password/forgot", data);
      if (res) {
        setEmail?.(data.email);
        setToken(res.data.token);
        setProgress(66);
        setExpiry(res.data.expiryDate);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message ?? "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center space-y-2">
        <h4 className="text-2xl font-semibold text-amber-300">
          Enter Your Email
        </h4>
        <p className="text-muted-foreground text-sm">Step 1 of 3</p>
      </div>
      <Form {...form}>
        <form
          className="space-y-6 max-w-lg w-full mx-auto"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <RenderFormField
            control={form.control}
            name="email"
            inputType="email"
            title="Email"
            type="input"
          />
          <FormDescription className="block border-l-2 border-primary/70 pl-3">
            We'll send you a one-time password to reset your account
          </FormDescription>
          <Button
            size="lg"
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600"
          >
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

const TypeOTP = ({ setProgress }: ForgotPasswordProps) => {
  const form = useForm<OTPValues>({
    resolver: zodResolver(otpSchema),
  });
  const { email, token, setToken, loading, setLoading, expiry, setExpiry } =
    useContext(ForgotPasswordContext);

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const expiryTime = new Date(expiry).getTime();
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

  const onSubmit = async (data: OTPValues) => {
    try {
      setLoading(true);
      const res = await axios.post("/password/validate", {
        ...data,
        token: token,
      });
      if (res) {
        setToken(res.data.token);
        setProgress(100);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message ?? "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      form.reset({ otp: "" });
      setResending(true);

      setLoading(true);
      const res = await axios.post("/password/forgot", {
        email: email,
      });
      if (res) {
        setToken(res.data.token);
        setExpiry(res.data.expiryDate);
        toast.success("OTP resent successfully");
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

  return (
    <div className="w-full">
      <div className="mb-8 text-center space-y-2">
        <h4 className="text-2xl font-semibold text-yellow-500">
          Enter Verification Code
        </h4>
        <p className="text-muted-foreground text-sm">Step 2 of 3</p>
        <p className="text-sm text-muted-foreground mt-2">
          We've sent a 6-digit code to your email
        </p>
      </div>
      <div className="w-full flex flex-col items-center justify-center">
        <Form {...form}>
          <form
            className="space-y-6 w-full max-w-xl"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col items-center justify-center">
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between my-3">
              {isExpired ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResend}
                  disabled={resending}
                  className="text-sm"
                >
                  {resending ? "Sending..." : "Resend OTP"}
                </Button>
              ) : (
                <div className="text-sm text-muted-foreground">
                  Expires in:{" "}
                  <span className="font-medium text-amber-600">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}
            </div>
            <Button
              type="submit"
              disabled={loading || isExpired || resending}
              className="w-full bg-amber-500 hover:bg-amber-600"
              size="lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

const ChangePasword = ({ setProgress }: ForgotPasswordProps) => {
  const formSchema = z
    .object({
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z
        .string()
        .min(6, "Password must be at least 6 characters"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });
  const { token, setToken, loading, setLoading } = useContext(
    ForgotPasswordContext
  );

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const res = await axios.post("/password/reset", {
        ...data,
        token: token,
      });
      if (res) {
        setToken("");
        setProgress(169);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message ?? "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center space-y-2">
        <h4 className="text-2xl font-semibold text-amber-500">
          Create New Password
        </h4>
        <p className="text-muted-foreground text-sm">Step 3 of 3</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-lg mx-auto"
        >
          <RenderFormField
            control={form.control}
            name="password"
            inputType="password"
            title="New Password"
            type="input"
          />
          <RenderFormField
            control={form.control}
            name="confirmPassword"
            inputType="password"
            title="Confirm Password"
            type="input"
          />
          <FormDescription className="block border-l-2 border-primary/70 pl-3">
            Your password must be at least 6 characters long
          </FormDescription>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600"
            size="lg"
          >
            {loading ? "Updating..." : "Reset Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

const SuccessPage = () => {
  return (
    <div className="w-full">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="flex justify-center"></div>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-amber-400">
            Password Reset Successful!
          </h3>
          <p className="text-muted-foreground">
            Your password has been changed successfully. You can now log in with
            your new password.
          </p>
        </div>
        <div className="pt-4">
          <Link to="/login">
            <Button size="sm" className="min-w-[200px]">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ForgotPassword = () => {
  const [progress, setProgress] = useState(33);

  useSetTitle("Forgot Password");

  return (
    <section className="  dark:from-gray-900 dark:to-gray-800 px-4 py-12 w-screen h-screen  bg-gradient-to-b from-amber-50 to-amber-100">
      <h2 className="font-semibold text-2xl md:text-4xl mb-8 text-center  text-amber-500 tracking-tighter">
        Reset Your Password
      </h2>

      <div className="max-w-4xl w-full mx-auto">
        <Progress value={progress} className="h-2" />

        <ForgotPasswordProvider>
          <div className="p-6 md:p-12 w-full border rounded-lg bg-card shadow-sm mt-8">
            {progress === 33 && <InputEmail setProgress={setProgress} />}
            {progress === 66 && <TypeOTP setProgress={setProgress} />}
            {progress === 100 && <ChangePasword setProgress={setProgress} />}
            {progress === 169 && <SuccessPage />}
          </div>
        </ForgotPasswordProvider>
      </div>
    </section>
  );
};

export default ForgotPassword;
