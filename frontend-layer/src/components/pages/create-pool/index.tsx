import {
  Approve,
  Button,
  PercentageRow,
  PopupReject,
  PopupSuccess,
  PopupWaiting,
  TokenCard,
} from '@/components/core'
import { useCallback, useMemo, useState } from 'react'
import usePopupStore from '@/store/popup'
import { SelectBlock } from '@/components/core'
import { NativeCurrency, Token } from '@uniswap/sdk-core'
import { isNumber } from 'lodash'
import {
  useAddLiquidity,
  useGetBalance,
  usePairInfo,
  useSearchToken,
} from '@/hooks'
import { useWeb3React } from '@web3-react/core'
import { BsPlus } from 'react-icons/bs'
import { PriceAndPoolShare } from './price-and-pool-share'
import { ConfirmPopup } from './confirm-popup'
import { YourPoolPosition } from './your-pool-position'
import { useRouter } from 'next/router'

type PercentageType = number | 'max'

export const CreatePoolPage = () => {
  const { setOpen, setContent } = usePopupStore()

  const { connector } = useWeb3React()
  const router = useRouter()
  const [aValueInput, setAValueInput] = useState<string>()
  const [bValueInput, setBValueInput] = useState<string>()

  const aValue = useMemo(() => Number(aValueInput), [aValueInput])
  const bValue = useMemo(() => Number(bValueInput), [bValueInput])

  const initTokenA = useSearchToken(router.query.tokenA as string)
  const initTokenB = useSearchToken(router.query.tokenB as string)
  const [customTokenA, setTokenA] = useState<
    Token | NativeCurrency | undefined
  >(initTokenA)

  const [customTokenB, setTokenB] = useState<
    Token | NativeCurrency | undefined
  >(initTokenB)

  const tokenA = useMemo(
    () => customTokenA || initTokenA,
    [initTokenA, customTokenA]
  )

  const tokenB = useMemo(
    () => customTokenB || initTokenB,
    [initTokenB, customTokenB]
  )
  const ABalance = useGetBalance(tokenA)

  const pairInfo = usePairInfo(tokenA, tokenB)

  const [addTokenSuccess, setAddTokenSuccess] = useState(false)
  const poolRate = useMemo(() => {
    if (!pairInfo) return undefined

    return pairInfo.pairInfo.amount1 / pairInfo.pairInfo.amount0
  }, [pairInfo])

  const autoBValue = useMemo(() => {
    if (!isNumber(aValue) || !aValue || !poolRate) return undefined
    return aValue && poolRate ? Number(aValue * poolRate) : 0
  }, [aValue, poolRate])

  const [approvedA, setApprovedA] = useState(false)
  const [approvedB, setApprovedB] = useState(false)

  const [addLiquidity, { addable }] = useAddLiquidity(
    tokenA,
    tokenB,
    aValue,
    isNumber(autoBValue) ? autoBValue : bValue
  )

  const onPercentageClick = useCallback(
    (value: PercentageType) => {
      switch (value) {
        case 'max':
          setAValueInput(ABalance?.toString())
          break
        default:
          setAValueInput((((ABalance || 0) * value) / 100).toString())
          break
      }
    },
    [ABalance]
  )

  return (
    <>
      <TokenCard title={pairInfo ? 'Add liquidity' : 'Create pool'}>
        <PercentageRow<PercentageType>
          onChange={onPercentageClick}
          values={[25, 50, 75, 'max']}
        />
        <SelectBlock
          token={tokenA}
          onChange={(data) => {
            if (data?.token?.name === tokenB?.name) {
              setTokenB(tokenA)
            }
            setTokenA(data?.token)
          }}
          cost={0}
          onBalanceClick={(balance) => setAValueInput(balance.toString())}
          inputValue={aValueInput}
          onInputChange={setAValueInput}
        />

        <div className="flex w-full items-center justify-center p-4">
          <BsPlus className="text-xl" />
        </div>

        <SelectBlock
          token={tokenB}
          onChange={(data) => {
            if (data.token?.name === tokenA?.name) {
              setTokenA(tokenB)
            }
            setTokenB(data.token)
          }}
          onBalanceClick={(balance) => setBValueInput(balance.toString())}
          cost={0}
          inputValue={
            isNumber(autoBValue) ? autoBValue.toString() : bValueInput
          }
          onInputChange={!autoBValue ? setBValueInput : undefined}
          inputDisabled={!!pairInfo}
        />

        <PriceAndPoolShare
          className="mt-6"
          tokenA={tokenA}
          tokenB={tokenB}
          amountA={aValue}
          amountB={isNumber(autoBValue) ? autoBValue : bValue}
        />

        <div className="mt-8 flex flex-col gap-3">
          <Approve
            token={tokenA}
            value={aValue}
            onApprovalChange={(value) => setApprovedA(value)}
          />
          <Approve
            token={tokenB}
            value={bValue || autoBValue}
            onApprovalChange={(value) => setApprovedB(value)}
          />

          <Button
            type="primary"
            disabled={!(addable && approvedA && approvedB)}
            className="w-full"
            onClick={() => {
              setContent(
                <ConfirmPopup
                  tokenA={tokenA}
                  tokenB={tokenB}
                  amountA={aValue}
                  amountB={isNumber(autoBValue) ? autoBValue : bValue}
                  onConfirm={() => {
                    setContent(<PopupWaiting />)
                    addLiquidity()
                      .then((data) => {
                        setContent(
                          <PopupSuccess
                            transaction={data.hash}
                            title={'Transaction submitted'}
                          >
                            {pairInfo && !addTokenSuccess ? (
                              <Button
                                onClick={() =>
                                  pairInfo &&
                                  connector
                                    ?.watchAsset?.({
                                      address: pairInfo.address,
                                      symbol: pairInfo.symbol,
                                      decimals: pairInfo.decimals,
                                      image: '',
                                    })
                                    .then(() => setAddTokenSuccess(true))
                                    .catch((error) => setAddTokenSuccess(false))
                                }
                                className="w-full mt-4"
                                type="primary"
                              >
                                Add {pairInfo.symbol}
                              </Button>
                            ) : (
                              <></>
                            )}
                          </PopupSuccess>
                        )
                      })
                      .catch((error: Error) => {
                        setContent(
                          <PopupReject title={'Transaction rejected'} />
                        )
                      })
                  }}
                />
              )
              setOpen(true)
            }}
          >
            {pairInfo ? 'Supply' : 'Add'}
          </Button>
        </div>
      </TokenCard>

      <YourPoolPosition className="mt-4" tokenA={tokenA} tokenB={tokenB} />
    </>
  )
}
