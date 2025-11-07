import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import type { FieldConfig } from "../types/field-config";

interface DynamicFormProps {
  fields: FieldConfig[];
  formData: Record<string, any>;
  onChange: (name: string, value: any) => void;
  layout?: "vertical" | "horizontal" | "grid";
  gridColumns?: number;
  validationErrors?: Record<string, string[]>;
}

export function DynamicForm({
  fields,
  formData,
  onChange,
  layout = "vertical",
  gridColumns = 2,
  validationErrors = {},
}: DynamicFormProps) {
  const handleChange = (fieldName: string, value: any) => {
    onChange(fieldName, value);
  };

  const renderField = (field: FieldConfig) => {
    const fieldErrors = validationErrors[field.name];
    const hasError = fieldErrors && fieldErrors.length > 0;

    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] || field.defaultValue || "",
      placeholder: field.placeholder,
      required: field.required,
      readOnly: field.readOnly,
      className: `${field.className || ""} ${hasError ? "border-red-500 focus:ring-red-500" : ""}`,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => handleChange(field.name, e.target.value),
    };

    switch (field.type) {
      case "textarea":
        return (
          <div className="space-y-1">
            <Textarea
              {...commonProps}
              className={`w-full h-24 border rounded-md px-2 py-1 text-sm ${commonProps.className}`}
            />
            {hasError && (
              <div className="text-red-500 text-xs space-y-1">
                {fieldErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>
        );

      case "select":
        return (
          <div className="space-y-1">
            <Select
              value={formData[field.name] || ""}
              onValueChange={(value) => handleChange(field.name, value)}
            >
              <SelectTrigger className={commonProps.className}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {hasError && (
              <div className="text-red-500 text-xs space-y-1">
                {fieldErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>
        );

      case "number":
        return (
          <div className="space-y-1">
            <Input
              {...commonProps}
              type="number"
              inputMode="numeric"
              onChange={(e) => handleChange(field.name, e.target.valueAsNumber)}
            />
            {hasError && (
              <div className="text-red-500 text-xs space-y-1">
                {fieldErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>
        );

      case "tel":
        return (
          <div className="space-y-1">
            <Input {...commonProps} type="tel" inputMode="tel" />
            {hasError && (
              <div className="text-red-500 text-xs space-y-1">
                {fieldErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>
        );

      case "email":
        return (
          <div className="space-y-1">
            <Input {...commonProps} type="email" inputMode="email" />
            {hasError && (
              <div className="text-red-500 text-xs space-y-1">
                {fieldErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>
        );

      case "date":
        return (
          <div className="space-y-1">
            <Input
              {...commonProps}
              type="date"
              onChange={(e) => handleChange(field.name, e.target.value)}
            />
            {hasError && (
              <div className="text-red-500 text-xs space-y-1">
                {fieldErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-1">
            <Input
              {...commonProps}
              type="text"
              inputMode={field.inputMode || "text"}
              pattern={field.pattern}
            />
            {hasError && (
              <div className="text-red-500 text-xs space-y-1">
                {fieldErrors.map((error, index) => (
                  <div key={index}>{error}</div>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  const getLayoutClass = () => {
    switch (layout) {
      case "horizontal":
        return "flex flex-row items-center gap-4";
      case "grid":
        return `grid grid-cols-1 md:grid-cols-${gridColumns} gap-4`;
      default:
        return "space-y-4";
    }
  };

  return (
    <div className={getLayoutClass()}>
      {fields.map((field) => (
        <div
          key={field.name}
          className={layout === "horizontal" ? "flex-1" : ""}
        >
          <Label
            htmlFor={field.name}
            className={layout === "horizontal" ? "min-w-[120px]" : ""}
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {renderField(field)}
        </div>
      ))}
    </div>
  );
}
