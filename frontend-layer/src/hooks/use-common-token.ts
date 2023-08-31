import { COMMON_BASES, SupportedChainId } from '@/constants'
import { useTokenStore, useUserStore } from '@/store'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'

export const useCommonToken = () => {
  const { chainId } = useWeb3React()
  const storedTokens = useTokenStore((state) => state.tokens)
  const network = useUserStore((state) => state.network)
  return useMemo(() => {
    return chainId
      ? [
          ...(COMMON_BASES[chainId] || []),
          ...storedTokens.filter(
            (token) => token.chainId === SupportedChainId[network]
          ),
        ]
      : []
  }, [chainId, network, storedTokens])
}
