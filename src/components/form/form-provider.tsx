import { FieldValues, UseFormReturn } from "react-hook-form";
import { Form } from "../ui/form";
import { cn } from "@/lib/utils";

interface FormProviderProps<T extends FieldValues> {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  className?: string;
}

const FormProvider = <T extends FieldValues>({
  form,
  children,
  onSubmit,
  className,
}: FormProviderProps<T>) => {
  return (
    <Form {...form}>
      <form
        className={cn("space-y-4", className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {children}
      </form>
    </Form>
  );
};

export default FormProvider;
