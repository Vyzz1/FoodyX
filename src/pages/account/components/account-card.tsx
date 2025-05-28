import FormProvider from "@/components/form/form-provider";
import RenderFormField from "@/components/form/render-form-field";
import RenderFormSelect from "@/components/form/render-form-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import useSubmitData from "@/hooks/useSubmitData";
import { UserForm, userSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface AccountCardProps {
  user: User;
}

const AccountCard: React.FC<AccountCardProps> = ({ user }) => {
  const form = useForm<UserForm>({
    defaultValues: {
      ...user,
      dateOfBirth: new Date(user.dateOfBirth!),
    },
    resolver: zodResolver(userSchema),
  });

  const { updateCurrentUser, currentUser } = useAuth();

  const onSuccess = (data: any) => {
    toast.success("Account information updated successfully!");

    updateCurrentUser({
      ...currentUser!,
      name: data.fullName,
    });
  };

  const { mutate, isPending } = useSubmitData(
    "/user/change-information",
    onSuccess,
    (error: any) => {
      toast.error(error.response?.data.message ?? "An error occurred.");
    }
  );

  async function handleSubmit(data: UserForm) {
    return await mutate({ data, type: "patch" });
  }

  return (
    <Card title="Account Details">
      <CardHeader>
        <CardTitle>Your Information</CardTitle>
        <CardDescription>View and manage your account details.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-x-4">
          <Avatar slot="avatar" className="w-16 h-16">
            <AvatarFallback>
              {user.fullName
                .split(" ")
                .map((word) => word.charAt(0))
                .join("")}
            </AvatarFallback>
            <AvatarImage
              src={user.photoUrl ?? "/images/user.avif"}
              alt={user.fullName}
            />
          </Avatar>
          <Link to={"/user/change-avatar"}>
            <Button variant={"link"}>Change Avatar</Button>
          </Link>
        </div>

        <FormProvider
          form={form}
          onSubmit={handleSubmit}
          className="space-y-4 mt-12"
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
            readonly={true}
            type="input"
            inputType="email"
          />
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
        </FormProvider>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button
          disabled={isPending}
          type="submit"
          onClick={form.handleSubmit(handleSubmit)}
        >
          {isPending && <Loader className="animate-spin mr-2" />}
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccountCard;
