"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  Controller,
} from "react-hook-form";
import { ZodType, z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

type FormWrapperProps<T extends ZodType<any, any>> = {
  schema: T;
  onSubmit: (values: z.infer<T>) => void;
  children: (control: any) => React.ReactNode; // render props to pass control
  submitLabel?: string;
  className?: string;
};

export default function FormWrapper<T extends ZodType<any, any>>({
  schema,
  onSubmit,
  children,
  submitLabel = "Submit",
  className,
}: FormWrapperProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema) as any,
    defaultValues: {} as z.infer<T>,
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
          {children(form.control)}
          <Button type="submit" className="w-full py-3 text-lg">
            {submitLabel}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
