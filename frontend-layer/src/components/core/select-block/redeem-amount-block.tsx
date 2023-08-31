import usePopupStore from '@/store/popup'
import { FloatInput, PopupSelectToken } from '@/components/core'

type Props = {
  title?: string
  balance?: number
  disabled?: boolean
  postfix?: string
  onChange?: (value: string) => void
  value?: string
}

export function RedeemAmountBlock({
  title,
  balance,
  disabled = false,
  postfix,
  value,
  onChange,
}: Props) {
  const { setOpen, setContent } = usePopupStore()

  return (
    <div className="p-3 pt-2 mt-4 bg-dark-grey rounded-xl">
      {title ? <p className="mt-2 font-bold">{title}</p> : null}
      <div className="flex items-center justify-between mt-2">
        <FloatInput
          onChange={(value) => onChange?.(value)}
          borderless
          transparent
          disabled={disabled}
          value={value}
          placeholder="0.00"
          className="w-full -my-2 -ml-4 text-xl font-semibold text-left"
        />
        {balance ? (
          <span className="inline-block mt-0.5 align-top text-darker-grey text-2xs">
            Balance: {balance}
          </span>
        ) : null}
        <span className="inline-block mt-0.5 align-top text-darker-grey text-2xs">
          {postfix ? postfix : ''}
        </span>
      </div>
    </div>
  )
}
