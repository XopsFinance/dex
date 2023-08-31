import { Button } from '@/components'
import Link from 'next/link'
import Image from 'next/image'
import classNames from 'classnames'
import styles from './roadmap.module.scss'
import { useRouter } from 'next/router'

const roadmap = [
  {
    title: 'Q3 2023',
    description: 'OpBnB Testnet & Mainnet Decentralised Exchange',
    passed: false,
    active: true,
  },
  {
    title: 'Q4 2023',
    description:
      'Swap, Increasing Liquidity, Staking, Farming Limited Partners, Partnership, Audit',
    active: false,
  },

  {
    title: 'Q1 2024',
    description:
      'Analytics Panel, Xfarming Liquidity Pools (for long-term Xops holders).',
  },
  {
    title: 'Q2 2024',
    description:
      'Multicoin Liquidity (zero-percentage-point-impact, cheapest fees)',
  },
  {
    title: 'Q3 2024',
    description: 'Multiple-Chain Derivatives',
  },
]

type StepType = {
  title: string
  description: string
  passed?: boolean
  active?: boolean
}

const Step = ({
  title,
  description,
  passed = false,
  active = false,
}: StepType) => {
  return (
    <div
      className={classNames([
        styles.step,
        active ? styles.active : null,
        passed ? styles.passed : null,
      ])}
    >
      <span className={styles.button} />
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  )
}

export const HomePage = () => {
  const router = useRouter()

  return (
    <>
      <section className="flex-row-reverse items-center justify-between gap-4 md:flex mt-[5px] md:mt-[10px]">
        <Image
          alt="Wallet"
          src="/assets/images/main-img.png"
          width={441}
          height={474}
          className="px-10"
        />
        <div className="mt-8 md:mt-0">
          <h1 className="text-4xl font-extrabold leading-tight lg:text-6xl">
            Leverage <br /> the power of DeFi
          </h1>
          <p className="mt-10 lg:text-lg text-white">
            On Xops Finance, the ultimate DEX built on OpBNB, you may trade with
            speed and security.
          </p>
          <Button type="primary" className="w-full text-lg mt-14 md:w-fit">
            <Link href={'/launch-pad/1'}>JOIN THE IFO NOW</Link>
          </Button>
        </div>
      </section>

      <section
        className={classNames([
          'mt-[10px] md:mt-[5px] flex flex-col items-center justify-center text-center relative',
        ])}
      >
        <Image
          alt="Defi"
          src="/assets/images/defi_slide.gif"
          width={1024}
          height={1024}
          className="px-10"
        />
      </section>

      <section className="mt-[10px] md:mt-[16px] mx-auto lg:mx-[-10px]">
        {}
        <h2 className="uppercase text-3xl font-extrabold text-center">
          Roadmap
        </h2>
        <div className={styles.roadmap}>
          {roadmap.map((item) => (
            <Step key={item.title} {...item} />
          ))}
        </div>
      </section>
    </>
  )
}
