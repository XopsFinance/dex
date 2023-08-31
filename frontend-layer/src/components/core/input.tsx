import classNames from 'classnames'
import { isNumber, omit } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  borderless?: boolean
  transparent?: boolean
}

export const Input = (props: InputProps) => {
  const { borderless, transparent } = props

  return (
    <input
      {...omit(props, ['className'])}
      className={classNames([
        'rounded-lg py-[13px] px-[21px] bg-dark-navy placeholder-default text-white border-dark-navy border focus:border focus:border-primary focus:outline-none text-sm',
        {
          'border-none active:border-none': borderless,
        },
        {
          'bg-transparent': transparent,
        },
        props.className,
      ])}
    />
  )
}

export const FloatInput = ({
  className,
  onChange,
  placeholder,
  value,
  borderless,
  transparent,
  disabled,
}: {
  className?: string
  onChange?: (value: string) => void
  defaultValue?: any
  placeholder?: string
  value?: string
  borderless?: boolean
  transparent?: boolean
  disabled?: boolean
}) => {
  // const handleFloat = useCallback(() => {
  //   // The conditional prevents parseFloat(null) = NaN (when the user deletes the input)
  //   onChange?.(Number(isNumber(value) ? parseFloat(value.toString()) : ''))
  // }, [value, onChange])

  return (
    <Input
      type="number"
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        onChange?.(e.target.value)
      }}
      // onBlur={handleFloat}
      className={className}
      borderless={borderless}
      transparent={transparent}
      disabled={disabled}
    />
  )
}
