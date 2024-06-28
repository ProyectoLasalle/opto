import { Link } from 'react-router-dom'

export function PacienteRowActions({ handleDeleteClick, id }) {
  return (
    <>
      <Link to={`/user/${id}`}></Link>
      <button onClick={handleDeleteClick}></button>
    </>
  )
}
