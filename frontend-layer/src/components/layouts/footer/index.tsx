import { SocialIcons } from '@/components/containers'
import Link from 'next/link'

import styles from './styles.module.scss'

export const FooterLayout = () => {
  const footerInfos = [
    {
      title: 'General',
      infos: [
        {
          label: 'About us',
          href: 'https://xoswap.gitbook.io/xoswap/#what-is-xoswap',
          class: 'text-white',
        },
        {
          label: 'Token',
          href: 'https://xoswap.gitbook.io/xoswap/#tokenomics',
        },
      ],
    },
    {
      title: 'Links',
      infos: [
        {
          label: 'Explorer',
          href: 'https://mainnet.opbnbscan.com/',
        },
        {
          label: 'Bridge',
          href: 'https://opbnb-bridge.bnbchain.org/deposit',
        },
      ],
    },
  ]

  return (
    <footer>
      <div className="mx-auto mt-0 text-center md:mt-9 md:w-72 md:mx-0 md:text-left">
        <p className="pb-3 md:text-xs text-white">
          The cutting-edge decentralised exchange (DEX) Xops Finance has swiftly
          become the most popular DEX on OpBNB, an Ethereum layer-2 scaling
          solution. It&apos;s time you joined us!
        </p>
        <div className="flex justify-center mt-4 md:mt-0 md:block">
          <SocialIcons />
        </div>
      </div>
      <div className={styles['footer-links']}>
        {footerInfos.map((groupInfo, index) => (
          <div key={index}>
            <h3>{groupInfo.title}</h3>
            {groupInfo.infos.map((info, index) => {
              return (
                <p key={index}>
                  <Link target="_blank" href={info.href}>
                    {info.label}
                  </Link>
                </p>
              )
            })}
          </div>
        ))}
      </div>
    </footer>
  )
}
