import { Button } from '../core'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { shortenAddress } from '@/utils'
import { NetworkConfig, NetworkIcon } from '@/constants'
import { useWeb3React } from '@web3-react/core'
import { useUserStore } from '@/store'
import classNames from 'classnames'
import usePopupStore from '@/store/popup'
import { SelectNetwork } from './select-network'

type ConnectWalletButtonProps = {
  className?: string
  title?: string
}

export const ConnectWalletButton = (props: ConnectWalletButtonProps) => {
  const { className, title = 'Connect' } = props
  const [isButtonHover, setIsButtonHover] = useState<boolean>(false)
  const { isConnected, setIsConnected, network } = useUserStore()
  const popup = usePopupStore()

  const { account, connector } = useWeb3React()
  const onConnect = useCallback(async () => {
    try {
      await connector.activate(NetworkConfig['OpBnbMainnet'])
      setIsConnected(true)
    } catch (error) {}
  }, [connector, setIsConnected])

  const onDisconnect = useCallback(async () => {
    try {
      await connector.resetState()
      setIsConnected(false)
    } catch (error) {}
  }, [connector, setIsConnected])

  const onClickConnectButton = useCallback(() => {
    if (account) {
      onDisconnect()
    } else onConnect()
  }, [account, onConnect, onDisconnect])

  useEffect(() => {
    if (isConnected) onConnect()
  }, [isConnected, onConnect])

  return (
    <div className="flex flex-row gap-4">
      {account && (
        <Button
          onClick={() => {
            popup.setContent(<SelectNetwork />)
            popup.setOpen(true)
          }}
          type="primary"
          className="!p-2 !px-3 !rounded-xl"
        >
          {NetworkIcon[network] ? (
            <Image
              width={20}
              height={20}
              alt={network}
              src={NetworkIcon[network]}
            />
          ) : (
            'Network'
          )}
        </Button>
      )}
      <Button
        className={classNames({ 'min-w-[185px]': account }, className)}
        onMouseEnter={() => setIsButtonHover(true)}
        onMouseLeave={() => setIsButtonHover(false)}
        onClick={onClickConnectButton}
        type="transparent"
      >
        <div className="flex flex-row gap-4 items-center w-full">
          <Image
            alt="Wallet"
            src="/assets/icons/wallet.svg"
            width={24}
            height={24}
            className="-mt-0.5"
          />
          <div className="w-full flex items-center justify-center">
            {isButtonHover && account
              ? 'Disconnect'
              : account
              ? shortenAddress(account)
              : title}
          </div>
        </div>
      </Button>
    </div>
  )
}
