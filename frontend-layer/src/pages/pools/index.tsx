import Head from 'next/head'

import { PoolsPage } from '@/components/pages'

export default function Pools() {
  return (
    <>
      <Head>
        <title>Pools</title>
      </Head>
      <PoolsPage />
    </>
  )
}
