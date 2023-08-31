import { SlClose } from 'react-icons/sl'

type Props = {
  transaction?: string
  title: string
  description?: string
}

export function PopupReject({ transaction, title, description }: Props) {
  return (
    <div className="px-20 py-9">
      <SlClose className="mx-auto text-6xl text-primary" />
      <div className="mt-6 text-center">
        <p className="font-extrabold">{title}</p>
        {transaction && (
          <p className="text-xs text-darker-grey">Transaction Hash</p>
        )}
        {transaction && <p className="text-sm text-primary">{transaction}</p>}
      </div>
      <p>{description?.toString()}</p>
    </div>
  )
}
