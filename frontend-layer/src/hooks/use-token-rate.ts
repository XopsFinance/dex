import { useMemo } from 'react'

export const useTokenRate: (
  amountA?: number,
  amountB?: number
) => [APerB: string, BPerA: string] = (amountA, amountB) => {
  return useMemo(() => {
    if (!amountA || !amountB) return ['0', '0']
    const BPerA =
      amountB / amountA < 0.001
        ? '<0.001'
        : (amountB / amountA)?.toLocaleString()
    const APerB =
      amountA / amountB < 0.001
        ? '<0.001'
        : (amountA / amountB)?.toLocaleString()

    return [APerB, BPerA]
  }, [amountB, amountA])
}
