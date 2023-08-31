import { useAllowance, useApproval, useContractRouter } from '@/hooks'
import { Button } from './button'
import { NativeCurrency, Token } from '@uniswap/sdk-core'
import { useCallback, useEffect, useState } from 'react'
import { useQuery } from 'react-query'

export type ApprovalSectionProps = {
  token?: Token | NativeCurrency
  value?: number // amount to approve
  onApprovalChange?: (approval: boolean) => void
}
export const Approve = (props: ApprovalSectionProps) => {
  const { token, value, onApprovalChange } = props
  const router = useContractRouter()
  const [loading, setLoading] = useState(false)
  const [approve, { loading: approveLoading }] = useApproval(
    token,
    undefined,
    router?.address
  )

  const [getAllowance] = useAllowance(token, router?.address)

  const checkNeedGetAllowance = useCallback(
    (allowance?: number) => {
      const need = !(
        (value && allowance && allowance >= value) ||
        token?.isNative ||
        !value
      )

      if (!need) {
        onApprovalChange?.(true)
      } else onApprovalChange?.(false)

      return need
    },
    [onApprovalChange, token?.isNative, value]
  )

  const { data: allowance } = useQuery<number>(
    `getAllowance:${token?.symbol}`,
    getAllowance,
    {
      refetchInterval: (data) => (checkNeedGetAllowance(data) ? 5000 : false),
    }
  )

  if (!checkNeedGetAllowance(allowance)) {
    return null
  }

  return (
    <Button
      loading={loading || approveLoading}
      onClick={() =>
        approve().then(() => {
          setLoading(true)
          setTimeout(() => setLoading(false), 60000)
        })
      }
      className="w-full"
      type="primary"
    >
      Approve {token?.symbol}
    </Button>
  )
}
