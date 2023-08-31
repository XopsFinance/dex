import { BigNumber } from '@ethersproject/bignumber'
import { SupportedChainId } from './networks'
import {
  TEST_GOERLI,
  ETH_GOERLI,
  WETH_ZKSYNC,
  USDT_ZKSYNC,
  ETH_MAINNET,
  OP_BNB_MAINNET,
  USDT_OPBNB,
  USDC_ZKSYNC,
} from './tokens'
import { NativeCurrency, Token } from '@uniswap/sdk-core'

type ChainCurrencyList = {
  readonly [chainId: number]: (Token | NativeCurrency)[]
}

export const COMMON_BASES: ChainCurrencyList = {
  [SupportedChainId.Mainnet]: [
    ETH_MAINNET,
    WETH_ZKSYNC,
    USDT_ZKSYNC,
    USDC_ZKSYNC,
  ],
  [SupportedChainId.Goerli]: [ETH_GOERLI, TEST_GOERLI],
  [SupportedChainId.OpBnbMainnet]: [OP_BNB_MAINNET, USDT_OPBNB],
}

export const MaxUInt256 = BigNumber.from(
  '0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
)
