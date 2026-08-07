"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SelectProps {
  name?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

const SelectContext = React.createContext<{
  value: string
  onValueChange: (val: string) => void
} | null>(null)

export function Select({ name, value, defaultValue = "", onValueChange, children }: SelectProps) {
  const [val, setVal] = React.useState(value || defaultValue)

  const handleChange = (newVal: string) => {
    setVal(newVal)
    onValueChange?.(newVal)
  }

  const current = value !== undefined ? value : val

  return (
    <SelectContext.Provider value={{ value: current, onValueChange: handleChange }}>
      <input type="hidden" name={name} value={current} />
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50", className)}>
      {children}
    </div>
  )
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = React.useContext(SelectContext)
  return <span>{ctx?.value || placeholder}</span>
}

export function SelectContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md p-1", className)}>{children}</div>
}

export function SelectItem({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) {
  const ctx = React.useContext(SelectContext)
  return (
    <div
      onClick={() => ctx?.onValueChange(value)}
      className={cn("relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground", className)}
    >
      {children}
    </div>
  )
}
