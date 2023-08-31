import { Button, Countdown, FloatInput } from '@/components'
import { useMetaMaskStore, useUserStore } from '@/store'
import { get } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import moment from 'moment'
import { AIRDROP_ABI, AirdropAddress } from '@/constants'
import { useContract } from '@/hooks'
import { BigNumber } from '@ethersproject/bignumber'
import { fromWei } from '@/utils'

export const Form = () => {
  const address = useUserStore((state) => state.address)
  const { sendDeposit, checkDeposit, getIfoInfo, claimToken, getRefundIFO } =
    useMetaMaskStore()
  const [amountInput, setAmountInput] = useState<string>()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [claimLoading, setClaimLoading] = useState(false)
  const [canReceiveAirdrop, setCanReceiveAirdrop] = useState(0)
  const [reloadInfo, setReloadInfo] = useState(0)
  const { data: depositData, isLoading: depositLoading } = useQuery(
    [`${address}:check-deposit`, reloadInfo],
    checkDeposit
  )
  const { data: ifoInfo, isLoading: ifoInfoLoading } = useQuery(
    [`${address}:check-info`, reloadInfo],
    getIfoInfo
  )
  const airDropContract = useContract(AirdropAddress, AIRDROP_ABI)

  const [countDownTillClaimTime, setCountDownTillClaimTime] =
    useState('00:00:00')
  const [
    depositStartTime,
    depositEndTime,
    claimStartTime,
    claimEndTime,
    minEthRaise,
    totalDepositAmount,
  ] = useMemo(() => {
    if (!ifoInfo) return []

    return [
      moment.unix(Number(ifoInfo['depositStartTime'])),
      moment.unix(Number(ifoInfo['depositEndTime'])),
      moment.unix(Number(ifoInfo['claimStartTime'])),
      moment.unix(Number(ifoInfo['claimEndTime'])),
      Number(ifoInfo['minEthRaise']),
      Number(ifoInfo['totalDepositAmount']),
    ]
  }, [ifoInfo])

  const isDepositStart = depositStartTime
    ? moment().diff(depositStartTime, 'second') > 0
    : false

  const isDepositOver = depositEndTime
    ? moment().diff(depositEndTime, 'second') > 0
    : false

  const isClaimStart = claimStartTime
    ? moment().diff(claimStartTime, 'second') > 0
    : false
  const isIFOToRefund =
    address &&
    isDepositOver &&
    minEthRaise &&
    totalDepositAmount &&
    Number(minEthRaise * 1e18) > totalDepositAmount
      ? true
      : false
  const infoData = useMemo(
    () => [
      {
        title: 'Soft Cap',
        value: `${ifoInfo?.totalEthRaise ? ifoInfo?.totalEthRaise : '0'} BNB`,
      },
      {
        title: 'Hard Cap',
        value: `${ifoInfo?.minEthRaise ? ifoInfo?.minEthRaise : '0'} BNB`,
      },
      {
        title: 'Actual Rate',
        value: `1 BNB = ${(
          1 / Number(ifoInfo?.tokenUnitPrice)
        ).toLocaleString()}.00 XOS`,
      },
      {
        title: 'You Deposited',
        value: depositLoading
          ? 'Loading'
          : (depositData?.userDeposited || 0) + ' BNB',
      },
      {
        title: 'You Offering',
        value: depositLoading
          ? 'Loading'
          : ((depositData?.claimAmount &&
              ifoInfo?.tokenUnitPrice &&
              (
                Number(depositData.claimAmount) / Number(ifoInfo.tokenUnitPrice)
              ).toLocaleString()) ||
              0) + ' XOS',
      },
      depositData?.claimedAmount && Number(depositData?.claimedAmount) > 0
        ? {
            title: 'You Claimed',
            value: depositLoading
              ? 'Loading'
              : ((ifoInfo?.tokenUnitPrice &&
                  (
                    Number(depositData.claimedAmount) /
                    Number(ifoInfo.tokenUnitPrice)
                  ).toLocaleString()) ||
                  0) + ' OXS',
          }
        : undefined,
      {
        title: 'Your Refund',
        value: depositLoading
          ? 'Loading'
          : (depositData?.refundedAmount != 0
              ? depositData?.refundedAmount
              : depositData?.refundAmount || 0) + ' BNB',
      },
    ],
    [
      depositData?.claimAmount,
      depositData?.claimedAmount,
      depositData?.refundAmount,
      depositData?.refundedAmount,
      depositData?.userDeposited,
      depositLoading,
      ifoInfo?.minEthRaise,
      ifoInfo?.tokenUnitPrice,
      ifoInfo?.totalEthRaise,
    ]
  )
  const currentTime = moment()

  const isClaimStarted = currentTime.diff(claimStartTime, 'seconds') > 0
  const isClaimEnded = currentTime.diff(claimEndTime, 'seconds') > 0

  const submitCheck = useCallback(() => {
    if (!address) return { disabled: true, text: 'Please connect your wallet' }
    /*
    let havingWalletChainID = havingWallet?.chainId;
    if (havingWalletChainID !== NetworkConfig[network]?.chainId)
      return {
        disabled: true,
        text: `Change your network to ${NetworkName[network]}`,
      }
      */
    const amount = Number(amountInput)
    return {
      text: 'Submit',
      disabled: false,
      action: async () => {
        try {
          if (amount) {
            setSubmitLoading(true)
            await sendDeposit(amount)
            setReloadInfo(reloadInfo + 1)
          }
        } catch (error) {}

        setSubmitLoading(false)
      },
    }
  }, [address, amountInput, reloadInfo, sendDeposit])

  const claimCheck = useCallback(() => {
    if (!isClaimStarted)
      return {
        text: `You can claim in ${countDownTillClaimTime}`,
        disabled: true,
      }
    else if (!isClaimEnded)
      return {
        text: 'Claim',
        disabled: false,
        action: async () => {
          try {
            setClaimLoading(true)
            await claimToken()
            setReloadInfo(reloadInfo + 1)
          } catch (error) {
            setClaimLoading(false)
          }

          setClaimLoading(false)
        },
      }
    else return { text: 'Claim Ended', disabled: true }
  }, [
    claimToken,
    countDownTillClaimTime,
    isClaimEnded,
    isClaimStarted,
    reloadInfo,
  ])

  const onClaim = useCallback(() => {
    if (!isClaimStart) return

    airDropContract?.ClaimAirdrop()
  }, [airDropContract, isClaimStart])

  useEffect(() => {
    if (submitCheck().text.includes('You can claim in'))
      setInterval(function () {
        const currentTime = moment()
        const tillClaim = moment.duration(
          currentTime.diff(claimStartTime, 'milliseconds')
        )

        if (tillClaim.asSeconds() > 0)
          setCountDownTillClaimTime(
            tillClaim.hours().toString().padStart(2, '0') +
              ':' +
              tillClaim.minutes().toString().padStart(2, '0') +
              ':' +
              tillClaim.seconds().toString().padStart(2, '0')
          )
      }, 1000)
  }, [claimStartTime, submitCheck])

  useEffect(() => {
    const getClaimAmount = async () => {
      try {
        const res: number = await airDropContract?._airdropList(address)
        const decimals: number = await airDropContract?._decimals()

        const amount = Number(fromWei(BigNumber.from(res).toString(), decimals))
        amount && setCanReceiveAirdrop(amount)
      } catch (error) {
        return null
      }
    }

    getClaimAmount()
  }, [address, airDropContract])

  return (
    <div className="flex flex-col items-center">
      <div className="font-bold text-4xl text-primary max-w text-center">
        {ifoInfoLoading ? 'Loading' : get(ifoInfo, 'totalDepositAmount', 0)} /
        {ifoInfo?.minEthRaise + ` BNB` || 0}
      </div>
      <div className="text-secondary mt-2">Target/Total</div>
      <div className="text-gradient font-medium mt-1">
        {get(ifoInfo, 'totalUsers', 0)} Participated
      </div>
      <div className="w-full mt-10 flex flex-col gap-6">
        {infoData.map((item, index) => {
          if (item)
            return (
              <div key={index} className="grid grid-cols-2">
                <div>{item.title}:</div>
                <div className="font-semibold text-right">{item.value}</div>
              </div>
            )
        })}
      </div>
      {isDepositStart && !isDepositOver && depositStartTime && (
        <>
          <FloatInput
            defaultValue={''}
            onChange={setAmountInput}
            className="w-full mt-8"
            placeholder="BNB Amount"
          />
          <Button
            loading={submitLoading}
            onClick={() => {
              submitCheck().action?.()
            }}
            disabled={submitCheck().disabled}
            className="mt-4 w-full"
            type="primary"
          >
            {submitCheck().text}
          </Button>
        </>
      )}
      {!isDepositStart && (
        <>
          <Button
            loading={submitLoading}
            disabled={true}
            className="mt-4 w-full"
            type="primary"
          >
            You can deposit at $
            {ifoInfo?.depositStartTime
              ? moment
                  .unix(Number(ifoInfo.depositStartTime))
                  .utc()
                  .format('YYYY-MM-DD HH:MM:SS (UTC)')
              : ''}
          </Button>
        </>
      )}
      {isIFOToRefund && (
        <Button
          onClick={() => {
            getRefundIFO()
          }}
          className="mt-4 w-full"
          type="primary"
        >
          Get Refund
        </Button>
      )}
      {!isIFOToRefund &&
        isClaimStart &&
        Number(depositData?.claimAmount) > 0 &&
        depositData?.claimedAmount == 0 && (
          <Button
            loading={claimLoading}
            onClick={() => {
              claimCheck().action?.()
            }}
            disabled={claimCheck().disabled}
            className="mt-4 w-full"
            type="primary"
          >
            {claimCheck().text}
          </Button>
        )}
      {canReceiveAirdrop ? (
        <Button onClick={onClaim} className="w-full mt-2">
          {!isClaimStart ? (
            <div className="flex flex-row gap-2">
              Claim in <Countdown date={claimStartTime} />
            </div>
          ) : (
            'Claim Airdrop'
          )}
        </Button>
      ) : (
        <></>
      )}
      {Number(depositData?.claimedAmount) > 0 && (
        <div className="text-gradient font-medium mt-1">
          You claimed the token, check your wallet balance
        </div>
      )}
    </div>
  )
}
