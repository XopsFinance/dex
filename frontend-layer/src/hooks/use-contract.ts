import { getContract } from '@/utils'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { Contract } from '@ethersproject/contracts'
import { DEFAULT_ABI } from '@/constants'

export function useContract<T extends Contract = Contract>(
  addressOrAddressMap?: string | { [chainId: number]: string },
  ABI: any = DEFAULT_ABI,
  withSignerIfPossible = true
): T | null {
  const { provider, account, chainId } = useWeb3React()

  return useMemo(() => {
    if (!addressOrAddressMap || !ABI || !provider || !chainId) return null
    let address: string | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract(
        address,
        ABI,
        provider,
        withSignerIfPossible && account ? account : undefined
      )
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [
    addressOrAddressMap,
    ABI,
    provider,
    chainId,
    withSignerIfPossible,
    account,
  ]) as T
}
