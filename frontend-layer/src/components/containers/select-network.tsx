import {
  NetworkConfig,
  NetworkIcon,
  NetworkName,
  NetworkType,
} from '@/constants'
import Image from 'next/image'
import { Button } from '../core'
import { useCallback } from 'react'
import { useUserStore } from '@/store'
import { useWeb3React } from '@web3-react/core'

type SelectNetworkProps = {}

const networks: NetworkType[] = ['OpBnbMainnet']

export const SelectNetwork = (props: SelectNetworkProps) => {
  const { network: selectedNetwork, setNetwork } = useUserStore()
  const { connector } = useWeb3React()
  const onChangeNetwork = useCallback(
    (network: NetworkType) => {
      setNetwork(network)
      connector.activate(NetworkConfig[network])
    },
    [connector, setNetwork]
  )

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="font-bold">Select Network</div>
      {networks.map((network) => {
        return (
          <Button
            onClick={() => onChangeNetwork(network)}
            type="primary"
            key={network}
            disabled={network === selectedNetwork}
          >
            {NetworkIcon[network] && (
              <Image
                width={20}
                height={20}
                alt={network}
                src={NetworkIcon[network]}
                className="mr-2"
              />
            )}
            {NetworkName[network]}
          </Button>
        )
      })}
    </div>
  )
}
