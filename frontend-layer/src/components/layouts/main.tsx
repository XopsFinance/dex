import classNames from 'classnames'
import { FooterLayout } from './footer'
import { HeaderLayout } from './header'
import styles from './main.module.scss'
import { Popup } from './popup'
type MainLayoutProps = {
  children: React.ReactNode
}

export const MainLayout = (props: MainLayoutProps) => {
  return (
    <div
      className={classNames([
        'flex flex-col items-center min-h-screen overflow-hidden',
        styles.background,
      ])}
    >
      <div className="bg-gradient2 z-10 flex flex-col justify-between w-full min-h-screen px-6">
        <HeaderLayout />
        <main className="w-full max-w-5xl mx-auto flex-1 ">
          {props.children}
        </main>
        <FooterLayout />
      </div>
      <Popup />
    </div>
  )
}
