import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { AiFillCloseCircle } from 'react-icons/ai'
import { BsChevronDown } from 'react-icons/bs'

import styles from './navigation.module.scss'
import { ROUTER } from '@/constants'

type NavigationProps = {
  openMobileNav?: boolean
  onCloseMobileNav?: () => void
}

type TabItem = {
  label: string
  value: string
  children?: TabItem[]
  onLinkClick?: () => void
}

const ItemWithChild = ({ label, children, onLinkClick }: TabItem) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <span className={classNames([styles['no-link']], 'hidden md:flex')}>
        {label}
        {children ? <BsChevronDown /> : null}
      </span>
      <span
        className={classNames([styles['no-link']], 'flex md:hidden')}
        onClick={() => setOpen(!open)}
      >
        {label}
        {children ? (
          <BsChevronDown className={open ? 'rotate-180' : ''} />
        ) : null}
      </span>
      {children ? (
        <nav
          className={classNames([
            styles['sub-navigation'],
            open ? 'h-auto' : 'h-0',
          ])}
        >
          <ul>
            {children.map((child: TabItem) => (
              <li key={child.label}>
                <Link href={child.value} onClick={onLinkClick}>
                  {child.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </>
  )
}

export const Navigation = (props: NavigationProps) => {
  const { openMobileNav, onCloseMobileNav } = props

  const tabs = [
    {
      label: 'Swap',
      value: ROUTER.SWAP,
    },
    {
      label: 'Pools',
      value: '',
      children: [
        {
          label: 'Pools',
          value: ROUTER.POOLS,
        },
        {
          label: 'Add LP',
          value: ROUTER.CREATE_POOL,
        },
      ],
    },
    {
      label: 'Earn',
      value: ROUTER.EARN,
    },
    {
      label: 'Stats',
      value: ROUTER.HOME,
    },
    {
      label: 'IFO',
      value: ROUTER.LAUNCHPAD + '/1',
    },
  ]

  const router = useRouter()

  return (
    <nav
      className={classNames([
        styles.navigation,
        {
          [`${styles['nav-mobile-open']}`]: openMobileNav,
        },
      ])}
    >
      <button
        className="absolute z-10 text-3xl top-3 right-3 md:hidden"
        onClick={() => onCloseMobileNav?.()}
      >
        <AiFillCloseCircle />
      </button>
      <ul>
        {tabs.map((item, index) => {
          return (
            <li key={index}>
              {item.value !== '' ? (
                <Link
                  className={classNames([
                    {
                      [`${styles.active}`]:
                        item.value === router.pathname && item.value !== '/',
                    },
                  ])}
                  href={item.value}
                  onClick={() => onCloseMobileNav?.()}
                >
                  {item.label}
                </Link>
              ) : (
                <ItemWithChild
                  {...item}
                  onLinkClick={() => onCloseMobileNav?.()}
                />
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
