import React from 'react'
import { MenuDashboardPaciente } from './menuDashboardPaciente'
import '../../styles/dashBoardPaciente/dashboard/dashboardInner.css'

export function Terapias() {
  return (
    <React.Fragment>
      <div className='row'>
        <div className='col-2'>
          <MenuDashboardPaciente />
        </div>
        <div className='col-10'>
          <div className='interior-dashboard'>
            <h2>Terapias</h2>
            <p>Links de terapias</p>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
