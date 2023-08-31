import { NativeCurrency, Token } from '@uniswap/sdk-core'
import { useContract } from './use-contract'
import { usePairAddress } from './use-pair-address'
import { PAIR_ABI } from '@/constants'
import { useMemo } from 'react'

export const usePairContract = (
  tokenA?: Token | NativeCurrency,
  tokenB?: Token | NativeCurrency
) => {
  const pairAddress = usePairAddress(tokenA, tokenB)
  const contract = useContract(pairAddress, PAIR_ABI)
  return useMemo(() => contract, [contract])
}
