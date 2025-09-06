"use client";

import { Input } from "@/components/ui/input";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Controller, Control, FieldValues } from "react-hook-form";

type FormInputProps<T extends FieldValues> = {
  name: keyof T;
  label: string;
  placeholder?: string;
  control: Control<T>;
  type?: string;
};

export default function FormInput<T extends FieldValues>({
  name,
  label,
  placeholder,
  control,
  type = "text",
}: FormInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name as any}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} type={type} placeholder={placeholder} />
          </FormControl>
          {fieldState.error && (
            <FormMessage>{fieldState.error.message}</FormMessage>
          )}
        </FormItem>
      )}
    />
  );
}
