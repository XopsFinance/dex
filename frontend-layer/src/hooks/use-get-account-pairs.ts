import { useCallback, useEffect, useMemo, useState } from 'react'
import { useContractFactory } from './use-contract-factory'
import { fromWei, getContract, getTokenInfo } from '@/utils'
import { PAIR_ABI } from '@/constants'
import { useWeb3React } from '@web3-react/core'
import { BigNumber } from '@ethersproject/bignumber'
import { Token } from '@uniswap/sdk-core'
import { uniqBy } from 'lodash'
import { useQuery } from 'react-query'

type AccountPair = {
  id: number
  token0: Token
  token1: Token
  balance0: number
  balance1: number
}
export const useGetAccountPairs = () => {
  const factoryContract = useContractFactory()
  const { provider, account } = useWeb3React()
  const [loading, setLoading] = useState(false)
  const [pairs, setPairs] = useState<AccountPair[]>([])
  const [allPairs, setAllPairs] = useState<AccountPair[]>([])

  const isPairCreatedByAddress = useCallback(
    async (pairAddress: string) => {
      if (!account || !provider) {
        setLoading(false)
        return false
      }
      const pairContract = getContract(pairAddress, PAIR_ABI, provider, account)
      const havingPosition: BigNumber = await pairContract.balanceOf(account)
      return !!Number(BigNumber.from(havingPosition).toString())
    },
    [account, provider]
  )

  const getTokenDecimals = useCallback(
    async (tokenAddress: string) => {
      const tokenContract = getContract(
        tokenAddress,
        undefined,
        provider,
        account
      )
      return await tokenContract.decimals()
    },
    [account, provider]
  )

  const listPoolsWithDetails = useCallback(async () => {
    if (!factoryContract) {
      setLoading(false)
      return
    }

    const pairCount = BigNumber.from(
      await factoryContract.allPairsLength()
    ).toNumber()

    if (!pairCount) {
      setLoading(false)
      return
    }

    const asyncGet = async (i: number) => {
      const pairAddress = await factoryContract.allPairs(i)
      // Check if the pair was created by the specific account address
      if (await isPairCreatedByAddress(pairAddress)) {
        const pairContract = getContract(
          pairAddress,
          PAIR_ABI,
          provider,
          account
        )

        const [token0Address, token1Address] = (
          await Promise.allSettled([
            pairContract.token0(),
            pairContract.token1(),
          ])
        ).map((item: any) => item.value)

        const [reserves, token0, token1] = (
          await Promise.allSettled([
            pairContract.getReserves(),
            getTokenInfo(token0Address, provider, account),
            getTokenInfo(token1Address, provider, account),
          ])
        ).map((item: any) => item.value)

        const decimals0 = token0 && (await getTokenDecimals(token0.address))
        const decimals1 = token1 && (await getTokenDecimals(token1.address))
        const balance0 = reserves[0] / 10 ** decimals0
        const balance1 = reserves[1] / 10 ** decimals1
        const newPair = { id: i, token0, token1, balance0, balance1 }

        const userBalance: BigNumber = await pairContract.balanceOf(account)
        const decUserBalance = fromWei(BigNumber.from(userBalance).toString())

        if (token0 && token1 && balance0 && balance1) {
          if (decUserBalance)
            setPairs((prev) => uniqBy([...prev, newPair], 'id'))

          setAllPairs((prev) => uniqBy([...prev, newPair], 'id'))
        }

        setLoading(false)
      }
    }

    for (let i = 0; i < pairCount; i++) {
      asyncGet(i)
    }
  }, [
    account,
    factoryContract,
    getTokenDecimals,
    isPairCreatedByAddress,
    provider,
  ])

  useQuery(
    [account, factoryContract?.address],
    async () => {
      setLoading(true)
      try {
        return await listPoolsWithDetails()
      } catch (error) {
        setLoading(false)
      }
    },
    {
      refetchInterval: 30000,
    }
  )

  return useMemo<[AccountPair[], AccountPair[], boolean]>(
    () => [allPairs, pairs, loading],
    [allPairs, loading, pairs]
  )
}
