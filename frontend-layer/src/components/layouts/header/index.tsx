import Image from 'next/image'
import Link from 'next/link'
import { GiHamburgerMenu } from 'react-icons/gi'
import { Navigation } from './navigation'
import { useState } from 'react'
import dynamic from 'next/dynamic'

const ConnectWalletButton = dynamic(
  () => import('@/components').then((comps) => comps.ConnectWalletButton),
  {
    ssr: false,
  }
)

export const HeaderLayout = () => {
  const [mobileNavOpen, setMobilNavOpen] = useState(false)

  return (
    <header className="flex items-center justify-between gap-2 mx-auto md:mx-0 md:gap-8 max-w-5xl self-center w-full mt-9 mb-11">
      <button
        className="text-3xl md:mx-0 md:hidden"
        onClick={() => setMobilNavOpen(true)}
      >
        <GiHamburgerMenu />
      </button>
      <Link href="/" className="mx-auto md:mx-0">
        <Image alt="Xoswap" src="/logo.png" width={112} height={23} />
      </Link>
      <Navigation
        openMobileNav={mobileNavOpen}
        onCloseMobileNav={() => setMobilNavOpen(false)}
      />
      <ConnectWalletButton />
    </header>
  )
}
