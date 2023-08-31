import {
  Approve,
  Button,
  PercentageRow,
  PopupReject,
  PopupSuccess,
  PopupWaiting,
  RedeemAmountBlock,
  RedeemOutput,
  RedeemSelectBlock,
  TokenCard,
} from '@/components/core'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useMemo, useState } from 'react'
import usePopupStore from '@/store/popup'
import { useRouter } from 'next/router'
import {
  useAllowance,
  useContractRouter,
  usePairInfo,
  useRemoveLiquidity,
  useSearchToken,
} from '@/hooks'
import { NativeCurrency, Token } from '@uniswap/sdk-core'
import { YourPoolPosition } from '../create-pool/your-pool-position'
import { HiArrowDown } from 'react-icons/hi'

export const RemovePoolPage = () => {
  const router = useRouter()
  const { account } = useWeb3React()
  const { tokenA: tokenAAddress, tokenB: tokenBAddress } = useMemo(() => {
    return router.query || {}
  }, [router])

  const { setOpen, setContent } = usePopupStore()

  const tokenA = useSearchToken(tokenAAddress as string)
  const tokenB = useSearchToken(tokenBAddress as string)
  const [customPair, setCustomPair] =
    useState<(Token | NativeCurrency | undefined)[]>()

  const tokenPair = useMemo(() => {
    return tokenAAddress && tokenBAddress ? [tokenA, tokenB] : customPair
  }, [customPair, tokenA, tokenAAddress, tokenB, tokenBAddress])

  const [removePercentageInput, setRemovePercentageInput] = useState<string>()
  const pairInfo = usePairInfo(
    customPair ? customPair[0] : tokenA,
    customPair ? customPair[1] : tokenB,
    account
  )
  const removePercentage = useMemo(() => {
    return Number(removePercentageInput)
  }, [removePercentageInput])

  const pairToken = useSearchToken(pairInfo?.address, false)
  const [approval, setApproval] = useState(false)

  const removeAmount = useMemo(() => {
    const balance = pairInfo?.pairInfo.balance
    if (!balance) return

    return (balance * removePercentage) / 100
  }, [pairInfo?.pairInfo.balance, removePercentage])

  const items = useMemo(() => {
    return [
      {
        token: tokenPair?.[0],
        value: (removePercentage * (pairInfo?.pairInfo.amount0 || 0)) / 100,
      },
      {
        token: tokenPair?.[1],
        value: (removePercentage * (pairInfo?.pairInfo.amount1 || 0)) / 100,
      },
    ]
  }, [
    pairInfo?.pairInfo.amount0,
    pairInfo?.pairInfo.amount1,
    removePercentage,
    tokenPair,
  ])

  const [removeLiquidity, { loading }] = useRemoveLiquidity({
    tokenA: (tokenPair?.[0]?.isNative
      ? tokenPair?.[0].wrapped
      : tokenPair?.[0]) as Token,
    tokenB: (tokenPair?.[1]?.isNative
      ? tokenPair?.[1].wrapped
      : tokenPair?.[1]) as Token,
    amountA: items?.[0].value,
    amountB: items?.[1].value,
    liquidity: removeAmount,
  })

  //Example of opening popup
  const handleApprove = () => {
    setOpen(true)
    setContent(<PopupWaiting />)
    removeLiquidity()
      .then((data) => {
        setContent(
          <PopupSuccess title={'Removing Liquidity'} transaction={data.hash} />
        )
      })
      .catch((err) => {
        setContent(<PopupReject title="Transaction Rejected" />)
      })
  }

  return (
    <>
      <TokenCard title="Remove Liquidity">
        <div className="mt-6" />
        <RedeemSelectBlock
          value={tokenA && tokenB ? [tokenA, tokenB] : undefined}
          onChange={setCustomPair}
        />
        <PercentageRow
          onChange={(value) =>
            setRemovePercentageInput(value === 'max' ? '100' : value.toString())
          }
          values={[25, 50, 75, 'max']}
          title="Remove amount:"
        />
        <RedeemAmountBlock
          value={removePercentageInput}
          onChange={(value) => {
            if (Number(value) > 100) setRemovePercentageInput('100')
            else setRemovePercentageInput(value)
          }}
          title="Remove Amount (%)"
          postfix="%"
        />
        <HiArrowDown className="text-center w-full mt-4" />
        <RedeemOutput title="Output" items={items} />

        <div className="mt-8 flex flex-row flex-wrap gap-4">
          <Approve
            onApprovalChange={setApproval}
            value={removeAmount}
            token={pairToken}
          />
          <Button
            disabled={!approval}
            type="primary"
            className="flex-1"
            onClick={handleApprove}
            loading={loading}
          >
            Remove
          </Button>
        </div>
      </TokenCard>
      <YourPoolPosition
        className="mt-4"
        tokenA={customPair ? customPair[0] : tokenA}
        tokenB={customPair ? customPair[1] : tokenB}
      />
    </>
  )
}
