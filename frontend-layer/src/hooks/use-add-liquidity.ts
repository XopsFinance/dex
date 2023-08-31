import { useCallback, useEffect, useMemo, useState } from 'react'
import { useContractRouter } from './use-contract-router'
import { calculateGasMargin, toWei } from '@/utils'
import moment from 'moment'
import { useWeb3React } from '@web3-react/core'
import { Token, NativeCurrency } from '@uniswap/sdk-core'
import { BigNumber } from '@ethersproject/bignumber'

export const useAddLiquidity: (
  token0?: Token | NativeCurrency,
  token1?: Token | NativeCurrency,
  amount0?: number,
  amount1?: number
) => [
  () => Promise<null | any>,
  { loading: boolean; data: number | undefined; addable: boolean }
] = (token0, token1, amount0, amount1) => {
  const nativeToken = useMemo(
    () => (token0?.isNative ? token0 : token1?.isNative ? token1 : null),
    [token0, token1]
  )

  const [loading, setLoading] = useState<boolean>(false)
  const [addable, setAddable] = useState(false)
  const [data, setData] = useState()
  const { account } = useWeb3React()
  const router = useContractRouter()

  const errorLog = useCallback((type: Error | string) => {
    console.error('useAddLiquidity error: ', type)
    return false
  }, [])

  const checkAddable = useCallback(() => {
    if (!token0) return errorLog('no token0')
    else if (!token1) return errorLog('no token1')
    else if (!account) return errorLog('no account')
    else if (!amount0) return errorLog('no amount0')
    else if (!amount1) return errorLog('no amount1')

    return true
  }, [token0, errorLog, token1, account, amount0, amount1])

  const addPoolLiquidity = useCallback(async () => {
    if (!addable) return [async () => null, { loading, data, addable }]

    setLoading(true)
    try {
      let params, addLiquidity, estimateGas, nativeAmount, value
      const to = account,
        deadline = moment().add('20', 'minute').unix()
      if (nativeToken) {
        const token = token0?.isNative ? token1 : token0
        const checkedToken = token as Token
        const tokenAmount = token0?.isNative ? amount1 : amount0
        nativeAmount = token0?.isNative ? amount0 : amount1
        const amountTokenMin = toWei(
          ((tokenAmount as number) * 0.995).toFixed(6),
          checkedToken.decimals
        )

        value = toWei(nativeAmount)
        addLiquidity = router?.addLiquidityETH
        params = {
          token: checkedToken.address,
          amountTokenDesired: toWei(tokenAmount, checkedToken.decimals),
          amountTokenMin,
          amountETHMin: toWei((nativeAmount as number) * 0.995),
          to,
          deadline,
        }
        try {
          estimateGas = await router?.estimateGas.addLiquidityETH(
            ...Object.values(params),
            {
              ...(nativeAmount ? { value } : {}),
            }
          )
        } catch (error) {}
      } else {
        const checked0 = token0 as Token
        const checked1 = token1 as Token
        addLiquidity = router?.addLiquidity
        params = {
          tokenA: checked0.address,
          tokenB: checked1.address,
          amountADesired: toWei(amount0, checked0.decimals),
          amountBDesired: toWei(amount1, checked1.decimals),
          amountAMin: toWei(
            ((amount0 as number) * 0.995).toFixed(6),
            checked0.decimals
          ),
          amountBMin: toWei(
            ((amount1 as number) * 0.995).toFixed(6),
            checked1.decimals
          ),
          to,
          deadline,
        }

        try {
          estimateGas = await router?.estimateGas.addLiquidity(
            ...Object.values(params)
          )
        } catch (error) {}
      }

      let res
      if (!estimateGas) {
        res = await addLiquidity(...Object.values(params), {
          ...(nativeAmount ? { value } : {}),
        })
      } else {
        res = await addLiquidity(...Object.values(params), {
          ...(nativeAmount ? { value } : {}),
          gasLimit: calculateGasMargin(estimateGas as BigNumber),
        })
      }

      setData(res)
      setLoading(false)
      return res
    } catch (error) {
      setLoading(false)
      throw error
    }
  }, [
    account,
    addable,
    amount0,
    amount1,
    data,
    loading,
    nativeToken,
    router,
    token0,
    token1,
  ])

  useEffect(() => {
    setAddable(checkAddable())
  }, [checkAddable])

  return useMemo(() => {
    return [addPoolLiquidity, { loading, data, addable }]
  }, [addPoolLiquidity, addable, data, loading])
}
