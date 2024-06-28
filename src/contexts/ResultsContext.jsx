import { createContext, useReducer } from 'react'
import {
  RESULTS_INITIAL_STATE,
  ResultsReducer,
} from '../reducers/results-reducer'

export const ResultsContext = createContext(null)

export const ResultsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(ResultsReducer, RESULTS_INITIAL_STATE)

  return (
    <ResultsContext.Provider value={{ state, dispatch }}>
      {children}
    </ResultsContext.Provider>
  )
}
