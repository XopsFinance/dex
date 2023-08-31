import {
  Approve,
  Button,
  OutputRow,
  PercentageRow,
  PopupReject,
  PopupSuccess,
  PopupWaiting,
  SwapButton,
  TokenCard,
} from '@/components/core'
import usePopupStore from '@/store/popup'
import { SelectBlock } from '@/components/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { TokenData } from '@/constants'
import { usePairInfo, useSwapTokens, useTokenRate } from '@/hooks'
import { cloneDeep, isFunction, isNumber } from 'lodash'

const QuickTokenAValue = [25, 50, 75, 'max', 'reset'] // percentage
const SlippageValue = [0.2, 0.5, 1.0, 2.0]

export const SwapPage = () => {
  const { setOpen, setContent } = usePopupStore()

  const [tokenA, setTokenA] = useState<TokenData>()
  const [aValueInput, setAValueInput] = useState<string>()
  const [tokenB, setTokenB] = useState<TokenData>()
  const [bValueInput, setBValueInput] = useState<string>()

  const aValue = useMemo(() => Number(aValueInput), [aValueInput])
  const bValue = useMemo(() => Number(bValueInput), [bValueInput])
  const [approvedA, setApprovedA] = useState(false)
  const [slippage, setSlippage] = useState<number>()
  const [swap, { data: swapData, loading: swapLoading }] = useSwapTokens(
    tokenA?.token,
    tokenB?.token,
    aValue,
    bValue,
    slippage
  )

  const poolInfo = usePairInfo(tokenA?.token, tokenB?.token)
  const tokenRate = useTokenRate(
    poolInfo?.pairInfo.amount0,
    poolInfo?.pairInfo.amount1
  )

  const onSelectValueA = useCallback(
    (percentage: (typeof QuickTokenAValue)[number]) => {
      let selected
      switch (percentage) {
        case 'max':
          selected = 100
          break
        case 'reset':
          selected = 0
          break
        default:
          selected = percentage || 0
          break
      }

      if (tokenA?.balance)
        setAValueInput(
          (((selected as number) / 100) * tokenA?.balance).toString()
        )
    },
    [tokenA?.balance]
  )

  const onSlippageChange = useCallback((value: number) => {
    if (isNumber(Number(value))) setSlippage(value)
    else setSlippage(undefined)
  }, [])

  const onSwapButtonClick = useCallback(() => {
    const tempToken = cloneDeep(tokenA)
    setTokenA(tokenB)
    setTokenB(tempToken)

    const tempValue = cloneDeep(aValueInput)
    setAValueInput(bValueInput)
    setBValueInput(tempValue)
  }, [aValueInput, bValueInput, tokenA, tokenB])

  const onSwap = useCallback(() => {
    setOpen(true)
    setContent(<PopupWaiting />)
    swap?.()
      .then((data) =>
        setContent(
          <PopupSuccess title="Swap Submitted" transaction={data?.hash} />
        )
      )
      .catch((err) => {
        console.log('err :>> ', err)
        setContent(<PopupReject title="Swap Rejected" />)
      })
  }, [setContent, setOpen, swap])

  const overPool = useMemo(() => {
    if (aValue && poolInfo) return aValue >= poolInfo?.pairInfo.amount0

    return false
  }, [aValue, poolInfo])

  useEffect(() => {
    aValue &&
      setBValueInput(
        (
          aValue *
          (poolInfo
            ? poolInfo?.pairInfo.amount1 / poolInfo?.pairInfo.amount0
            : 0)
        ).toString()
      )
  }, [aValue, poolInfo, poolInfo?.pairInfo.amount0, poolInfo?.pairInfo.amount1])

  return (
    <TokenCard title="Exchange Token">
      <PercentageRow onChange={onSelectValueA} values={QuickTokenAValue} />
      <SelectBlock
        token={tokenA?.token}
        onInputChange={setAValueInput}
        onChange={setTokenA}
        onBalanceClick={(bal) => setAValueInput(bal.toString())}
        inputValue={aValueInput}
      />
      <SwapButton onClick={onSwapButtonClick} />
      <SelectBlock
        token={tokenB?.token}
        onInputChange={setBValueInput}
        onChange={setTokenB}
        onBalanceClick={(bal) => setBValueInput(bal.toString())}
        inputValue={bValueInput}
      />
      {tokenA && tokenB && (
        <div className="px-4 py-3 mt-4 text-xs font-semibold border border-dark-grey rounded-xl">
          {tokenB ? '1' : '-'} {tokenB?.token?.symbol} = {tokenRate[0] || '-'}{' '}
          {tokenA?.token?.symbol || '-'}{' '}
          {/* <span className="inline-block ml-2 font-normal text-darker-grey text-2xs">
            ($-)
          </span> */}
        </div>
      )}
      <div className="pt-4">
        <OutputRow
          title="Minimum Output"
          amount={`${
            bValue
              ? ((bValue * (100 - (slippage || 1))) / 100).toLocaleString()
              : '0.00'
          } ${tokenB?.token?.symbol || ''}`}
        />
        <OutputRow
          title="Expected Output"
          amount={`${bValue ? bValue.toLocaleString() : '0.00'} ${
            tokenB?.token?.symbol || ''
          }`}
        />
        <OutputRow
          title="Slippage"
          amount={slippage ? slippage + '%' : 'Auto'}
        />
      </div>
      <PercentageRow<number>
        value={slippage}
        onChange={onSlippageChange}
        values={SlippageValue}
        title="Slippage:"
        custom={true}
      />

      <div className="mt-8 flex gap-3 flex-col">
        <Approve
          token={tokenA?.token}
          value={aValue}
          onApprovalChange={setApprovedA}
        />
        <Button
          disabled={!isFunction(swap) || overPool || !approvedA}
          onClick={onSwap}
          type="primary"
          className="w-full capitalize"
        >
          {overPool ? 'Insufficient Liquidity' : 'Swap'}
        </Button>
      </div>
    </TokenCard>
  )
}
