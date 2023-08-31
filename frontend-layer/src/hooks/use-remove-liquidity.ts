import { useCallback, useMemo, useState } from 'react'
import { Token } from '@uniswap/sdk-core'
import moment from 'moment'
import { useWeb3React } from '@web3-react/core'
import { useContractRouter } from './use-contract-router'
import { calculateGasMargin, toWei } from '@/utils'
import { DEFAULT_GAS_LIMIT } from '@/constants'

export const useRemoveLiquidity = ({
  tokenA,
  tokenB,
  amountA,
  amountB,
  liquidity,
}: {
  tokenA?: Token
  tokenB?: Token
  amountA?: number
  amountB?: number
  liquidity?: number
}) => {
  const [data, setData] = useState<any>()
  const [loading, setLoading] = useState(false)
  const { account } = useWeb3React()
  const router = useContractRouter()

  const deadline = useMemo(() => moment().add('20', 'minute').unix(), [])
  const amountAMin = useMemo(
    () => (!amountA ? null : toWei(amountA * 0.95, tokenA?.decimals)),
    [amountA, tokenA?.decimals]
  )
  const amountBMin = useMemo(
    () => (!amountB ? null : toWei(amountB * 0.95, tokenB?.decimals)),
    [amountB, tokenB?.decimals]
  )

  const onRemove = useCallback(async () => {
    if (
      [router, account, amountAMin, amountBMin, deadline, tokenA, tokenB].some(
        (item) => !item
      )
    )
      return

    setLoading(true)
    const params = [
      tokenA?.address,
      tokenB?.address,
      toWei(liquidity),
      amountAMin,
      amountBMin,
      account,
      deadline,
    ]

    let estimatedGas

    try {
      estimatedGas = await router?.estimateGas.removeLiquidity(...params)
    } catch (err) {
      console.log('err :>> ', err)
    }

    const res = await router?.removeLiquidity(...params, {
      gasLimit: estimatedGas
        ? calculateGasMargin(estimatedGas)
        : DEFAULT_GAS_LIMIT,
    })
    setData(res)
    setLoading(false)

    return res
  }, [
    account,
    amountAMin,
    amountBMin,
    deadline,
    liquidity,
    router,
    tokenA,
    tokenB,
  ])

  return useMemo<[() => Promise<any>, { data: any; loading: boolean }]>(
    () => [onRemove, { data, loading }],
    [data, loading, onRemove]
  )
}
