import usePopupStore from '@/store/popup'
import { PopupSelectToken } from '@/components/core'
import SelectButton from './select-button'
import { Token, NativeCurrency } from '@uniswap/sdk-core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { cloneDeep } from 'lodash'

type RedeemSelectBlockProps = {
  value?: (Token | NativeCurrency | undefined)[]
  onChange?: (value: (Token | NativeCurrency | undefined)[]) => void
}

export function RedeemSelectBlock(props: RedeemSelectBlockProps) {
  const { setOpen, setContent } = usePopupStore()
  const { value, onChange } = props
  const [customValue, setCustomValue] = useState<(Token | NativeCurrency)[]>([])

  const tokens = useMemo(() => {
    return customValue.length ? customValue : value || []
  }, [customValue, value])

  const handleSelectToken = useCallback(
    (index: 0 | 1) => {
      if (value) return
      setOpen(true)
      setContent(
        <PopupSelectToken
          onSelect={(token) => {
            setCustomValue((prev) => {
              const newCustomValue = cloneDeep(prev)
              if (token.token) newCustomValue[index] = token.token
              return newCustomValue
            })
            setOpen(false)
          }}
        />
      )
    },
    [setContent, setOpen, value]
  )

  useEffect(() => {
    if (customValue.length && !value) onChange?.(customValue)
  }, [customValue, onChange, value])

  return (
    <div className="flex justify-between p-3 pt-2 bg-dark-grey rounded-xl">
      <SelectButton
        handleClick={() => handleSelectToken(0)}
        title={tokens.length ? tokens[0]?.symbol : undefined}
      />
      <SelectButton
        handleClick={() => handleSelectToken(1)}
        title={tokens.length ? tokens[1]?.symbol : undefined}
      />
    </div>
  )
}
