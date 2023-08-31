import { Input } from '@/components/core'
import { PoolTable } from '@/components/core/pool-table'
import { ROUTER } from '@/constants'
import { useGetAccountPairs } from '@/hooks'
import { PoolData } from '@/types/state'
import { isEmpty } from 'lodash'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { IoIosAddCircle } from 'react-icons/io'
import { IoSearch } from 'react-icons/io5'

export const PoolsPage = () => {
  const [allPools, accountPools, poolsLoading] = useGetAccountPairs()
  const [searchInput, setSearchInput] = useState<string>()
  const [firstLoading, setFirstLoading] = useState(true)
  const displayPools: PoolData[] = accountPools.map((pool) => ({
    pool: [
      {
        token: pool.token0,
        balance: pool.balance0,
      },
      {
        token: pool.token1,
        balance: pool.balance1,
      },
    ],
    description: 'Volatile Pool',
    apr: '-',
  }))

  const allDisplayPools: PoolData[] = useMemo(
    () =>
      allPools
        .map(
          (pool) =>
            [pool.token0.symbol, pool.token1.symbol].find((symbol) =>
              symbol
                ?.toLocaleLowerCase()
                ?.includes(searchInput?.toLocaleLowerCase() || '')
            ) && {
              pool: [
                {
                  token: pool.token0,
                  balance: pool.balance0,
                },
                {
                  token: pool.token1,
                  balance: pool.balance1,
                },
              ],
              description: 'Volatile Pool',
              apr: '-',
            }
        )

        .filter((pool) => pool) as PoolData[],
    [allPools, searchInput]
  )

  useEffect(() => {
    if (!isEmpty(allPools)) setFirstLoading(false)
  }, [allPools])

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-primary">Your LP</h2>
          <p className="text-lg text-darker-grey">
            Pair your token to provide liquidity
          </p>
        </div>
        <Link href={ROUTER.CREATE_POOL}>
          <button className="flex items-center gap-4 px-6 py-1 border rounded-xl text-primary border-primary">
            <IoIosAddCircle className="text-2xl" />
            Add Liquidity
          </button>
        </Link>
      </div>
      <PoolTable
        loading={poolsLoading && firstLoading}
        actions={['deposit', 'remove']}
        data={displayPools}
        isAccountPoolTable
      />
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="mt-20 text-3xl font-extrabold text-primary">
            Liquidity Pool
          </h2>
          <p className="text-lg text-darker-grey">
            Pair your token to provide liquidity
          </p>
        </div>
        <div className="flex items-center px-2 border border-white rounded-xl overflow-hidden">
          <IoSearch className="-mr-4 text-2xl" />
          <Input
            onChange={(e) => setSearchInput(e.target.value)}
            transparent
            placeholder="Search"
            borderless
          />
        </div>
      </div>
      <PoolTable
        actions={['add']}
        data={allDisplayPools}
        loading={poolsLoading && firstLoading}
      />
    </div>
  )
}
