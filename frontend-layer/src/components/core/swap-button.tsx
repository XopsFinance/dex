import { IoSwapVerticalOutline } from 'react-icons/io5'

type Props = React.HTMLAttributes<HTMLDivElement>

export function SwapButton(props: Props) {
  return (
    <div className="py-3 text-center" {...props}>
      <button className="text-2xl">
        <IoSwapVerticalOutline />
      </button>
    </div>
  )
}
