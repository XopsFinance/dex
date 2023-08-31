import { useMetaMaskStore, useUserStore } from '@/store'
import { shortenAddress } from '@/utils'
import moment from 'moment'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'

export const Info = () => {
  const [reloadInfo, setReloadInfo] = useState(0)
  const getIfoInfo = useMetaMaskStore((state) => state.getIfoInfo)
  const address = useUserStore((state) => state.address)
  const { data: ifoInfo, isLoading: ifoInfoLoading } = useQuery(
    [`${address}:check-info`, reloadInfo],
    getIfoInfo
  )
  const explorerURL = 'https://mainnet.opbnbscan.com/address/'

  const infoData = useMemo(
    () => [
      {
        title: 'Token Name',
        value: 'Xoswap Token',
      },
      {
        title: 'Token Symbol',
        value: 'XOS',
      },
      {
        title: 'Token Decimals',
        value: '6',
      },
      {
        title: 'Token Supply',
        value: `1,000,000,000 XOS`,
      },
      {
        title: 'For IFO',
        value: `${
          ifoInfo?.tokenMaxSupply
            ? Number(ifoInfo?.tokenMaxSupply).toLocaleString()
            : 0
        } XOS`,
      },
      {
        title: 'Min Raise',
        value: `${
          ifoInfo?.minEthRaise
            ? Number(ifoInfo?.minEthRaise).toLocaleString()
            : 0
        } BNB`,
      },
      {
        title: 'Max Raise',
        value: `${
          ifoInfo?.totalEthRaise
            ? Number(ifoInfo?.totalEthRaise).toLocaleString()
            : 0
        } BNB`,
      },
      {
        title: 'IFO Rate',
        value: `1 BNB = ${
          ifoInfo?.tokenUnitPrice
            ? (1 / Number(ifoInfo?.tokenUnitPrice)).toLocaleString()
            : 0
        } XOS`,
      },
      {
        title: 'IFO StartTime',
        value: ifoInfo?.depositStartTime
          ? moment
              .unix(Number(ifoInfo.depositStartTime))
              .utc()
              .format('YYYY-MM-DD HH:MM:SS (UTC)')
          : '',
      },
      {
        title: 'IFO EndTime',
        value: ifoInfo?.depositEndTime
          ? moment
              .unix(Number(ifoInfo.depositEndTime))
              .utc()
              .format('YYYY-MM-DD HH:MM:SS (UTC)')
          : '',
      },
      {
        title: 'Token SC',
        value: (
          <Link
            className="font-semibold text-gradient border-b-primary border-b"
            href={`${explorerURL}${ifoInfo?.tokenAddress}#transactions`}
            target="_blank"
          >
            {shortenAddress(ifoInfo?.tokenAddress || '')}
          </Link>
        ),
      },
      {
        title: 'IFO SC',
        value: (
          <Link
            className="font-semibold text-gradient border-b-primary border-b"
            // eslint-disable-next-line max-len
            href={`${explorerURL}${process.env.NEXT_PUBLIC_XOSWAP_IFO}#transactions`}
            target="_blank"
          >
            {shortenAddress(process.env.NEXT_PUBLIC_XOSWAP_IFO || '0x9b8FF2fAaF924eE96f367Ca17e93Cc2F07aDeb23')}
          </Link>
        ),
      },
    ],
    [
      ifoInfo?.depositEndTime,
      ifoInfo?.depositStartTime,
      ifoInfo?.minEthRaise,
      ifoInfo?.tokenAddress,
      ifoInfo?.tokenMaxSupply,
      ifoInfo?.tokenUnitPrice,
      ifoInfo?.totalEthRaise,
    ]
  )

  useEffect(() => {
    getIfoInfo()
  }, [getIfoInfo])

  return (
    <div className="flex flex-col gap-6">
      {infoData.map((item, index) => {
        return (
          <div key={index} className="grid grid-cols-2">
            <div>{item.title}:</div>
            <div className="text-right font-semibold">{item.value}</div>
          </div>
        )
      })}{' '}
    </div>
  )
}
