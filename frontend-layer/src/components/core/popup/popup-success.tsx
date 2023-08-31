import { NetworkConfig } from '@/constants'
import { useUserStore } from '@/store'
import { shortenHash } from '@/utils'
import Link from 'next/link'
import { BsCheckCircle } from 'react-icons/bs'

type Props = {
  transaction: string
  title: string
  children?: React.ReactNode
}

export function PopupSuccess({ transaction, title, children }: Props) {
  const network = useUserStore((state) => state.network)

  return (
    <div className="px-20 py-9">
      <BsCheckCircle className="mx-auto text-6xl text-primary" />
      <div className="mt-6 text-center">
        <p className="font-extrabold text-center">{title}</p>
        <p className="text-xs text-darker-grey">Transaction Hash</p>
        <p className="text-sm text-primary">
          <Link
            target="_blank"
            href={
              NetworkConfig[network].blockExplorerUrls[0] + `/tx/${transaction}`
            }
          >
            {shortenHash(transaction)}
          </Link>
        </p>
      </div>
      {children}
    </div>
  )
}
