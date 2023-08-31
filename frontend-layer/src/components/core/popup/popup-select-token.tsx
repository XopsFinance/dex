import { TokenData } from '@/constants'
import { useCommonToken, useSearchToken } from '@/hooks'
import { debounce, isEmpty } from 'lodash'
import { ChangeEvent, useEffect, useState } from 'react'
import { TokenIcon } from '../token-icon'
import { NativeCurrency, Token } from '@uniswap/sdk-core'
import { useGetBalance } from '@/hooks/use-get-balance'
import { useWeb3React } from '@web3-react/core'
import { ConnectWalletButton } from '@/components/containers'

type TokenRowType = {
  token?: Token | NativeCurrency
  onClick?: (data: TokenData) => void
}

const TokenRow = (props: TokenRowType) => {
  const { token, onClick } = props
  const { name, symbol } = token || {}

  const balance = useGetBalance(token)

  return (
    <button
      onClick={() => onClick?.({ token, balance })}
      className="flex items-center justify-between w-full text-xs font-bold text-left"
    >
      <div className="flex items-center gap-2">
        <TokenIcon token={token} />
        <div>
          <p className="uppercase text-2xs text-darker-grey">{symbol}</p>
          <p className="font-bold">{name}</p>
        </div>
      </div>
      <p>{balance?.toLocaleString() || '-'}</p>
    </button>
  )
}

type PopupSelectTokenType = {
  onSelect?: (data: TokenData) => void
}

export function PopupSelectToken(props: PopupSelectTokenType) {
  const { onSelect } = props
  const { account } = useWeb3React()
  const [searchToken, setSearchToken] = useState<string>('')
  const [searchedTokens, setSearchedTokens] =
    useState<(Token | NativeCurrency)[]>()

  const selectToken = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchToken(event.target.value)
  }
  const commonTokens = useCommonToken()
  const newToken = useSearchToken(searchToken)
  //Add debounce to reduce api calls
  const handleChange = debounce(selectToken, 300)

  useEffect(() => {
    if (searchToken) {
      const filtered = commonTokens.filter((token) => {
        const wrapped = token.isNative ? token.wrapped : token
        return (
          wrapped.name
            ?.toLocaleLowerCase()
            .includes(searchToken.toLowerCase()) ||
          wrapped.symbol
            ?.toLocaleLowerCase()
            .includes(searchToken.toLowerCase()) ||
          wrapped.address.includes(searchToken)
        )
      })
      setSearchedTokens(isEmpty(filtered) ? undefined : filtered)
    } else setSearchedTokens(undefined)
  }, [commonTokens, searchToken])

  return (
    <div className="px-4 pt-6 pb-8 min-w-xl">
      <p className="text-xl font-extrabold">Select a token</p>

      {account ? (
        <>
          <input
            type="text"
            className="w-full px-4 py-3 mt-6 border outline-none border-very-dark-blue rounded-xl bg-very-dark-blue focus:border-pink"
            placeholder="Search name or paste address"
            onChange={handleChange}
          />
          <div className="flex flex-col gap-5 p-5 mt-4 overflow-auto bg-very-dark-blue scrollbar rounded-xl max-h-80">
            {(searchedTokens || commonTokens || [newToken])?.map(
              (token, index) => {
                return <TokenRow onClick={onSelect} key={index} token={token} />
              }
            )}
          </div>
        </>
      ) : (
        <div className="mt-4">
          <ConnectWalletButton />
        </div>
      )}
    </div>
  )
}
