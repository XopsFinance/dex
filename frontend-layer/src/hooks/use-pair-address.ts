import { NativeCurrency, Token } from '@uniswap/sdk-core'
import { useCallback, useMemo } from 'react'
import { useContractFactory } from './use-contract-factory'
import { useQuery } from 'react-query'

export const usePairAddress = (
  tokenA?: Token | NativeCurrency,
  tokenB?: Token | NativeCurrency
) => {
  const factory = useContractFactory()

  const getAddress = useCallback(async () => {
    if (!tokenA || !tokenB || tokenA === tokenB) return undefined

    const wrappedA = tokenA?.isNative ? tokenA.wrapped : tokenA
    const wrappedB = tokenB?.isNative ? tokenB.wrapped : tokenB

    try {
      const address = await factory?.getPair(wrappedA.address, wrappedB.address)

      return address
    } catch (error) {}
  }, [factory, tokenA, tokenB])

  const { data: address } = useQuery([tokenA, tokenB], getAddress)

  return useMemo(() => address, [address])
}
