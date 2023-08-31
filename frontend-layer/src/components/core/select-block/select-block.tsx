import usePopupStore from '@/store/popup'
import { FloatInput, PopupSelectToken } from '@/components/core'
import SelectButton from './select-button'
import { TokenData } from '@/constants'
import { NativeCurrency, Token } from '@uniswap/sdk-core'
import { useGetBalance } from '@/hooks'

type Props = {
  cost?: number
  disabled?: boolean
  token?: Token | NativeCurrency
  onChange?: (tokenData: TokenData) => void
  onBalanceClick?: (value: number) => void
  inputValue?: string
  onInputChange?: (value: string) => void
  inputDisabled?: boolean
}

export function SelectBlock({
  cost,
  disabled = false,
  onChange,
  token,
  onBalanceClick,
  inputValue,
  onInputChange,
  inputDisabled,
}: Props) {
  const { setOpen, setContent } = usePopupStore()
  const balance = useGetBalance(token)

  //Example of opening popup
  const handleSelectToken = () => {
    setOpen(true)
    setContent(
      <PopupSelectToken
        onSelect={(data) => {
          onChange?.(data)
          setOpen(false)
        }}
      />
    )
  }

  return (
    <div className="px-3 pt-2 bg-dark-grey rounded-xl">
      <SelectButton title={token?.symbol} handleClick={handleSelectToken} />
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center">
          <FloatInput
            value={inputValue}
            borderless
            transparent
            disabled={disabled || inputDisabled}
            placeholder="0.00"
            className="w-full -ml-4 text-xl font-semibold text-left"
            onChange={(value) => onInputChange?.(value)}
          />
          {cost ? (
            <span className="inline-block align-top text-darker-grey text-2xs">
              ${cost}
            </span>
          ) : null}
        </div>
        {balance ? (
          <span
            onClick={() =>
              !disabled && !inputDisabled && onBalanceClick?.(balance)
            }
            className="inline-block mt-0.5 align-top text-darker-grey text-2xs cursor-pointer whitespace-nowrap"
          >
            Balance: {balance.toLocaleString()}
          </span>
        ) : null}
      </div>
    </div>
  )
}
