"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type DatePickerResponse = {
  target: {
    value: string;
    name: string;
  };
};

export function DatePicker({
  onSelectDate,
  value,
}: {
  onSelectDate: (date: DatePickerResponse) => void;
  value?: string;
}) {
  const initialDate = value ? new Date(value) : new Date();
  const [date, setDate] = React.useState<Date | undefined>(initialDate);

  React.useEffect(() => {
    onSelectDate({
      target: {
        value: new Date(date!)?.toISOString(),
        name: "date",
      },
    });
  }, [date]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-semibold shadow-sm",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
