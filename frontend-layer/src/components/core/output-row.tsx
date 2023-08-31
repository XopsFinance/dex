type Props = {
  title: string
  amount: string
}

export function OutputRow({ title, amount }: Props) {
  return (
    <div className="flex justify-between mt-2 text-xs text-darker-grey border-dark-grey rounded-xl">
      {title}
      <span className="inline-block ml-2 font-semibold text-white">
        {amount}
      </span>
    </div>
  )
}
