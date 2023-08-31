import { ChangeEvent, useEffect, useState } from 'react'
import { PercentageButton } from './percentageButton'
import { PercentageInput } from './percentageInput'

type Props<T> = {
  value?: T
  values: Array<T>
  custom?: boolean
  title?: string
  onChange?: (value: T) => void
}

export function PercentageRow<T extends React.ReactNode>({
  value,
  values,
  custom = false,
  title,
  onChange,
}: Props<T>) {
  const handleClick = (value: T) => {
    onChange?.(value)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value as T)
  }

  return (
    <div className="flex justify-end gap-1.5 mt-4 mb-2 items-center">
      {title ? <span className="text-2xs">{title}</span> : null}
      {values.map((value, index) => (
        <PercentageButton
          key={index}
          handleClick={() => handleClick(value)}
          text={typeof value === 'number' ? value + '%' : value}
        />
      ))}
      {custom ? (
        <PercentageInput handleChange={handleChange} value={value as string} />
      ) : null}
    </div>
  )
}
