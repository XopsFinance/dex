import { PoolData } from '@/types/state'
import { Button } from '../button'
import styles from './table.module.scss'
import Link from 'next/link'
import { ROUTER } from '@/constants'
import { TokenIcon } from '../token-icon'
import { usePairInfo } from '@/hooks'
import { useWeb3React } from '@web3-react/core'
import { ConnectWalletButton } from '@/components/containers'

type Action = 'deposit' | 'remove' | 'add' | 'stake'

type Props = {
  data?: PoolData[]
  actions?: Action[]
  loading?: boolean
  isAccountPoolTable?: boolean
}

const PoolRow = (props: {
  data: PoolData
  actions?: Action[]
  isAccountPoolTable?: boolean
}) => {
  const { data: item, actions, isAccountPoolTable } = props
  const { account } = useWeb3React()

  const poolInfo = usePairInfo(item.pool[0].token, item.pool[1].token, account)

  const renderButton = (item: PoolData) => {
    const tokenA = item.pool[0].token
    const tokenB = item.pool[1].token

    return actions?.map((action, index) => {
      switch (action) {
        case 'add':
          return (
            <Link
              href={{
                pathname: ROUTER.CREATE_POOL,
                query: {
                  tokenA: tokenA?.isNative
                    ? tokenA.wrapped.address
                    : tokenA.address,
                  tokenB: tokenB?.isNative
                    ? tokenB.wrapped.address
                    : tokenB.address,
                },
              }}
            >
              <Button
                type="primary"
                className="font-normal capitalize !rounded-full !px-6 !py-2"
                key={index}
              >
                add liquidity
              </Button>
            </Link>
          )
        case 'deposit':
          return (
            <Link
              href={{
                pathname: ROUTER.CREATE_POOL,
                query: {
                  tokenA: item.pool[0].token.address,
                  tokenB: item.pool[1].token.address,
                },
              }}
            >
              <Button
                type="primary"
                className="font-normal capitalize !rounded-full !px-6 !py-2"
                key={index}
              >
                deposit
              </Button>
            </Link>
          )
        case 'remove':
          return (
            <Link
              href={{
                pathname: ROUTER.REMOVE_POOL,
                query: {
                  tokenA: item.pool[0].token.address,
                  tokenB: item.pool[1].token.address,
                },
              }}
            >
              <Button
                type="danger"
                className="font-normal capitalize !rounded-full !px-6 !py-2"
                key={index}
              >
                remove
              </Button>
            </Link>
          )
        case 'stake':
          return (
            <Button
              type="primary"
              className="font-normal capitalize !rounded-full !px-6 !py-2"
              key={index}
            >
              stake now
            </Button>
          )

        default:
          break
      }
    })
  }

  const amount0 = isAccountPoolTable
    ? poolInfo?.pairInfo.amount0
    : item.pool[0].balance
  const amount1 = isAccountPoolTable
    ? poolInfo?.pairInfo.amount1
    : item.pool[1].balance

  if (isAccountPoolTable && !amount0) return null

  return (
    <tr>
      <td className="flex items-center gap-5">
        <div className="whitespace-nowrap">
          {item.pool.map((poolItem, index) => (
            <div
              key={index}
              className={`relative inline-block -ml-3 z-[${
                item.pool.length - index
              }]`}
            >
              <TokenIcon
                token={poolItem.token}
                size={36}
                className="bg-dark border-primary"
                // eslint-disable-next-line max-len
              />
            </div>
          ))}
        </div>
        <div>
          {item.pool.map((item) => (
            <span key={item.token.address} className="font-bold group">
              {item.token.symbol}
              <span className="group-last-of-type:hidden">/</span>
            </span>
          ))}
          <p className="mt-1 text-2xs text-darker-grey">{item.description}</p>
        </div>
      </td>
      <td>
        {item.pool.map((item, index) => (
          <p
            key={item.token.symbol}
            className="flex items-center justify-end gap-4 my-1"
          >
            <span className="text-xs font-bold">
              {(index ? amount1 : amount0)?.toLocaleString()}
            </span>
            <span className="text-2xs text-darker-grey">
              {item.token.symbol}
            </span>
          </p>
        ))}
      </td>
      <td>
        <div className="flex justify-end gap-5">{renderButton(item)}</div>
      </td>
    </tr>
  )
}

export function PoolTable({
  data,
  actions,
  loading,
  isAccountPoolTable,
}: Props) {
  const { account } = useWeb3React()

  return (
    <div className={styles['pool-table']}>
      <table>
        <thead>
          <tr>
            <th>Pair</th>
            <th>Pool Share</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => (
            <PoolRow
              data={item}
              key={index}
              actions={actions}
              isAccountPoolTable={isAccountPoolTable}
            />
          ))}
        </tbody>
      </table>
      {loading && <div className="w-full text-center">Loading...</div>}
      {!account && <ConnectWalletButton title="Connect your wallet" />}
      {/* <div>
        <Button type="transparent" className="w-[156px] mt-4 mx-auto">
          More <IoArrowForwardOutline className="ml-2 text-xl" />
        </Button>
      </div> */}
    </div>
  )
}
