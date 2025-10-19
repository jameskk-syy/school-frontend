"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

interface Calendar22Props {
  date: Date | undefined
  onSelect: (date: Date) => void
  label?: string
}

export function Calendar22({ date, onSelect, label }: Calendar22Props) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex w-full flex-col gap-3">
      {label && <Label className="px-1">{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            required={true} 
            captionLayout="dropdown"
            onSelect={(d: Date) => {
              onSelect(d)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
