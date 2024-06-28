import React, { useState, useEffect, useContext } from 'react'
import { Table } from 'react-bootstrap'
import { usePDF } from 'react-to-pdf'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import styles from './opacidad.module.css'
import { ResultsContext } from '../../../contexts/ResultsContext'

export function OpacidadGraphic() {
  const [selectedTab, setSelectedTab] = useState(1)
  const [chartData, setChartData] = useState([])
  const [minx, setMinx] = useState(null)
  const [maxx, setMaxx] = useState(null)
  const [umbralNEstimulosAcertados, setUmbralNEstimulosAcertados] = useState(0)
  const COLORS = [
    '#FE3333',
    '#FE6433',
    '#FEA233',
    '#C0FE33',
    '#67FE33',
    '#5ED934',
    '#2CBF2E',
    '#04FF00',
  ]

  const { state } = useContext(ResultsContext)
  const { toPFD, targetRef } = usePDF()

  useEffect(() => {
    const max = Math.max(...state.graphic_open.NEstimulosAcertados)
    setUmbralNEstimulosAcertados(max / 2)
    const { CPD, indice, Contraste, NEstimulosAcertados } = state.graphic_open

    const chartData = indice.map((externalIndex, index) => ({
      Contraste: Contraste[index],
      Filtro: CPD[index],
      NEstimulosAcertados: NEstimulosAcertados[index],
      indice: parseInt(externalIndex) + 1,
    }))

    setChartData(chartData)
  }, [state.selected_test])

  useEffect(() => {
    const maxX = Math.max(...chartData.map((data) => data.Filtro))
    const minX = Math.min(...chartData.map((data) => data.Filtro))
    setMaxx(maxX)
    setMinx(minX)
  }, [chartData])

  return (
    <div className={styles.container} ref={targetRef}>
      {/* <button onClick={toPFD}>PDF</button> */}
      <h2 className={styles.title}>Resultados Sensibilidad al Contraste</h2>
      {/* <div className={styles.tabsContainer}>
        {[
          { text: 'Ojo Izquierdo', val: 1 },
          { text: 'Ojo Derecho', val: 2 },
          { text: 'Ambos Ojos', val: 3 },
        ].map((el) => (
          <button
            data-selected={selectedTab === el.val}
            key={el.val}
            className={styles.tab}
            onClick={() => setSelectedTab(el.val)}>
            {el.text}
          </button>
        ))}
      </div> */}

      <div className={styles.data}>
        <div className={styles.chart + ' ' + styles.container}>
          {chartData && (
            <ResponsiveContainer
              className={styles.chart}
              width='100%'
              height={400}>
              <ScatterChart
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  ticks={[1, 5, 10, 15, 20]}
                  type='number'
                  dataKey='Filtro'
                  name='filtro'
                  unit=''
                />
                <YAxis type='number' dataKey='indice' name='indice' unit='' />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name='A data' data={chartData}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[entry.NEstimulosAcertados % COLORS.length]}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className={styles.table + ' ' + styles.container}>
          <div className={styles.table + ' ' + styles.container}>
            {state.graphic_open && (
              <Table
                className={
                  styles.table + ' ' + styles.striped + ' ' + styles.border
                }>
                <thead>
                  <tr>
                    <th>Índice</th>
                    <th>CPD</th>
                    <th>Contraste</th>
                    <th>NEstimulos</th>
                    <th>NEstimulosAcertados</th>
                  </tr>
                </thead>
                <tbody>
                  {state.graphic_open['indice'].map((indexToShow, index) => {
                    const nEstimulosAcertados =
                      state.graphic_open.NEstimulosAcertados[index]
                    const isHighlighted =
                      nEstimulosAcertados > umbralNEstimulosAcertados
                    const rowClassName = isHighlighted ? 'highlighted-row' : ''
                    return (
                      <tr key={index} className={styles[rowClassName]}>
                        <td>{parseInt(indexToShow) + 1}</td>
                        <td>{state.graphic_open.CPD[index]}</td>
                        <td>
                          {parseFloat(
                            state.graphic_open.Contraste[index],
                          ).toFixed(2)}
                          %
                        </td>
                        <td>{state.graphic_open.NEstimulos[index]}</td>
                        <td>{nEstimulosAcertados}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
