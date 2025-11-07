// "use client";

// import * as React from "react";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import { cn } from "~/lib/utils";
// import { Button } from "~/components/ui/button";
// import { Calendar } from "~/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "~/components/ui/popover";
// import { Label } from "~/components/ui/label";

// interface DatePickerFieldProps {
//   name: string;
//   label: string;
//   required?: boolean;
//   defaultValue?: string;
//   error?: string;
//   className?: string;
// }

// export function DatePicker({
//   name,
//   label,
//   required = false,
//   defaultValue,
//   error,
//   className,
// }: DatePickerFieldProps) {
//   const [date, setDate] = React.useState<Date | undefined>(
//     defaultValue ? new Date(defaultValue) : new Date()
//   );

//   const hasError = !!error;

//   return (
//     <div className="space-y-2">
//       <Label htmlFor={name} className={cn(hasError && "text-destructive")}>
//         {label} {required && <span className="text-destructive">*</span>}
//       </Label>

//       {/* Hidden input for form submission */}
//       <input
//         type="hidden"
//         name={name}
//         value={date?.toISOString() || ""}
//       />

//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             className={cn(
//               "w-full justify-start text-left font-normal",
//               !date && "text-muted-foreground",
//               hasError && "border-destructive focus-visible:ring-destructive",
//               className
//             )}
//             id={name}
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {date ? format(date, "PPP") : <span>Pick a date</span>}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             mode="single"
//             selected={date}
//             onSelect={setDate}
//             initialFocus
//           />
//         </PopoverContent>
//       </Popover>

//       {hasError && (
//         <p className="text-sm text-destructive">{error}</p>
//       )}
//     </div>
//   );
// }

"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Label } from "~/components/ui/label";

interface DatePickerFieldProps {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
  error?: string;
  className?: string;
}

export function DatePickerField({
  name,
  label,
  required = false,
  defaultValue,
  error,
  className,
}: DatePickerFieldProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : new Date()
  );

  const hasError = !!error;

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className={cn(hasError && "text-destructive")}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={date?.toISOString() || ""}
      />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              hasError && "border-destructive focus-visible:ring-destructive",
              className
            )}
            id={name}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {hasError && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
