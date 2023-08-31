import { Token } from '@uniswap/sdk-core'

export type PopupType = {
  open: boolean
  setOpen: (open: boolean) => void
  content: any
  setContent: (content: any) => void
}

type Pool = { token: Token; balance: number }

export type PoolData = {
  pool: [Pool, Pool]
  description: string
  apr: number | string
}
