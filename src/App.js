import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Footer } from './components/footer/footer'
import { Navbar } from './components/navbar/navbar'
import { Home } from './pages/Home/home'
import { Login } from './pages/Login/login'
import { ProtectedRoute } from './components/protected-route/protected-route'
import { USER_POSSIBLE_STATES } from './utils/user-possible-states'
import { DashboardLayout } from './components/layouts/DashboardLayout'
import { Pacientes } from './pages/Pacientes/Pacientes'
import { Asignacion } from './pages/Dashboard/asignacion/Asignacion'
import { Register } from './pages/Dashboard/register/Register'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Usuario } from './pages/Usuario/Usuario'
import { UserLayout } from './components/layouts/user-layout/user-layout'
import { Deberes } from './pages/Deberes/Deberes'
import { Resultados } from './pages/Resultados/resultados'
import { PasswordChange } from './components/modals/password-change/password-change'
import { ResultsContextProvider } from './contexts/ResultsContext'
import { Calendario } from './pages/Calendario/Calendario'
import { Appointment } from './pages/Appointment/Appointment'
import { useAppLogic } from './hooks/useAppLogic'
import { NotifAppointmentModal } from './components/modals/notif-appointment-modal/notif-appointment-modal'
import useAutoCloseSession from './hooks/useAutoCloseSession'
import { AutoLogoutModal } from './components/modals/auto-logout-modal/auto-logout-modal'
import { NotifCancelAppointmentModal } from './components/modals/notif-cancel-appointment-modal/notif-cancel-appointment-modal'
import { HabeasDataModal } from './components/modals/habeas-data-modal/habeas-data-modal'

function App() {
  const { closeNotif, user, notifModalShowing } = useAppLogic()
  const defaultCondition = user === USER_POSSIBLE_STATES.NOT_KNOWN

  return (
    <div className='App'>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />} />

        <Route
          path='/dashboard/asignacion'
          element={
            <ProtectedRoute
              condition={defaultCondition || user?.role === 'admin'}>
              <DashboardLayout>
                <Asignacion />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/dashboard/register'
          element={
            <ProtectedRoute
              condition={defaultCondition || user?.role === 'admin'}>
              <DashboardLayout>
                <Register />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path='/pacientes'
          element={
            <ProtectedRoute
              condition={
                defaultCondition ||
                user?.role === 'admin' ||
                user?.role === 'doctor'
              }>
              <Pacientes />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/paciente/:id'}
          element={
            <ProtectedRoute condition={true}>
              <UserLayout isRelative={true}>
                <Usuario />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={'/paciente/:id/pruebas-clinicas'}
          element={
            <ProtectedRoute condition={true}>
              <UserLayout isRelative={true}>
                <Deberes />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={'/paciente/:id/resultados'}
          element={
            <ProtectedRoute condition={true}>
              <UserLayout isRelative={true}>
                <ResultsContextProvider>
                  <Resultados />
                </ResultsContextProvider>
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={'/paciente/:id/calendario'}
          element={
            <ProtectedRoute condition={true}>
              <UserLayout isRelative>
                <Calendario isPatient />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={'/profesional/:id/calendario'}
          element={
            <ProtectedRoute condition={true}>
              <UserLayout isDoctor isRelative>
                <Calendario />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={'/:doctorId/:number/:appointmentId'}
          element={
            <ProtectedRoute condition={true}>
              <Appointment />
            </ProtectedRoute>
          }
        />
        <Route
          path={'/profesional/:id'}
          element={
            <ProtectedRoute condition={true}>
              <UserLayout isDoctor isRelative>
                <Usuario type='doctor' />
              </UserLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path={'/admin/:id'}
          element={
            <ProtectedRoute condition={true}>
              <Usuario type='admin' />
            </ProtectedRoute>
          }
        />
        <Route path='/Login' element={<Login />} />
      </Routes>
      <Footer />

      {notifModalShowing?.type === 'change-password' && (
        <PasswordChange closeModal={closeNotif} id={user.id} />
      )}

      {notifModalShowing && notifModalShowing.type === 'appointment' && (
        <NotifAppointmentModal
          closeModal={closeNotif}
          {...notifModalShowing.params}
        />
      )}
      {notifModalShowing &&
        notifModalShowing.type === 'postpone-appointment' && (
          <NotifAppointmentModal
            closeModal={closeNotif}
            isPostponement
            {...notifModalShowing.params}
          />
        )}
      {notifModalShowing && notifModalShowing.type === 'cancel-appointment' && (
        <NotifCancelAppointmentModal
          closeModal={closeNotif}
          {...notifModalShowing.params}
        />
      )}
      {notifModalShowing && notifModalShowing.type === 'habeas-data-login' && (
        <HabeasDataModal
          closeModal={closeNotif}
          {...notifModalShowing.params}
        />
      )}

      <AutoCloseComponentHandler />

      <ToastContainer
        position='top-right'
        autoClose={3000}
        limit={2}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme='colored'
      />
    </div>
  )
}

// Esto esta en otro componente y no en el app, porque el estado que se encarga de cerrar la sesión
// hace que todo el arbol de componentes se re-renderice, de esta forma lo evito.
export function AutoCloseComponentHandler() {
  const { isLogoutModalShowing, closeLogoutModal } = useAutoCloseSession({
    secondsToLogout: 60 * 5,
  })

  if (isLogoutModalShowing)
    return (
      <>
        <AutoLogoutModal closeModal={closeLogoutModal} />
      </>
    )

  return null
}

export default App
