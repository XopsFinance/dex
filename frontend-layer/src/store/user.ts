import { NetworkType } from '@/constants'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UserStoreType = {
  isConnected: boolean
  setIsConnected: (isConnected: boolean) => void
  address?: string
  setAddress: (userAddress?: string) => void
  network: NetworkType
  setNetwork: (network: NetworkType) => void
}

export const useUserStore = create(
  persist<UserStoreType>(
    (set, get) => ({
      isConnected: false,
      setIsConnected: () =>
        set({
          isConnected: true,
        }),
      address: undefined,
      setAddress: (userAddress) =>
        set({
          address: userAddress,
        }),
      network: 'OpBnbMainnet',
      setNetwork: (network: NetworkType) => set({ network }),
    }),
    {
      name: 'user-store',
    }
  )
)
