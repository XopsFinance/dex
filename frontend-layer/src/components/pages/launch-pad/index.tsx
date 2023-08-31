import { SocialIcons } from '@/components/containers'
import { Card } from '@/components/core'
import { useMetaMaskStore, useUserStore } from '@/store'
import { get } from 'lodash'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

export const LaunchPadOverview = () => {
  const router = useRouter()
  const address = useUserStore((state) => state.address)
  const getIfoInfo = useMetaMaskStore((state) => state.getIfoInfo)

  const { data: ifoInfo, isLoading: ifoInfoLoading } = useQuery(
    `${address}:check-info`,
    getIfoInfo
  )
  const cardsData = [
    {
      id: 1,
      tags: ['Coming', 'Public'],
      token: 'XOSWAP',
      hardCap: '400.00 ETH',
      totalRaise: ifoInfoLoading
        ? 'Loading'
        : Number(get(ifoInfo, 'TOTAL_DEPOSIT_AMOUNT', 0) / Math.pow(10, 18)) +
          ' ETH',
      note: '---',
    },
    null,
    null,
  ]

  return (
    <div>
      <div className="text-3xl font-extrabold text-primary">Launchpad</div>
      <div className="text-default">
        Launch innovations into the future of DeFi with Xoswap
      </div>
      <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cardsData.map((card, index) =>
          card ? (
            <Card
              key={card.id}
              className="!p-0"
              onClick={() => router.push(`/launch-pad/${card.id}`)}
            >
              <div className="border-b-grey border-b px-8 py-4 flex flex-row gap-3">
                {card.tags?.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border px-5 py-1.5 border-primary text-primary text-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="border-b-grey border-b px-8 py-4 flex flex-col gap-2">
                <SocialIcons iconOnly />
                <div className="flex flex-row gap-2">
                  <Image
                    width={200}
                    height={24}
                    src={'/icon.svg'}
                    alt="icon"
                    className="h-full w-auto"
                  />
                  <div className="font-bold text-lg text-primary">
                    {card.token}
                  </div>
                </div>
              </div>

              <div className="px-8 py-4">
                <div className="text-default text-2xs">Hard Cap</div>
                <div className="text-white font-semibold text-lg mt-1">
                  {card.hardCap}
                </div>
                <div className="text-default text-2xs mt-4">Total Raised</div>
                <div className="text-white font-semibold text-lg mt-1">
                  {card.totalRaise}
                </div>
                <div className="text-gradient">{card.note}</div>
              </div>
            </Card>
          ) : (
            <Card
              key={index}
              className="!py-[136px] !px-0 flex flex-col items-center justify-center"
            >
              <div className="h-[60px] text-lg text-primary font-extrabold bg-very-dark-blue w-full flex items-center justify-center shadow-[6px_4px_6px_3px_rgba(0,0,0,0.15)]">
                Coming Soon...
              </div>
            </Card>
          )
        )}
      </div>
    </div>
  )
}

export * from './details'
