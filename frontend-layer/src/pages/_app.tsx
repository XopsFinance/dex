import { MainLayout } from '@/components'
import '@/styles/globals.scss'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Inter } from 'next/font/google'
import { Web3ReactProvider, initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'

import { useMemo } from 'react'

const queryClient = new QueryClient()

const inter = Inter({
  weight: ['400', '700', '800'],
  subsets: ['latin'],
})

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`)
}

export default function App({ Component, pageProps }: AppProps) {
  const connection = useMemo(
    () =>
      initializeConnector<MetaMask>(
        (actions) => new MetaMask({ actions, onError })
      ),
    []
  )

  return (
    <main className={inter.className}>
      <Web3ReactProvider
        connectors={[connection]}
        key={'Metamask' + Math.random.toString()}
      >
        <QueryClientProvider client={queryClient}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </QueryClientProvider>
      </Web3ReactProvider>
    </main>
  )
}
