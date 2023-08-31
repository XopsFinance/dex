import { Button, TokenIcon } from '@/components/core'
import { NativeCurrency, Token } from '@uniswap/sdk-core'
import { usePairInfo, useTokenRate } from '@/hooks'

type ConfirmPopupProps = {
  tokenA?: Token | NativeCurrency
  tokenB?: Token | NativeCurrency
  amountA?: number
  amountB?: number
  onConfirm?: () => void
  confirmLoading?: boolean
}

export const ConfirmPopup = (props: ConfirmPopupProps) => {
  const { tokenA, tokenB, amountA, amountB, onConfirm, confirmLoading } = props

  const pool = usePairInfo(tokenA, tokenB)
  const { amount0 } = pool?.pairInfo || {}
  const percentage = amountA && amount0 && (amountA / (amount0 + amountA)) * 100
  const amountWillReceive =
    pool?.totalSupply &&
    percentage &&
    (percentage * pool.totalSupply) / (100 - percentage)
  const [APerB, BPerA] = useTokenRate(amountA, amountB)

  return (
    <div className="w-full p-4">
      <div className="text-sm text-center font-semibold">You will receive</div>
      <div className="flex flex-row gap-2 mt-4 items-center justify-center">
        <div className="text-3xl font-medium">
          {amountWillReceive?.toFixed(14)}
        </div>
        <TokenIcon token={tokenA} />
        <TokenIcon className="-ml-[20px]" token={tokenB} />
      </div>
      <div className={'mt-3 text-lg'}>
        {tokenA?.symbol}/{tokenB?.symbol} Pool Tokens
      </div>

      <div className={'mt-8 italic text-xs'}>
        Output is estimated. If the price changes by more than 0.5% your
        transaction will revert.
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-4 items-center justify-between">
          <div>{tokenA?.symbol} Deposited</div>
          <div className="flex flex-row gap-2">
            <TokenIcon size={24} token={tokenA} /> {amountA}
          </div>
        </div>

        <div className="flex flex-row gap-4 items-center justify-between">
          <div>{tokenB?.symbol} Deposited</div>
          <div className="flex flex-row gap-2">
            <TokenIcon size={24} token={tokenB} /> {amountB}
          </div>
        </div>

        <div className="flex flex-row gap-4 items-start justify-between">
          <div>Rates</div>
          <div className="text-end">
            <div>
              1 {tokenA?.symbol} = {BPerA} {tokenB?.symbol}
            </div>
            <div>
              1 {tokenB?.symbol} = {APerB} {tokenA?.symbol}
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4 items-center justify-between">
          <div>Share of Pool</div>
          <div>{percentage || 100}%</div>
        </div>
      </div>

      <Button
        loading={confirmLoading}
        className="mt-6 w-full"
        type="primary"
        onClick={onConfirm}
      >
        Confirm {pool ? 'Supply' : 'Add'}
      </Button>
    </div>
  )
}
