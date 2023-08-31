import { Input } from '@/components/core'
import { PoolTable } from '@/components/core/pool-table'
import { PoolData } from '@/types/state'
import { IoSearch } from 'react-icons/io5'

// const poolData: PoolData[] = [
//   {
//     pool: [
//       {
//         img: '/assets/images/oken1.png',
//         name: 'ETH',
//         poolShare: 1252250000,
//       },
//       {
//         img: '/assets/images/token2.png',
//         name: 'USDC',
//         poolShare: 2250000,
//       },
//     ],
//     description: 'Volatile Pool',
//     apr: 725.25,
//   },
//   {
//     pool: [
//       {
//         img: '/assets/images/token1.png',
//         name: 'ETH',
//         poolShare: 1252250000,
//       },
//       {
//         img: '/assets/images/token2.png',
//         name: 'USDC',
//         poolShare: 2250000,
//       },
//     ],
//     description: 'Volatile Pool',
//     apr: 525.25,
//   },
// ]

export const EarnPage = () => {
  return (
    <div>
      <div className="flex items-end justify-between">
        <div>
          <h2 className="mt-20 text-3xl font-extrabold text-primary">Farm</h2>
        </div>
        <div className="flex items-center px-2 border border-white rounded-xl">
          <IoSearch className="-mr-4 text-2xl" />
          <Input transparent placeholder="Search" borderless />
        </div>
      </div>
      {/* <PoolTable actions={['stake']} data={poolData} /> */}
    </div>
  )
}
