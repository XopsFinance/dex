import Link from 'next/link'
import { AiOutlineTwitter } from 'react-icons/ai'
import { FaTelegramPlane } from 'react-icons/fa'
import { SiGitbook } from 'react-icons/si'
import styles from './social-icons.module.scss'
import { useMemo } from 'react'

type SocialIconsProps = {
  iconOnly?: boolean
}
export function SocialIcons(props: SocialIconsProps) {
  const { iconOnly = false } = props
  const socials = useMemo(
    () => [
      {
        icon: <AiOutlineTwitter />,
        href: ' https://twitter.com/xops_finance',
      },
      {
        icon: <FaTelegramPlane />,
        href: 'https://t.me/xoswapchannel',
      },
      {
        icon: <SiGitbook />,
        href: 'https://xoswap.gitbook.io/xoswap',
      },
    ],
    []
  )

  return (
    <ul
      className={
        iconOnly ? styles['social-icons-icon-only'] : styles['social-icons']
      }
    >
      {socials.map((item, index) => {
        return (
          <li key={index}>
            <Link
              onClick={(e) => e.stopPropagation()}
              href={item.href}
              target="_blank"
            >
              {item.icon}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
