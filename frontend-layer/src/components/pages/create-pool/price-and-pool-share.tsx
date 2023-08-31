import { NativeCurrency, Token } from '@uniswap/sdk-core'
import { usePairInfo, useTokenRate } from '@/hooks'
import classNames from 'classnames'

type PriceAndPoolShareProps = {
  tokenA?: Token | NativeCurrency
  tokenB?: Token | NativeCurrency
  amountA?: number
  amountB?: number
  className?: string
}

type InfoProps = {
  title: string
  description: string
}

const Info = (props: InfoProps) => {
  return (
    <div className="text-center">
      <div className="font-bold">{props.title}</div>
      <div className="text-secondary font-medium text-sm">
        {props.description}
      </div>
    </div>
  )
}
export const PriceAndPoolShare = (props: PriceAndPoolShareProps) => {
  const { tokenA, tokenB, amountA, amountB, className } = props

  const [APerB, BPerA] = useTokenRate(amountA, amountB)
  const pool = usePairInfo(tokenA, tokenB)

  if (!tokenA || !tokenB || !amountA || !amountB) {
    return <></>
  }

  const { amount0 } = pool?.pairInfo || {}
  const percentage = amount0 && (amountA / (amount0 + amountA)) * 100

  return (
    <div className={classNames('px-3 py-2 bg-dark-grey rounded-xl', className)}>
      <div className="font-bold text-sm">Prices and pool share</div>
      <div className="flex flex-row flex-wrap gap-4 items-center justify-around mt-4">
        <Info
          title={BPerA}
          description={tokenB?.symbol + ' per ' + tokenA?.symbol}
        />
        <Info
          title={APerB}
          description={tokenA?.symbol + ' per ' + tokenB?.symbol}
        />
        <Info
          title={`${
            percentage
              ? percentage < 0.01
                ? '<0.01'
                : percentage?.toLocaleString()
              : '100'
          }%`}
          description={'Share of Pool'}
        />
      </div>
    </div>
  )
}
