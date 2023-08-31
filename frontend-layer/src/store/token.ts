import { Token } from '@uniswap/sdk-core'
import { uniqBy } from 'lodash'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type TokenStoreType = {
  tokens: Token[]
  addToken: (token: Token) => void
}

export const useTokenStore = create(
  persist<TokenStoreType>(
    (set, get) => ({
      tokens: [],
      addToken: (token) =>
        set((state) => ({
          tokens: uniqBy([...state.tokens, token], 'address'),
        })),
    }),
    {
      name: 'token-store',
    }
  )
)
