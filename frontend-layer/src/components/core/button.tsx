import classNames from 'classnames'
import { omit } from 'lodash'
import { Spin } from './spin'

interface ButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'primary' | 'default' | 'transparent' | 'danger'
  disabled?: boolean
  loading?: boolean
}

export const Button = (props: ButtonProps) => {
  const { type = 'default', disabled, loading, onClick } = props || {}

  return (
    <div
      {...omit(props, [
        'buttonType',
        'disabled',
        'loading',
        'className',
        'onClick',
      ])}
      className={classNames([
        'whitespace-nowrap',
        {
          'px-5 py-2 rounded-lg border border-primary flex items-center gap-2.5 text-primary font-bold text-sm cursor-pointer':
            type === 'transparent',
          'px-[41px] py-[13px] text-white text-sm font-bold rounded-lg inline-flex items-center justify-center':
            type !== 'transparent',
          'bg-gradient rounded-xl ': type === 'primary',
          'bg-danger rounded-xl ': type === 'danger',
          'bg-default': type === 'default',
          'bg-disabled cursor-not-allowed opacity-70 hover:brightness-100':
            (disabled || loading) && type !== 'transparent',
          'hover:brightness-110 cursor-pointer': !(disabled || loading),
        },
        props.className,
      ])}
      onClick={(e) => !disabled && onClick?.(e)}
    >
      <div className="flex flex-row items-center justify-center w-full">
        {loading && (
          <Spin
            className={classNames([
              { 'text-gradient': ['transparent'].includes(type) },
            ])}
          />
        )}
        {props.children}
      </div>
    </div>
  )
}
