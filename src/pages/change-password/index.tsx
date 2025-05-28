import RenderFormField from "@/components/form/render-form-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import useSetTitle from "@/hooks/useSetTitle";
import useSubmitData from "@/hooks/useSubmitData";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const ChangePasword = () => {
  useSetTitle("Change Your Password");

  const formSchema = z
    .object({
      oldPassword: z.string().min(6, "Password must be at least 6 characters"),
      newPassword: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z
        .string()
        .min(6, "Password must be at least 6 characters"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })
    .refine((data) => data.newPassword !== data.oldPassword, {
      message: "New password should be different from current password",
      path: ["newPassword"],
    });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSuccess = () => {
    toast.success("Password changed successfully");
    form.reset();
  };

  const { mutate } = useSubmitData(
    "/auth/change-password",
    onSuccess,
    (error: any) => {
      toast.error(error["response"].data?.message);
    }
  );

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    try {
      mutate({ data, type: "post" });
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err?.message) {
        toast.error(err.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    } finally {
      form.reset({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };
  return (
    <section className="py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Change your account password to keep your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 mt-5"
            >
              <RenderFormField
                control={form.control}
                name="oldPassword"
                title="Current Password"
                type="input"
                inputType="password"
              />
              <RenderFormField
                control={form.control}
                name="newPassword"
                title="New Password"
                type="input"
                inputType="password"
              />
              <RenderFormField
                control={form.control}
                name="confirmPassword"
                inputType="password"
                title="Confirm Password"
                type="input"
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={form.handleSubmit(onSubmit)} type="submit">
            {" "}
            Change Password{" "}
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default ChangePasword;
