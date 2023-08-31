import { NativeCurrency, Token } from '@uniswap/sdk-core'
import classNames from 'classnames'

type TokenIconProps = {
  token?: Token | NativeCurrency
  size?: number
  className?: string
}

export const TokenIcon = (props: TokenIconProps) => {
  const { token, size = 32, className } = props
  return (
    <div
      className={classNames(
        'rounded-full bg-dark-navy flex items-center justify-center font-normal border border-dark-blue uppercase',
        className
      )}
      style={{
        fontSize: size * 0.34,
        minWidth: size,
        height: size,
      }}
    >
      {token?.symbol?.slice(0, 3)}
    </div>
  )
}
