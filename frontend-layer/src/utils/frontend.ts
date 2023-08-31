export const formatTransaction = (address: string) => {
  if (!address) return ''
  return (
    address.substring(0, 13) + '...' + address.substring(address.length - 16)
  )
}

export const debounce = <F extends (...params: any[]) => void>(
  func: F,
  timeout: number
) => {
  let timer: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

export const sleep = (delay: number) =>
  new Promise((resolve) => setTimeout(resolve, delay))
