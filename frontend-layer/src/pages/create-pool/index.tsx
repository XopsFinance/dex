import Head from 'next/head'

import { CreatePoolPage } from '@/components/pages'

export default function CreatePool() {
  return (
    <>
      <Head>
        <title>Create pool</title>
      </Head>
      <CreatePoolPage />
    </>
  )
}
