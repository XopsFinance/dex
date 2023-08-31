import { NativeCurrency, Token } from '@uniswap/sdk-core'
import { usePairAddress } from './use-pair-address'
import { useContract } from './use-contract'
import { PAIR_ABI } from '@/constants'
import { useCallback, useMemo } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { fromWei, isAddress } from '@/utils'
import moment, { Moment } from 'moment'
import { useQuery } from 'react-query'

type PairInfo = {
  address: string
  pairInfo: {
    balance?: number
    token0: string
    token1: string
    amount0: number
    amount1: number
    timestamp: Moment
  }
  totalSupply: number
  decimals: number
  symbol: string
  name: string
}

export const usePairInfo = (
  tokenA?: Token | NativeCurrency,
  tokenB?: Token | NativeCurrency,
  account?: string // get pair info of a specific account
) => {
  const pairAddress = usePairAddress(tokenA, tokenB)
  const pairContract = useContract(pairAddress, PAIR_ABI)

  const getPairInfo = useCallback(async () => {
    if (!tokenA || !tokenB) return
    const [pairInfo, token0, token1, totalSupply, decimals, symbol, name] = (
      await Promise.allSettled([
        pairContract?.getReserves(),
        pairContract?.token0(),
        pairContract?.token1(),
        pairContract?.totalSupply(),
        pairContract?.decimals(),
        pairContract?.symbol(),
        pairContract?.name(),
      ])
    ).map((item) => (item as any).value)

    if (!pairInfo) {
      return undefined
    }

    const wrappedA = tokenA?.isNative ? tokenA.wrapped : tokenA
    const wrappedB = tokenB?.isNative ? tokenB.wrapped : tokenB

    const amount0raw = Number(
      fromWei(
        BigNumber.from(pairInfo[0]).toString(),
        token0 === wrappedA?.address ? tokenA?.decimals : tokenB?.decimals
      )
    )

    const amount1raw = Number(
      fromWei(
        BigNumber.from(pairInfo[1]).toString(),
        token1 === wrappedB?.address ? tokenB?.decimals : tokenA?.decimals
      )
    )

    let amount0 = token0 === wrappedA?.address ? amount0raw : amount1raw,
      amount1 = token1 === wrappedB?.address ? amount1raw : amount0raw,
      accountAmount
    if (account && isAddress(account)) {
      accountAmount = await pairContract?.balanceOf(account)

      const percentage =
        Number(fromWei(BigNumber.from(accountAmount).toString())) /
        Number(fromWei(BigNumber.from(totalSupply).toString()))

      amount0 *= percentage
      amount1 *= percentage
    }
    return {
      address: pairAddress as string,
      pairInfo: {
        balance: accountAmount
          ? Number(fromWei(BigNumber.from(accountAmount).toString()))
          : undefined,
        token0,
        token1,
        amount0,
        amount1,
        timestamp: moment.unix(pairInfo[2]),
      },
      totalSupply: Number(fromWei(BigNumber.from(totalSupply).toString())),
      decimals,
      symbol,
      name,
    }
  }, [account, pairAddress, pairContract, tokenA, tokenB])

  const { data: pairInfo } = useQuery(
    ['pair-info', pairAddress, tokenA?.symbol, tokenB?.symbol, account],
    getPairInfo,
    {
      refetchInterval: tokenA && tokenB && pairAddress ? 5000 : false,
    }
  )

  return useMemo(() => pairInfo, [pairInfo])
}
