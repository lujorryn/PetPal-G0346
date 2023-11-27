import { Outlet } from 'react-router-dom'

import Header from '../Header'
import Footer from '../Footer'

import styles from './Layout.module.css'

function Layout() {

  return (
    <div className={styles.wrapper}>
      <Header />
      <main><Outlet /></main>
      <Footer />
    </div>
  )
}

export default Layout