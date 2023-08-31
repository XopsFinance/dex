import { fromWei } from '@/utils'
import { BigNumber } from '@ethersproject/bignumber'
import { NativeCurrency, Token } from '@uniswap/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { useCallback, useMemo } from 'react'
import { useContract } from './use-contract'
import { useQuery } from 'react-query'

export const useGetBalance = (token: Token | NativeCurrency | undefined) => {
  const { provider, account } = useWeb3React()
  const contract = useContract((token as Token)?.address)

  const getBalance = useCallback(async () => {
    if (!account || !token) return undefined

    if (token?.isNative) {
      const res = await provider?.getBalance(account)

      return res ? Number(fromWei(BigNumber.from(res).toString())) : undefined
    } else {
      const res = await contract?.balanceOf?.(account)

      return Number(fromWei(BigNumber.from(res).toString(), token?.decimals))
    }
  }, [account, contract, provider, token])

  const { data: balance, isLoading: loading } = useQuery(
    [account, contract?.address, token?.symbol],
    getBalance,
    {
      refetchInterval: account && contract?.address ? 10000 : false,
    }
  )

  return useMemo(() => balance, [balance])
}
