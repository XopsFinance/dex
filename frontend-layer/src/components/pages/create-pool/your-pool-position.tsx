import { TokenIcon } from '@/components/core'
import { usePairContract, usePairInfo } from '@/hooks'
import { fromWei } from '@/utils'
import { BigNumber } from '@ethersproject/bignumber'
import { NativeCurrency, Token } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import classNames from 'classnames'
import { useCallback } from 'react'
import { useQuery } from 'react-query'

type YourPoolPositionProps = {
  tokenA?: Token | NativeCurrency
  tokenB?: Token | NativeCurrency
  className?: string
}

export const YourPoolPosition = (props: YourPoolPositionProps) => {
  const { tokenA, tokenB, className } = props
  const { account } = useWeb3React()
  const poolContract = usePairContract(tokenA, tokenB)
  const poolInfo = usePairInfo(tokenA, tokenB)

  const getAccountPoolBalance = useCallback(async () => {
    if (!account || !poolContract) return
    const res = await poolContract.balanceOf(account)

    return Number(fromWei(BigNumber.from(res).toString()))
  }, [account, poolContract])

  const { data: accountPoolBalance } = useQuery(
    [
      'account-pool-balance',
      account,
      tokenA?.symbol,
      tokenB?.symbol,
      poolContract?.address,
    ],
    getAccountPoolBalance,
    {
      refetchInterval: 5000,
    }
  )

  const poolShare =
    accountPoolBalance &&
    poolInfo &&
    (accountPoolBalance / poolInfo.totalSupply) * 100

  if (!tokenA || !tokenB || !poolInfo || !account) return <></>

  return (
    <div
      className={classNames(
        'max-w-md p-4 px-7 mx-auto bg-slate-500 rounded-xl flex flex-col gap-2',
        className
      )}
    >
      <div className="text-sm">Your position</div>
      <div className="mt-4 flex flex-row gap-4 items-center justify-between text-xl">
        <div className=" flex flex-row">
          <TokenIcon size={24} token={tokenA} />
          <TokenIcon size={24} token={tokenB} className="-ml-3" />
          {tokenA?.symbol}/{tokenB?.symbol}
        </div>
        <div>
          {accountPoolBalance && accountPoolBalance?.toFixed(8) < '0.00000001'
            ? '<0.00000001'
            : accountPoolBalance?.toFixed(8)}
        </div>
      </div>

      <div className="flex flex-row gap-4 items-center justify-between">
        <div>Your pool share:</div>
        <div>
          {poolShare &&
            (poolShare < 0.0000001 ? '<0.0000001' : poolShare.toFixed(6))}
          %
        </div>
      </div>

      <div className="flex flex-row gap-4 items-center justify-between">
        <div>{tokenA?.symbol}:</div>
        <div>
          {poolShare &&
            ((poolInfo?.pairInfo.amount0 * poolShare) / 100).toFixed(6)}
        </div>
      </div>

      <div className="flex flex-row gap-4 items-center justify-between">
        <div>{tokenB?.symbol}:</div>
        <div>
          {poolShare &&
            ((poolInfo?.pairInfo.amount1 * poolShare) / 100).toFixed(6)}
        </div>
      </div>
    </div>
  )
}
