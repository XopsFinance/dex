import {
  ChainId,
  Currency,
  Ether,
  NativeCurrency,
  Token,
  WETH9,
} from '@uniswap/sdk-core'
import { SupportedChainId } from './networks'

// When decimals are not specified for an ERC20 token
// use default ERC20 token decimals as specified here:
// https://docs.openzeppelin.com/contracts/3.x/erc20
export const DEFAULT_ERC20_DECIMALS = 18

export type TokenData = { token?: Token | NativeCurrency; balance?: number }

export const WRAPPED_NATIVE_CURRENCY: { [chainId: number]: Token | undefined } =
  {
    ...(WETH9 as Record<keyof typeof SupportedChainId, Token>),
    [SupportedChainId.OpBnbMainnet]: new Token(
      SupportedChainId.OpBnbMainnet,
      '0x4200000000000000000000000000000000000006',
      18,
      'WBNB',
      'Wrapped BNB'
    ),
  }

export const USDC_MAINNET = new Token(
  SupportedChainId.Mainnet,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD//C'
)

export const USDC_GOERLI = new Token(
  SupportedChainId.Goerli,
  '0x07865c6e87b9f70255377e024ace6630c1eaa37f',
  6,
  'USDC',
  'USD//C'
)

export const WETH_GOERLI = new Token(
  SupportedChainId.Goerli,
  '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  DEFAULT_ERC20_DECIMALS,
  'WETH',
  'Wrapped Ether'
)

class ExtendedEther extends Ether {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (wrapped) return wrapped
    throw new Error(`Unsupported chain ID: ${this.chainId}`)
  }

  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency } =
    {}

  public static onChain(chainId: number): ExtendedEther {
    return (
      this._cachedExtendedEther[chainId] ??
      (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId))
    )
  }
}

export function isBsc(chainId: number): chainId is ChainId.BNB {
  return [ChainId.BNB, SupportedChainId.OpBnbMainnet].includes(chainId)
}

class BscNativeCurrency extends NativeCurrency {
  equals(other: Currency): boolean {
    return other.isNative && other.chainId === this.chainId
  }

  get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (wrapped) return wrapped
    throw new Error(`Unsupported chain ID: ${this.chainId}`)
  }

  public constructor(chainId: number) {
    if (!isBsc(chainId)) throw new Error('Not bnb')
    super(chainId, 18, 'BNB', 'BNB')
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency | Token } = {}

export function nativeOnChain(chainId: number): NativeCurrency | Token {
  if (cachedNativeCurrency[chainId]) return cachedNativeCurrency[chainId]
  let nativeCurrency: NativeCurrency | Token

  switch (chainId) {
    case SupportedChainId.OpBnbMainnet:
      nativeCurrency = new BscNativeCurrency(chainId)
      break
    default:
      nativeCurrency = ExtendedEther.onChain(chainId)
      break
  }

  return (cachedNativeCurrency[chainId] = nativeCurrency)
}

export const ETH_MAINNET = nativeOnChain(SupportedChainId.Mainnet)
export const ETH_GOERLI = nativeOnChain(SupportedChainId.Goerli)
export const OP_BNB_MAINNET = nativeOnChain(SupportedChainId.OpBnbMainnet)

export const WETH_ZKSYNC = new Token(
  SupportedChainId.Mainnet,
  '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91',
  18,
  'WETH',
  'Wrapped ETH'
)

export const USDT_ZKSYNC = new Token(
  SupportedChainId.Mainnet,
  '0x59ac51Cfb025adCE007D1EC96A21f7c7e3f32330',
  6,
  'USDT',
  'Tether USD'
)

export const USDC_ZKSYNC = new Token(
  SupportedChainId.Mainnet,
  '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
  6,
  'USDC',
  'USD Coin'
)

export const USDT_OPBNB = new Token(
  SupportedChainId.OpBnbMainnet,
  '0x3f7e81f614e4c504c42c4e4193bbe7175ef991bb',
  6,
  'USDT',
  'opUSDT'
)

export const WRAPPED_ETH_GOERLI = ETH_GOERLI.wrapped

export const TEST_GOERLI = new Token(
  SupportedChainId.Goerli,
  '0x7dF51cCe50B7c9986Cf07a44D87E63fe552BCF47',
  6,
  'TEST',
  'TEST'
)

export const USDT = new Token(
  SupportedChainId.Mainnet,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT',
  'Tether USD'
)

export const AMPL = new Token(
  SupportedChainId.Mainnet,
  '0xD46bA6D942050d489DBd938a2C909A5d5039A161',
  9,
  'AMPL',
  'Ampleforth'
)
export const DAI = new Token(
  SupportedChainId.Mainnet,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const WBTC = new Token(
  SupportedChainId.Mainnet,
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  8,
  'WBTC',
  'Wrapped BTC'
)
export const FEI = new Token(
  SupportedChainId.Mainnet,
  '0x956F47F50A910163D8BF957Cf5846D573E7f87CA',
  18,
  'FEI',
  'Fei USD'
)
export const TRIBE = new Token(
  SupportedChainId.Mainnet,
  '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B',
  18,
  'TRIBE',
  'Tribe'
)
export const FRAX = new Token(
  SupportedChainId.Mainnet,
  '0x853d955aCEf822Db058eb8505911ED77F175b99e',
  18,
  'FRAX',
  'Frax'
)
export const FXS = new Token(
  SupportedChainId.Mainnet,
  '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
  18,
  'FXS',
  'Frax Share'
)
export const renBTC = new Token(
  SupportedChainId.Mainnet,
  '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D',
  8,
  'renBTC',
  'renBTC'
)
export const ETH2X_FLI = new Token(
  SupportedChainId.Mainnet,
  '0xAa6E8127831c9DE45ae56bB1b0d4D4Da6e5665BD',
  18,
  'ETH2x-FLI',
  'ETH 2x Flexible Leverage Index'
)
export const sETH2 = new Token(
  SupportedChainId.Mainnet,
  '0xFe2e637202056d30016725477c5da089Ab0A043A',
  18,
  'sETH2',
  'StakeWise Staked ETH2'
)
export const rETH2 = new Token(
  SupportedChainId.Mainnet,
  '0x20BC832ca081b91433ff6c17f85701B6e92486c5',
  18,
  'rETH2',
  'StakeWise Reward ETH2'
)
export const SWISE = new Token(
  SupportedChainId.Mainnet,
  '0x48C3399719B582dD63eB5AADf12A40B4C3f52FA2',
  18,
  'SWISE',
  'StakeWise'
)

export const RouterAddress: Partial<Record<number, string>> = {
  [`${SupportedChainId.Mainnet}`]: '0x082Bd533DC5FEde847DC5Faa1CA39FFEd54994c7',
  [`${SupportedChainId.Mantle}`]: '0x',

  // [`${ChainId.Goerli}`]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // uniswap goerli router
  [`${SupportedChainId.Goerli}`]: '0x270C0029f19Af43A7912BC4BE2cc5a4F2ba1d7B8', // own goerli router

  [`${SupportedChainId.OpBnbMainnet}`]:
    '0xd313E6122A0E37AcE0024089ded7Ec4DD4DA68c1',
}

export const FactoryAddress: Partial<Record<number, string>> = {
  [`${SupportedChainId.Mainnet}`]: '0xC241Fb7FDD5DBc13E6ED38A6193e38fBAe8F2899',
  [`${SupportedChainId.Mantle}`]: '0x',

  // [`${ChainId.Goerli}`]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f', // uniswap goerli factory
  [`${SupportedChainId.Goerli}`]: '0x3b5b1A3Ae4937a9fa9Feb3c5DD174bccCac041AF', // own goerli factory

  [`${SupportedChainId.OpBnbMainnet}`]:
    '0x6b5F5C4E0076c5841726a3B20B87Eb0709741842',
}

export const AirdropAddress = '0x7f0f8f053a75ee1b40e76fb86314b51f849338c3'
