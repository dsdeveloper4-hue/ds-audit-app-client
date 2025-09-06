"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, DefaultValues } from "react-hook-form";
import { ZodType, z } from "zod";
import { motion } from "framer-motion";
import { Form } from "@/components/ui/form";
type FormWrapperProps<T extends ZodType<any, any>> = {
  schema: T;
  onSubmit: (values: z.infer<T>) => void;
  children: (
    control: any,
    handleSubmit: SubmitHandler<z.infer<T>>
  ) => React.ReactNode;
  className?: string;
  defaultValues?: DefaultValues<z.infer<T>>; // optional & correct type
};

export default function FormWrapper<T extends ZodType<any, any>>({
  schema,
  onSubmit,
  children,
  className,
  defaultValues,
}: FormWrapperProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema) as any,
    defaultValues,
  });

  const handleSubmit: SubmitHandler<z.infer<T>> = (values) => onSubmit(values);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`w-full max-w-lg mx-auto p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl ${className}`}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {children(form.control, form.handleSubmit(handleSubmit))}
        </form>
      </Form>
    </motion.div>
  );
}
