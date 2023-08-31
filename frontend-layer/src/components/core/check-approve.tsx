import classNames from 'classnames'
import { IoReload } from 'react-icons/io5'

type CheckApproveProps = {
  className?: string
  onClick?: () => void
}

export const CheckApprove = (props: CheckApproveProps) => {
  const { onClick, className } = props
  return (
    <div
      className={classNames(
        'text-xs text-primary mt-2 flex flex-row gap-2 items-center justify-end cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      Check approval
      <IoReload />
    </div>
  )
}
