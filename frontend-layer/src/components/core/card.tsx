import classNames from 'classnames'

type CardProps = {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

export const Card = (props: CardProps) => {
  const { className, onClick } = props || {}
  return (
    <div
      onClick={onClick}
      className={classNames([
        'px-[24px] py-[40px] rounded-lg shadow-[6px_4px_6px_3px_rgba(0,0,0,0.15)] bg-dark-blue',
        {
          'cursor-pointer hover:border hover:border-primary border border-dark-blue':
            onClick,
          [`${className}`]: className,
        },
      ])}
    >
      {props.children}
    </div>
  )
}
