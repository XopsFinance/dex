import { NativeCurrency, Token } from '@uniswap/sdk-core'
import { useCallback, useMemo, useState } from 'react'
import { useContractRouter } from './use-contract-router'
import { calculateGasMargin, toWei } from '@/utils'
import { useWeb3React } from '@web3-react/core'
import moment from 'moment'
import { BigNumber } from '@ethersproject/bignumber'
import { DEFAULT_GAS_LIMIT } from '@/constants'

export const useSwapTokens: (
  tokenA?: Token | NativeCurrency,
  tokenB?: Token | NativeCurrency,
  aValue?: number,
  bValue?: number,
  slippage?: number // 0 -> 100 (%)
) => [
  (() => Promise<any | null>) | null,
  {
    data: any | null
    loading: boolean
  }
] = (tokenA, tokenB, aValue, bValue, slippage = 10) => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const router = useContractRouter()
  const { account } = useWeb3React()

  const swap = useCallback(async () => {
    setLoading(true)

    let swapFunction,
      params,
      value,
      deadline = moment().add(20, 'minute').unix()
    const MinOutRate = (100 - slippage || 1) / 100
    if (tokenA?.isNative) {
      swapFunction = 'swapExactETHForTokens'
      value = toWei(aValue, tokenA?.decimals)
      params = [
        bValue && toWei(bValue * MinOutRate, tokenB?.decimals), // amountOutMin
        [
          (tokenA as NativeCurrency)?.wrapped.address,
          (tokenB as Token).address,
        ], // path
        account, // to,
        deadline,
      ]
    } else if (tokenB?.isNative) {
      swapFunction = 'swapExactTokensForETH'
      params = [
        aValue && toWei(aValue, tokenA?.decimals), // amountIn
        bValue && toWei(bValue * MinOutRate, tokenB?.decimals), // amountOutMin
        [(tokenA as Token).address, tokenB.wrapped.address], // path
        account, // to,
        deadline,
      ]
    } else {
      swapFunction = 'swapExactTokensForTokens'
      params = [
        aValue && toWei(aValue, tokenA?.decimals), // amountIn
        bValue && toWei(bValue * MinOutRate, tokenB?.decimals), // amountOutMin
        [(tokenA as Token).address, (tokenB as Token).address], // path
        account, // to,
        deadline,
      ]
    }

    if (!swapFunction) return null

    let data

    try {
      const estimatedGas = await router?.estimateGas[`${swapFunction}`]?.(
        ...params,
        value ? { value } : {}
      )

      data = await router?.[swapFunction](
        ...params,
        value
          ? {
              value,
              gasLimit: calculateGasMargin(estimatedGas as BigNumber),
            }
          : {
              gasLimit: calculateGasMargin(estimatedGas as BigNumber),
            }
      )
      setLoading(false)
      return data
    } catch (error) {
      data = await router?.[swapFunction]?.(
        ...params,
        value
          ? { value, gasLimit: DEFAULT_GAS_LIMIT }
          : { gasLimit: DEFAULT_GAS_LIMIT }
      )
      setLoading(false)

      return data
    }
  }, [aValue, account, bValue, router, slippage, tokenA, tokenB])

  return useMemo(() => {
    if (!tokenA || !tokenB || !aValue || !bValue || !account)
      return [
        null,
        {
          data: null,
          loading: false,
        },
      ]

    return [
      swap,
      {
        data,
        loading,
      },
    ]
  }, [tokenA, tokenB, aValue, bValue, account, swap, data, loading])
}
