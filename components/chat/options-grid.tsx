"use client"

import { OptionBubble } from "./option-bubble"

interface OptionsGridProps {
  options: string[]
  onOptionClick: (option: string) => void
  className?: string
}

export function OptionsGrid({ options, onOptionClick, className = "" }: OptionsGridProps) {
  if (!options || options.length === 0) {
    return null
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option, index) => (
        <OptionBubble
          key={index}
          option={option}
          onClick={onOptionClick}
        />
      ))}
    </div>
  )
}
