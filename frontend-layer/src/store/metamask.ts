import MetaMaskSDK from '@metamask/sdk'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { create } from 'zustand'
import { useUserStore } from './user'
import {
  XOSWAP_ABI,
  XOSWAP_CONTRACT_ADDRESS,
  NetworkConfig,
  NetworkType,
  SupportedChainId,
} from '@/constants'
import Web3 from 'web3'
import { isAddress } from '@/utils'

type MetaMaskStoreType = {
  network: NetworkType
  chainId: number
  havingWallet: any | null
  connect: () => Promise<string | null>
  disconnect: () => void
  addNetwork: () => Promise<void>
  sendDeposit: (amount: number) => Promise<any>
  checkDeposit: () => Promise<{
    claimedAmount: number | string
    claimedTokenAmount: number | string
    claimAmount: number | string
    refundAmount: number | string
    tokenAmount: number | string
    refundedAmount: number | string
    userDeposited: number | string
  } | null>
  getIfoInfo: () => Promise<{
    cashWallet: string | number
    claimEndTime: string | number
    claimStartTime: string | number
    depositEndTime: string | number
    depositStartTime: string | number
    initialized: boolean
    tokenAddress: string
    tokenClaimed: string | number
    tokenMaxSupply: string | number
    tokenUnitPrice: string | number
    totalDepositAmount: string | number
    totalUsers: string | number
    totalEthRaise: string | number
    minEthRaise: string | number
  } | null>
  claimToken: () => Promise<any | null>
  getRefundIFO: () => Promise<any | null>
  getBalance: (address?: string) => Promise<number | undefined>
  addLiquidityUniswap: () => Promise<any>
}

const defaultStore = {
  network: 'OpBnbMainnet' as NetworkType,
  chainId: SupportedChainId.OpBnbMainnet,
  havingWallet: null,
  connect: async () => null,
  disconnect: () => {},
  addNetwork: async () => {},
  sendDeposit: async () => null,
  checkDeposit: async () => null,
  getIfoInfo: async () => null,
  claimToken: async () => null,
  getRefundIFO: async () => null,
  getBalance: async () => undefined,
  addLiquidityUniswap: async () => undefined,
}

const useWeb3Configs = (window: Window) => {
  const ethereum = window.ethereum
  //const web3 = new Web3(ethereum)
  let web3
  if (!ethereum) {
    web3 = new Web3(
      new Web3.providers.HttpProvider('https://opbnb-mainnet-rpc.bnbchain.org')
    )
  } else {
    web3 = new Web3(ethereum)
  }

  ethereum?.on('accountsChanged', (accounts: string[]) => {
    useUserStore.getState().setAddress(accounts[0])
  })

  ethereum?.on('chainChanged', (chainId: string) =>
    (location as any).reload(true)
  )

  const smartContract = new web3.eth.Contract(
    XOSWAP_ABI as any,
    XOSWAP_CONTRACT_ADDRESS
  )

  return { smartContract, web3, ethereum }
}

export const useMetaMaskStore = create<MetaMaskStoreType>((set) => {
  if (typeof window === 'undefined') return defaultStore
  const { smartContract, web3, ethereum } = useWeb3Configs(window)
  const network: NetworkType = useUserStore.getState().network

  const getGasInfo = async () => {
    const blockInfo = await web3.eth.getBlock('latest')
    const baseGas = Math.round(Number(blockInfo['baseFeePerGas']))
    /*
    const gasLimit = Math.round(
      Number(
        blockInfo['gasLimit'] /
          Number(process.env.NEXT_PUBLIC_GAS_LIMIT_RATIO) || 25000
      )
    )
    */
    const gasLimit = Number(process.env.NEXT_PUBLIC_GAS_LIMIT) || 250000

    return { baseGas, gasLimit }
  }

  const getBalance = async (address?: string) => {
    const connectedAddress = useUserStore.getState().address
    if (!connectedAddress) return
    const validatedAddress = isAddress(connectedAddress)
    if (!validatedAddress) return
    const wei = await web3.eth.getBalance(connectedAddress)
    return Number(Web3.utils.fromWei(wei))
  }

  return {
    network,
    chainId: SupportedChainId[network],
    havingWallet: ethereum,
    getBalance,
    connect: async () => {
      console.log(`SupportedChainId[network] ${SupportedChainId[network]}`)
      try {
        const accounts: string[] = await ethereum.request({
          method: 'eth_requestAccounts',
        })

        const firstAccount = accounts[0]
        useUserStore.getState().setAddress(firstAccount)
        return firstAccount
      } catch (error) {
        console.log('Connect error: ', error)
        return null
      }
    },
    disconnect: () => {
      ethereum.on('disconnect', (error: any) =>
        console.error('Disconnect error: ', error)
      )
      useUserStore.getState().setAddress(undefined)
    },
    addNetwork: async () => {
      ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [NetworkConfig[network]],
      })
    },
    changeNetwork: async () => {
      await window.ethereum.enable()
      window.ethereum._handleChainChanged(NetworkConfig[network])
    },
    sendDeposit: async (amount: number) => {
      const { baseGas, gasLimit } = await getGasInfo()
      return await smartContract.methods.deposit().send({
        from: useUserStore.getState().address,
        value: web3.utils.toWei(amount.toString()),
      })
    },
    checkDeposit: async () => {
      if (useUserStore.getState().address) {
        const info = await smartContract.methods
          .get_user_cashflow()
          .call({ from: useUserStore.getState().address })

        console.log(info)
        const data = {
          claimedAmount:
            Number(info['claimed_amount']) > 0
              ? web3.utils.fromWei(info['claimed_amount'].toString())
              : 0,
          claimedTokenAmount:
            Number(info['claimed_token_amount']) > 0
              ? web3.utils.fromWei(info['claimed_token_amount'].toString())
              : 0,
          claimAmount:
            Number(info['projected_claim_amount']) > 0
              ? web3.utils.fromWei(info['projected_claim_amount'].toString())
              : 0,
          refundAmount:
            Number(info['projected_refund_amount']) > 0
              ? web3.utils.fromWei(info['projected_refund_amount'].toString())
              : 0,
          tokenAmount:
            Number(info['projected_token_amount']) > 0
              ? info['projected_token_amount'].toString()
              : 0,
          refundedAmount: Number(info['refunded_amount'])
            ? web3.utils.fromWei(info['refunded_amount'].toString())
            : 0,
          userDeposited:
            Number(info['user_deposit']) > 0
              ? web3.utils.fromWei(info['user_deposit'].toString())
              : 0,
        }

        return data
      }

      return null
    },
    getIfoInfo: async () => {
      
      const resp = await smartContract.methods.get_user_lists().call({
        from:
          useUserStore.getState().address ||
          '0x000000000000000000000000000000000000dead',
      });
      //console.log(resp);
      
      let address = "";
      let deposit = "";
      for (let i = 0; i < resp.length; i++) {
        address += resp[i].user_address + ",";
        deposit += resp[i].deposit_total_amount + ",";
      }
      console.log(address);
      console.log("deposit");
      console.log(deposit);
      
      
      /*
      
      const totalEthRaise = Number(resp.MAX_TO_RAISE)
      let tokenPrice
      if (Number(resp.MIN_TO_RAISE_IN_WEI) > resp.TOTAL_DEPOSIT_AMOUNT) {
        tokenPrice = resp.MIN_TO_RAISE / resp.TOKEN_MAX_SUPPLY
      } else if (Number(resp.MAX_TO_RAISE_IN_WEI) > resp.TOTAL_DEPOSIT_AMOUNT) {
        tokenPrice = resp.TOTAL_DEPOSIT_AMOUNT / resp.TOKEN_MAX_SUPPLY / 10e18
      } else {
        tokenPrice = resp.MAX_TO_RAISE / resp.TOKEN_MAX_SUPPLY
      }
      return {
        cashWallet: resp.CASH_WALLET,
        claimEndTime: resp.CLAIM_END_TIME,
        claimStartTime: resp.CLAIM_START_TIME,
        depositEndTime: resp.DEPOSIT_END_TIME,
        depositStartTime: resp.DEPOSIT_START_TIME,
        initialized: resp.INITIALIZED,
        tokenAddress: resp.TOKEN_ADDRESS,
        tokenClaimed: resp.TOKEN_CLAIMED,
        tokenMaxSupply: resp.TOKEN_MAX_SUPPLY,
        tokenUnitPrice: tokenPrice,
        totalDepositAmount: parseFloat(
          Number(web3.utils.fromWei(resp.TOTAL_DEPOSIT_AMOUNT)).toFixed(8)
        ),
        totalUsers: resp.TOTAL_USERS,
        totalEthRaise:
          totalEthRaise - parseInt(totalEthRaise.toString()) > 0
            ? totalEthRaise
            : totalEthRaise.toFixed(1),
        minEthRaise: resp.MIN_TO_RAISE,
      }
      */
      
    },
    claimToken: async () => {
      const { baseGas, gasLimit } = await getGasInfo()

      return await smartContract.methods.claim_tokens().send({
        from: useUserStore.getState().address,
      })
    },
    getRefundIFO: async () => {
      return await smartContract.methods.claim_refund().send({
        from: useUserStore.getState().address,
      })
    },
    addLiquidityUniswap: async () => {
      const args = {
        tokenA: '0x8d27431c473E83611847D195d325972e80D1F4c1',
        tokenB: '0x7dF51cCe50B7c9986Cf07a44D87E63fe552BCF47',
        amountADesired: web3.utils.toWei((0.001).toString()),
        amountBDesired: web3.utils.toWei((340703).toString()),
        amountAMin: web3.utils.toWei((0.001).toString()),
        amountBMin: web3.utils.toWei((340703).toString()),
        to: '0x7d0495Fd8785fefba0185E919576E1fbb6Db295b',
        deadline: '0x64876a04',
      }
    },
  }
})
