// import styles from './dashboard.module.css'
import { AdminDashboardMenu } from '../dashboard/admin-dashboard-menu'

export function DashboardLayout({ children }) {
  return (
    <main>
      <AdminDashboardMenu />
      {children}
    </main>
  )
}
