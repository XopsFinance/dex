import Web3 from 'web3'
import _BN from 'bn.js'
import BN = _BN.BN

import { getAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import type { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { DEFAULT_ABI, NetworkConfig, NetworkType } from '@/constants'
import { BigNumber } from '@ethersproject/bignumber'
import { isNumber } from 'lodash'
import { Token } from '@uniswap/sdk-core'

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    // Alphabetical letters must be made lowercase for getAddress to work.
    // See documentation here: https://docs.ethers.io/v5/api/utils/address/
    return getAddress(value.toLowerCase())
  } catch {
    return false
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  const parsed = isAddress(address)
  if (!parsed) {
    console.error(`Invalid 'address' parameter '${address}'.`)
    return ''
  }
  return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

export const shortenHash = (hash: string, chars = 4) => {
  return `${hash.substring(0, chars + 2)}...${hash.substring(64 - chars)}`
}

// account is not optional
function getSigner(provider: JsonRpcProvider, account: string): JsonRpcSigner {
  return provider.getSigner(account).connectUnchecked()
}

// account is optional
function getProviderOrSigner(
  provider: JsonRpcProvider,
  account?: string
): JsonRpcProvider | JsonRpcSigner {
  return account ? getSigner(provider, account) : provider
}

// account is optional
export function getContract(
  address: string,
  ABI: any = DEFAULT_ABI,
  provider?: JsonRpcProvider,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(
    address,
    ABI,
    provider && (getProviderOrSigner(provider, account) as JsonRpcProvider)
  )
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export const toHex = (arg: number) => {
  return Web3.utils.toHex(arg)
}

const DecimalUnitMapping: Record<number, SupportUnit> = {
  0: 'wei',
  3: 'kwei',
  6: 'mwei',
  9: 'gwei',
  12: 'szabo',
  15: 'finney',
  18: 'ether',
  21: 'kether',
  24: 'mether',
  27: 'gether',
  30: 'tether',
}

type SupportUnit =
  | 'wei'
  | 'kwei'
  | 'mwei'
  | 'gwei'
  | 'szabo'
  | 'finney'
  | 'ether'
  | 'kether'
  | 'mether'
  | 'gether'
  | 'tether'

type SupportDecimal = keyof typeof DecimalUnitMapping
export const toWei = (value?: string | number, decimals?: SupportDecimal) => {
  if (!value && !isNumber(value)) return ''
  const stringValue =
    typeof value === 'string'
      ? Number(value)
          .toFixed(decimals || 16)
          .toString()
      : value.toFixed(decimals || 16).toString()

  return Web3.utils.toWei(
    stringValue,
    !decimals ? 'ether' : DecimalUnitMapping[decimals]
  )
}

export const fromWei = (value?: string | number, decimals?: SupportDecimal) => {
  if (!value && !isNumber(value)) return ''
  const stringValue = typeof value === 'string' ? value : value.toString()

  return Web3.utils.fromWei(
    stringValue,
    !decimals ? 'ether' : DecimalUnitMapping[decimals]
  )
}

export function isHexString(value: any, length?: number): boolean {
  if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false
  }
  if (length && value.length !== 2 + 2 * length) {
    return false
  }
  return true
}

export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(120).div(100)
}

export const getTokenInfo: (
  address: string,
  provider?: any,
  account?: string
) => Promise<Token | null> = async (address, provider, account) => {
  const tokenContract = getContract(address, undefined, provider, account)
  if (!tokenContract) return null
  const network =
    (JSON.parse(localStorage.getItem('user-store') || '{}')?.state
      .network as NetworkType) || 'Mainnet'

  try {
    const [name, decimals, symbol] = await Promise.all([
      tokenContract?.name(),
      tokenContract?.decimals(),
      tokenContract?.symbol(),
    ])

    const newToken = new Token(
      NetworkConfig[network].chainId,
      address,
      decimals,
      symbol,
      name
    )

    return newToken
  } catch (error) {
    throw error
  }
}
