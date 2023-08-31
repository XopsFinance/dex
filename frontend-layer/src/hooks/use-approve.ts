import { TransactionResponse } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { useCallback, useState } from 'react'
import { useContract } from './use-contract'
import { BigNumber } from '@ethersproject/bignumber'
import { DEFAULT_GAS_LIMIT, MaxUInt256 } from '@/constants'
import { MaxUint256, NativeCurrency, Token } from '@uniswap/sdk-core'
import { toWei } from '@/utils'

export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(120).div(100)
}

export function useApproval(
  token?: Token | NativeCurrency,
  amountToApprove?: number,
  spender?: string
): [
  () => Promise<
    | {
        response: TransactionResponse
        tokenAddress: string
        spenderAddress: string
      }
    | undefined
  >,
  { loading: boolean; data: any }
] {
  const { chainId } = useWeb3React()
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)

  const tokenContract = useContract((token as Token)?.address)

  const approve = useCallback(async () => {
    setLoading(true)

    function logFailure(error: Error | string): undefined {
      console.warn(`${'Token'} approval failed:`, error)
      return
    }

    // Bail early if there is an issue.
    if (!chainId) {
      return logFailure('no chainId')
    } else if (!token) {
      return logFailure('no token')
    } else if (!tokenContract) {
      return logFailure('tokenContract is null')
    } else if (!spender) {
      return logFailure('no spender')
    }

    if (token.isNative)
      return {
        response: Infinity,
        tokenAddress: token.wrapped.address,
        spenderAddress: spender,
      }

    const params = [
      spender,
      toWei(amountToApprove, token.decimals) || MaxUint256.toString(),
    ]

    const estimatedGas = await tokenContract.estimateGas
      .approve(...params)
      .catch(() => {
        // general fallback for tokens which restrict approval amounts
        return tokenContract.estimateGas.approve(...params, {
          gasLimit: DEFAULT_GAS_LIMIT,
        })
      })

    const res = await tokenContract
      .approve(...params, {
        gasLimit: calculateGasMargin(estimatedGas) || DEFAULT_GAS_LIMIT,
      })
      .then((response: any) => {
        setLoading(false)
        return {
          response,
          tokenAddress: (token as Token).address,
          spenderAddress: spender,
        }
      })
      .catch((error: Error) => {
        setLoading(false)
        logFailure(error)
        throw error
      })

    setData(res)
    return res
  }, [chainId, token, tokenContract, spender, amountToApprove])

  return [approve, { data, loading }]
}
