import {
  FACTORY_ABI,
  FactoryAddress,
  NetworkConfig,
  NetworkType,
} from '@/constants'
import { useContract } from './use-contract'
import { useMemo } from 'react'
import { useUserStore } from '@/store'

export const useContractFactory = () => {
  const network = useUserStore((state) => state.network)
  const routerContract = useContract(
    FactoryAddress[NetworkConfig[network]?.chainId],
    FACTORY_ABI as any
  )

  return useMemo(() => routerContract, [routerContract])
}
