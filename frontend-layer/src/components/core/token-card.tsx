type Props = {
  title: string
  children: React.ReactNode
}

export function TokenCard({ title, children }: Props) {
  return (
    <div className="max-w-md px-8 pb-12 mx-auto bg-dark-blue rounded-xl pt-7">
      <h1 className="text-xl font-bold">{title}</h1>
      {children}
    </div>
  )
}
