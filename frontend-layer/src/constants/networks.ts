import { toHex } from '@/utils'
import { ChainId } from '@uniswap/sdk-core'

export type NetworkType =
  | 'Mainnet'
  | 'Testnet'
  | 'Goerli'
  | 'Mantle'
  | 'MantleTestnet'
  | 'OpBnbMainnet'
  | 'OpBnBTestNet'
export type NetworkInfo = {
  chainId: ChainId
  rpcUrls: string[]
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  blockExplorerUrls: string[]
}

export const SupportedChainId: Record<NetworkType, number> = {
  Mainnet: 324,
  Testnet: 280,
  Goerli: 5,
  Mantle: 5000,
  MantleTestnet: 5001,
  OpBnbMainnet: 204,
  OpBnBTestNet: 5611,
}

export const NetworkConfig: Record<NetworkType, NetworkInfo> = {
  Mainnet: {
    chainId: SupportedChainId.Mainnet,
    rpcUrls: ['https://mainnet.era.zksync.io/'],
    chainName: 'zkSync Era Mainnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://explorer.zksync.io/'],
  },
  Testnet: {
    chainId: SupportedChainId.Testnet,
    rpcUrls: ['https://testnet.era.zksync.dev'],
    chainName: 'zkSync Era Testnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://goerli.explorer.zksync.io/'],
  },
  Goerli: {
    chainId: SupportedChainId.Goerli,
    rpcUrls: ['https://goerli.infura.io/v3/b3d5f67efa324f7893d964f108c36d20'],
    chainName: 'Goerli Testnet',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrls: ['https://goerli.etherscan.io'],
  },
  Mantle: {
    chainId: SupportedChainId.Mantle,
    rpcUrls: ['https://rpc.mantle.xyz/'],
    chainName: 'Mantle Mainnet',
    nativeCurrency: {
      name: 'MNT',
      symbol: 'MNT',
      decimals: 18,
    },
    blockExplorerUrls: ['https://explorer.mantle.xyz'],
  },
  MantleTestnet: {
    chainId: SupportedChainId.MantleTestnet,
    rpcUrls: ['https://rpc.testnet.mantle.xyz/'],
    chainName: 'Mantle Mainnet',
    nativeCurrency: {
      name: 'MNT',
      symbol: 'MNT',
      decimals: 18,
    },
    blockExplorerUrls: ['https://explorer.testnet.mantle.xyz'],
  },
  OpBnbMainnet: {
    chainId: SupportedChainId.OpBnbMainnet,
    rpcUrls: ['https://opbnb-mainnet-rpc.bnbchain.org/'],
    chainName: 'OpBnB Mainnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    blockExplorerUrls: ['https://mainnet.opbnbscan.com'],
  },
  OpBnBTestNet: {
    chainId: SupportedChainId.OpBnbMainnet,
    rpcUrls: ['https://opbnb-testnet-rpc.bnbchain.org'],
    chainName: 'OpBnB TestNet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'tBNB',
      decimals: 18,
    },
    blockExplorerUrls: ['http://opbnbscan.com/'],
  },
}

export const NetworkName: Record<NetworkType, string> = {
  Mainnet: 'zkSync mainnet',
  Testnet: 'zkSync testnet',
  Goerli: 'Goerli testnet',
  Mantle: 'Mantle mainnet',
  MantleTestnet: 'Mantle testnet',
  OpBnbMainnet: 'OpBnB Mainnet',
  OpBnBTestNet: 'OpBnB Testnet',
}

export const NetworkIcon: Record<NetworkType, string> = {
  Mainnet: '/assets/networks/zksync.svg',
  Testnet: '/assets/networks/zksync.svg',
  Goerli: '/assets/networks/ethereum.png',
  Mantle: '/assets/networks/mantle.webp',
  MantleTestnet: '/assets/networks/mantle.webp',
  OpBnbMainnet: '/assets/networks/opbnb.png',
  OpBnBTestNet: '/assets/networks/opbnb.png',
}

export const DEFAULT_GAS_LIMIT = 1_000_000
