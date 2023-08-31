import moment, { Moment } from 'moment'
import { useState, useEffect } from 'react'

export const Countdown = ({ date = moment() }: { date?: Moment }) => {
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    const targetDate = date // January 1, 2024
    const interval = setInterval(() => {
      const now = moment()
      const duration = moment.duration(targetDate.diff(now))

      if (duration.asSeconds() <= 0) {
        clearInterval(interval)
        setCountdown('Expired')
      } else {
        const months = duration.months()
        const days = duration.days()
        const hours = duration.hours()
        const minutes = duration.minutes()
        const seconds = duration.seconds()

        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [date])

  return (
    <>
      <p>{countdown}</p>
    </>
  )
}
