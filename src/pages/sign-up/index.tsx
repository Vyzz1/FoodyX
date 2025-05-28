import FormProvider from "@/components/form/form-provider";
import RenderFormField from "@/components/form/render-form-field";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Loader2Icon } from "lucide-react";
import { SignUpData, signUpSchema } from "./schema";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { useState } from "react";
import axios from "@/api/axios";
import { toast } from "sonner";
import RenderFormSelect from "@/components/form/render-form-select";
import AddressInput from "@/components/shared/address-input";
import useSetTitle from "@/hooks/useSetTitle";

const SignUpPage = () => {
  const form = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
  });
  useSetTitle("Register new account");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: SignUpData) => {
    try {
      setLoading(true);

      const response = await axios.post("/auth/register", data);

      if (response.data) {
        toast.success("Account created successfully!");

        toast("Please verify your email to continue");

        const { token, expiryDate } = response.data;

        navigate(
          `/verify-account?token=${token}&expiryDate=${expiryDate}&email=${data.email}`
        );

        return;
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message ?? "An error occurred.");

        if (error.response?.data.errors) {
          toast(
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(error.response.data.errors, null, 2)}
              </code>
            </pre>
          );
        }
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-amber-100 p-6 md:p-10 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-sm md:max-w-xl">
        <Card className="overflow-hidden border-none shadow-lg">
          <div className=" p-2 text-center">
            <h2 className="text-3xl font-bold text-amber-400 ">
              Create Account
            </h2>
            <p className="mt-1 ">Join us and start shopping today</p>
          </div>

          <CardContent className="p-6 pt-2">
            <FormProvider
              form={form}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <RenderFormField
                control={form.control}
                name="fullName"
                title="Full Name"
                type="input"
              />

              <RenderFormField
                control={form.control}
                name="email"
                title="Email"
                type="input"
                inputType="email"
              />

              <div className="grid gap-2 md:grid-cols-2">
                <RenderFormField
                  control={form.control}
                  name="password"
                  title="Password"
                  type="input"
                  inputType="password"
                />

                <RenderFormField
                  control={form.control}
                  name="confirmPassword"
                  title="Confirm Password"
                  type="input"
                  inputType="password"
                />
              </div>

              <div className="grid  place-items-center gap-2 md:grid-cols-2">
                <RenderFormSelect
                  control={form.control}
                  name="gender"
                  title="Gender"
                  type="key-value"
                  displayKey="label"
                  valueKey="value"
                  options={[
                    {
                      value: "male",
                      label: "Male",
                    },
                    {
                      value: "female",
                      label: "Female",
                    },
                    {
                      value: "other",
                      label: "Other",
                    },
                  ]}
                />

                <RenderFormField
                  control={form.control}
                  name="dateOfBirth"
                  title="Date of Birth"
                  className="w-full"
                  inputClassName="w-full"
                  type="date-picker"
                  inputType="password"
                />
              </div>

              <RenderFormField
                control={form.control}
                name="phoneNumber"
                title="Phone Number"
                type="input"
                inputType="number"
              />

              <AddressInput name="address" form={form} />

              <CardFooter className="flex justify-end p-0 pt-4">
                <Button
                  type="submit"
                  className="w-full dark:bg-primary dark:text-slate-900 bg-amber-500 text-white hover:bg-amber-600 transition-all duration-300"
                >
                  Create Account
                  {!loading ? (
                    <ArrowRight className="ml-2 h-4 w-4" />
                  ) : (
                    <span className="flex items-center justify-center">
                      <Loader2Icon className="animate-spin mr-2" />
                    </span>
                  )}
                </Button>
              </CardFooter>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to={"/login"}
                  className="font-medium text-amber-500 hover:text-amber-600 "
                >
                  Sign in
                </Link>
              </div>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SignUpPage;
