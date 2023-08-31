import { Card } from '@/components'
import { Form } from './form'
import { Info } from './info'

export function LaunchPadDetails() {
  return (
    <Card className="grid gap-12 md:grid-cols-2 text-sm">
      <Info />
      <Form />
    </Card>
  )
}
