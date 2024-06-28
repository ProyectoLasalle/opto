import React, { useState, useEffect, useMemo, useContext } from 'react'
import { Table } from 'react-bootstrap'
import styles from './preferencial.module.css'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ResultsContext } from '../../../contexts/ResultsContext'
import { usePDF, Margin } from 'react-to-pdf'
import { DownloadIcon } from '../../icons/download'

export function PreferencialGraphic() {
  const [selectedTab, setSelectedTab] = useState(1)
  const [processedData, setProcessedData] = useState([])
  const [chartData, setChartData] = useState([])
  const [vAndR, setVAndR] = useState({})
  const [highest, setHighest] = useState(null)

  const { state } = useContext(ResultsContext)

  const document = useMemo(() => {
    const data = state.graphic_open[selectedTab]

    const entries = Object.entries(data).sort()
    let v_raw_values = entries.filter(([key]) => key.startsWith('v'))
    let r_raw_values = entries.filter(([key]) => key.startsWith('R'))

    const parsedV = v_raw_values.map(([vKey, vArray], index) => {
      const [, rArray] = r_raw_values[index]

      return [
        vKey,
        vArray.map((el, i) => {
          const text = el === 1 ? 'IZQ' : el === 2 ? 'DER' : 'NN'
          if (el === rArray[i])
            return { text, backgroundColor: 'green', number: el }
          return { text, style: { backgroundColor: 'red' }, number: el }
        }),
      ]
    })
    const parsedR = r_raw_values.map(([rKey, rArray], index) => {
      const [, vArray] = v_raw_values[index]

      return [
        rKey,
        rArray.map((el, i) => {
          const text = el === 1 ? 'IZQ' : el === 2 ? 'DER' : 'NN'
          if (el === vArray[i])
            return { text, backgroundColor: 'green', number: el }
          return { text, style: { backgroundColor: 'red' }, number: el }
        }),
      ]
    })

    const newData = {
      id: data.id,
      CPCM: data.CPCM,
      CPD: data.CPD,
    }

    parsedV.forEach(([vKey, vValue], index) => {
      const [rKey, rValue] = parsedR[index]
      newData[vKey] = vValue
      newData[rKey] = rValue
    })

    return newData
  }, [selectedTab])

  useEffect(() => {
    if (document && Object.keys(document).length > 0) {
      const { CPCM, CPD, ...rest } = document

      const vKeys = Object.keys(rest).filter((key) => key.startsWith('v'))
      const v1 = Object.values(rest).find((value) => Array.isArray(value))

      let processedRows = []
      if (v1) {
        processedRows = v1.map((_, index) => {
          let coincidenceCount = 0

          vKeys.forEach((vKey) => {
            if (
              rest[vKey][index]?.number ===
              rest[`R${vKey.substring(1)}`][index]?.number
            ) {
              coincidenceCount++
            }
          })

          return {
            index: index + 1,
            coincidenceCount,
            CPCM: CPCM[index],
            CPD: CPD[index],
          }
        })

        for (let i = processedRows.length - 1; i >= 0; i--) {
          const halfCount = (Object.keys(rest).length - 2) / 2 / 2
          if (halfCount <= processedRows[i].coincidenceCount) {
            setHighest(processedRows[i])
            break
          }
        }
      }
      const chartData = (processedRows || []).map((_, index) => ({
        index: index + 1,
        CPCM: CPCM[index],
        coincidenceCount: processedRows[index]['coincidenceCount'],
      }))

      setVAndR(rest)
      setProcessedData(processedRows)
      setChartData(chartData)
    }
  }, [document])

  const CustomizedDot = (props) => {
    const { cx, cy, payload } = props
    const coincidenceCount = payload.coincidenceCount
    let fill
    if (coincidenceCount === 0) {
      fill = '#FE3333'
    } else if (coincidenceCount === 1) {
      fill = '#FE6433'
    } else if (coincidenceCount === 2) {
      fill = '#FEA233'
    } else if (coincidenceCount === 3) {
      fill = '#C0FE33'
    } else if (coincidenceCount === 4) {
      fill = '#67FE33'
    } else if (coincidenceCount === 5) {
      fill = '#5ED934'
    } else if (coincidenceCount === 6) {
      fill = '#2CBF2E'
    } else if (coincidenceCount === 7) {
      fill = '#04FF00 '
    } else {
      fill = 'white'
    }

    return <circle cx={cx} cy={cy} r={2} stroke={fill} strokeWidth={3} />
  }

  const { toPDF, targetRef } = usePDF({
    filename: 'resultados.pdf',
    page: { margin: Margin.MEDIUM, format: 'A4' },
  })

  const handlePDF = async () => {
    await new Promise((res) => setTimeout(res, 350))
    toPDF({})
  }

  return (
    <div className={styles.App}>
      <div className={styles.tabsContainer}>
        {[{ val: 1 }, { val: 2 }, { val: 3 }].map((el) => (
          <button
            data-selected={selectedTab === el.val}
            key={el.val}
            className={styles.tab}
            onClick={() => setSelectedTab(el.val)}>
            {state.graphic_open[el.val]?.Prueba ?? el.val}
          </button>
        ))}
        <button className={styles.downloadIcon} onClick={handlePDF}>
          <DownloadIcon style={{ height: 25, width: 25 }} />
          <span>PDF</span>
        </button>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
        ref={targetRef}>
        <h2 className={styles.title}>Resultados Mirada Preferencial</h2>

        <div className={styles.content}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row-reverse',
            }}>
            {highest && (
              <div
                style={{
                  margin: '15px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}>
                <h4>Indice de agudeza visual</h4>
                <Table
                  className={
                    styles.table + ' ' + styles.striped + ' ' + styles.bordere
                  }>
                  <thead>
                    <tr>
                      <td>CPD</td>
                      <td>CPCM</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          padding: '15px 20px',
                          color: 'white',
                          backgroundColor: 'green',
                        }}>
                        {highest.CPD.toFixed(3)}
                      </td>
                      <td
                        style={{
                          padding: '15px 20px',
                          color: 'white',
                          backgroundColor: 'green',
                        }}>
                        {highest.CPCM}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            )}
            {chartData && (
              <div className={styles.chartContainer}>
                <ResponsiveContainer
                  className={styles.chart}
                  width='100%'
                  height={400}>
                  <LineChart
                    key={Date.now()} // Asegúrate de que este componente se vuelva a renderizar cuando los datos cambien
                    width={500}
                    height={300}
                    data={chartData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='index' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type='monotone'
                      dataKey='CPCM'
                      stroke='#8884d8'
                      dot={<CustomizedDot />}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
        <div
          className={styles.tableContainer}
          style={{ position: 'relative', overflow: 'auto', width: '100%' }}>
          {document && (
            <Table
              className={
                styles.table + ' ' + styles.striped + ' ' + styles.bordere
              }>
              <thead>
                <tr>
                  <th>Índice</th>
                  {(Object.keys(document) || []).map((column) => {
                    if (column !== 'id' && column !== 'idd') {
                      return (
                        <th key={column} style={{ textTransform: 'uppercase' }}>
                          {column}
                        </th>
                      )
                    } else {
                      return null
                    }
                  })}
                </tr>
              </thead>
              <tbody>
                {/* 
                  Array.from crea un array del tamaño de v1, porque hay que generar la cantidad de rows que tengan los
                  campos, y de ahí sacar las columnas
                */}
                {Array.from(
                  { length: (document?.v1 || []).length },
                  (_, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      {(Object.entries(document) || []).map(
                        ([column, data]) => {
                          if (column === 'id' || column === 'idd') return null
                          const value = Array.isArray(data) ? data[index] : ''

                          if (column === 'CPD' && typeof value === 'number') {
                            const roundedValue = value.toFixed(3)
                            return <td key={column}>{roundedValue}</td>
                          } else if (
                            [
                              'v1',
                              'v2',
                              'v3',
                              'v4',
                              'v5',
                              'R1',
                              'R2',
                              'R3',
                              'R4',
                              'R5',
                            ].includes(column)
                          ) {
                            return (
                              <td
                                key={column}
                                style={{
                                  color: 'white',
                                  backgroundColor: 'green',
                                  ...value.style,
                                }}>
                                {value.text}
                              </td>
                            )
                          }
                          return <td key={column}>{value}</td>
                        },
                      )}
                    </tr>
                  ),
                )}
              </tbody>
            </Table>
          )}
        </div>
        <span style={{ fontSize: 12, textAlign: 'center', marginBottom: 12 }}>
          &ldquo;DER&ldquo; Corresponden a los resultados del estímulo derecho,
          &ldquo;IZQ&ldquo; corresponden a los del estímulo izquierdo y
          &ldquo;NN&ldquo; no se pudo identificar
          <br></br>
          Color verde corresponde que hay coincidencia y color rojo corresponde
          que no hay.
        </span>

        <div className={styles.tableContainer}>
          {document && (
            <div>
              <Table className={styles.table} striped bordered>
                <thead>
                  <tr>
                    <th>Índice</th>
                    <th>Coincidencias</th>
                    <th>CPCM</th>
                    <th>CPD</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    (Array.isArray(processedData) ? processedData : []) || []
                  ).map((row) => {
                    const halfCount = (Object.keys(vAndR).length - 2) / 2 / 2

                    return (
                      <tr
                        key={row.index}
                        className={
                          row.coincidenceCount >= halfCount
                            ? styles.greenRow
                            : ''
                        }>
                        <td>{row.index}</td>
                        <td>{row.coincidenceCount}</td>
                        <td>{row.CPCM}</td>
                        <td>{row.CPD.toFixed(3)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
