import { getTokenInfo, isAddress } from '@/utils'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Token } from '@uniswap/sdk-core'
import { useTokenStore } from '@/store'
import { useWeb3React } from '@web3-react/core'
import { useCommonToken } from './use-common-token'

type SearchTokenInfo = {
  name: string
  address: string
  decimals: number
  symbol: string
}

export const useSearchToken = (address?: string, saveToken = true) => {
  const { provider, account } = useWeb3React()
  const [tokenInfo, setTokenInfo] = useState<Token>()
  const addToken = useTokenStore((state) => state.addToken)

  const getToken = useCallback(async () => {
    try {
      const newToken =
        address && (await getTokenInfo(address, provider, account))
      if (newToken) {
        saveToken && addToken(newToken)
        setTokenInfo(newToken)
      }
    } catch (error) {
      console.error('get Token info failed ', error)
    }
  }, [account, addToken, address, provider, saveToken])

  useEffect(() => {
    if (!isAddress(address)) {
      console.error(`Invalid address ${address}`)
    } else getToken()
  }, [address, getToken])

  return useMemo(() => tokenInfo, [tokenInfo])
}
