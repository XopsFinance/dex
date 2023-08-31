import classNames from 'classnames'
import styles from './button.module.scss'

type Props<T> = {
  isActive?: boolean
  handleClick: () => void
  text: T
}

export function PercentageButton<T extends React.ReactNode>({
  isActive = false,
  handleClick,
  text,
}: Props<T>) {
  const classes = classNames(styles.button, { active: isActive })

  return (
    <button onClick={handleClick} className={classes}>
      {text}
    </button>
  )
}
