import { NativeCurrency, Token } from '@uniswap/sdk-core'
import { TokenIcon } from '../token-icon'

type Item = {
  token?: Token | NativeCurrency
  value?: number
}

type Props = {
  title?: string
  items?: Item[]
}

export function RedeemOutput({ title, items }: Props) {
  return (
    <div className="p-3 pt-2 mt-4 border border-dark-grey rounded-xl">
      {title ? <p className="mt-2 font-bold">{title}</p> : null}
      {items && items.length > 0 ? (
        <div className={`font-bold mt-4 grid grid-rows-${items.length}`}>
          {items.map((item) => (
            <div key={item.token?.symbol}>
              <div className="flex flex-row gap-2 items-center justify-between">
                <p>
                  {item.value
                    ? item.value < 0.000001
                      ? '<0.000001'
                      : item.value?.toFixed(6)
                    : '0.00'}
                </p>
                <div className="flex flex-row gap-2 items-center">
                  <TokenIcon
                    token={item.token}
                    size={32}
                    className="inline-block"
                  />
                  {item.token?.symbol}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`mt-4 grid grid-cols-2 text-light-grey`}>
          <div>
            <p>--</p>
            <p>0.00</p>
          </div>
          <div>
            <p>--</p>
            <p>0.00</p>
          </div>
        </div>
      )}
    </div>
  )
}
