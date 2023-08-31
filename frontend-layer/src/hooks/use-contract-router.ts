import {
  NetworkConfig,
  NetworkType,
  ROUTER_ABI,
  RouterAddress,
} from '@/constants'
import { useContract } from './use-contract'
import { useMemo } from 'react'
import { useUserStore } from '@/store'

export const useContractRouter = () => {
  const network = useUserStore((state) => state.network)
  const routerContract = useContract(
    RouterAddress[NetworkConfig[network]?.chainId],
    ROUTER_ABI as any
  )

  return useMemo(() => routerContract, [routerContract])
}
