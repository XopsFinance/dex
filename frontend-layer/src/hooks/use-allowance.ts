import { useCallback, useMemo, useState } from 'react'
import { useContract } from './use-contract'
import { BigNumber } from '@ethersproject/bignumber'
import { useWeb3React } from '@web3-react/core'
import { NativeCurrency, Token } from '@uniswap/sdk-core'
import { fromWei } from '@/utils'

export const useAllowance: (
  token?: Token | NativeCurrency,
  spender?: string
) => [
  () => Promise<null | any>,
  { loading: boolean; data: number | undefined }
] = (token, spender) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<number>()
  const { account } = useWeb3React()
  const tokenContract = useContract((token as Token)?.address)

  const allowance = useCallback(async () => {
    setLoading(true)
    try {
      if (token?.isNative) {
        setData(Infinity)
        return
      }

      const errorLog = (type: string | Error) => {
        console.error('useAllowance error: ', type)

        return [allowance, { loading: false, data }]
      }

      if (!token) errorLog('no token')
      else if (!spender) errorLog('no spender')
      else if (!tokenContract) errorLog('no token contract')
      else if (!account) errorLog('no account contract')

      try {
        const res = await tokenContract?.allowance(account, spender)
        const formattedRes = Number(
          fromWei(BigNumber.from(res).toString(), token?.decimals)
        )

        setData(formattedRes)

        setLoading(false)
        return formattedRes
      } catch (error) {
        setData(undefined)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
    }
  }, [account, data, spender, token, tokenContract])

  return useMemo(() => {
    return [allowance, { loading, data }]
  }, [allowance, data, loading])
}
