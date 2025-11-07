import { cn } from "~/lib/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface FormInputProps {
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    defaultValue?: string;
    error?: string;
    placeholder?: string;
    className?: string
}


export function FormInput({
    name,
    label,
    type,
    required,
    defaultValue,
    error,
    placeholder,
    className
}: FormInputProps) {
    const hasError = !!error;

    return (
        <div className="space-y-2">
            <Label
                htmlFor={name}
                className={cn(hasError && "text-destructive")}
            >
                {label} {required && <span className="text-destructive">*</span>}
            </Label>
            <Input
                id={name}
                name={name}
                type={type}
                required={required}
                defaultValue={defaultValue}
                placeholder={placeholder}
                className={cn(className, hasError && "border-destructive focus-visible:ring-destructive")}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${name}-error` : undefined}
            />
            {hasError && (
                <p id={`${name}-error`} className="text-sm text-destructive">
                    {error}
                </p>
            )}
        </div>
    )
}


interface FormTextareaProps {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
  error?: string;
  placeholder?: string;
  rows?: number;
}


export function FormTextarea({
    name,
    label,
    required = false,
    defaultValue = "",
    error,
    placeholder,
    rows = 4
}: FormTextareaProps) {
    const hasError = !!error

    return (
        <div className="space-y-2">
            <Label htmlFor={name} className={cn(hasError && "text-destructive")}>
                {label} {required && <span className="text-destructive">*</span>}
            </Label>
            <Textarea
              id={name}
              name={name}
              required={required}
              defaultValue={defaultValue}
              placeholder={placeholder}
              rows={rows}
              className={cn(hasError && "border-destructive focus-visible:ring-destructive")}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${name}-error` : undefined}
            />
            {hasError && (
                <p id={`${name}-error`} className="text-sm text-destructive">
                    {error}
                </p>
            )}
        </div>
    )
}
