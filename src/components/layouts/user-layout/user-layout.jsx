import { Link, useLocation, useParams } from 'react-router-dom'
import styles from './user-layout.module.css'
import { useMemo } from 'react'

const renders = {
  paciente: ({ routesMatches, isRelative, id }) => (
    <>
      <Link
        className={`${styles.menuEntry} ${
          routesMatches.resultados ? styles.selected : ''
        }`}
        to={`/paciente/${isRelative ? `${id}/` : ''}resultados`}>
        Resultados
      </Link>
      <Link
        className={`${styles.menuEntry} ${
          routesMatches.pruebas ? styles.selected : ''
        }`}
        to={`/paciente/${isRelative ? `${id}/` : ''}pruebas-clinicas`}>
        Pruebas Clínicas
      </Link>
      <Link
        className={`${styles.menuEntry} ${
          routesMatches.perfil ? styles.selected : ''
        }`}
        to={`/paciente${isRelative ? `/${id}` : ''}`}>
        Perfil
      </Link>
      <Link
        className={`${styles.menuEntry} ${
          routesMatches.calendario ? styles.selected : ''
        }`}
        to={`/paciente/${isRelative ? `${id}/` : ''}calendario`}>
        Calendario de citas
      </Link>
    </>
  ),
  doctor: ({ routesMatches, isRelative, id }) => (
    <>
      <Link
        className={`${styles.menuEntry} ${
          routesMatches.perfil ? styles.selected : ''
        }`}
        to={`/profesional${isRelative ? `/${id}` : ''}`}>
        Perfil
      </Link>
      <Link
        className={`${styles.menuEntry} ${
          routesMatches.calendario ? styles.selected : ''
        }`}
        to={`/profesional/${isRelative ? `${id}/` : ''}calendario`}>
        Calendario de citas
      </Link>
    </>
  ),
}

export function UserLayout({ children, isRelative = false, isDoctor = false }) {
  const location = useLocation()
  const params = useParams()

  const routesMatches = useMemo(() => {
    return isRelative
      ? {
          resultados:
            location.pathname ===
            `/${isDoctor ? 'profesional' : 'paciente'}/${params.id}/resultados`,
          pruebas:
            location.pathname ===
            `/${isDoctor ? 'profesional' : 'paciente'}/${
              params.id
            }/pruebas-clinicas`,
          perfil:
            location.pathname ===
            `/${isDoctor ? 'profesional' : 'paciente'}/${params.id}`,
          calendario:
            location.pathname ===
            `/${isDoctor ? 'profesional' : 'paciente'}/${params.id}/calendario`,
        }
      : {}
  }, [isRelative, location, params])

  return (
    <>
      <header className={styles.menu}>
        {renders[isDoctor ? 'doctor' : 'paciente']({
          routesMatches,
          isRelative,
          id: params.id,
        })}
      </header>
      {children}
    </>
  )
}
