import { HiOutlineChevronDown } from 'react-icons/hi'

type Props = {
  handleClick?: () => void
  title?: string
}

export default function SelectButton({ handleClick, title }: Props) {
  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-white rounded-full bg-very-dark-blue pl-4 min-w-[100px] justify-between"
    >
      {/* <Image src="/icon.svg" height={14} width={14} alt="coin name" /> */}
      {title || 'Select'} <HiOutlineChevronDown className="ml-1 text-xl" />
    </button>
  )
}
