/* eslint-disable no-undef */
export const isProduction = process.env.NODE_ENV === 'production'

const API_URL = isProduction
  ? `${process.env.REACT_APP_API_URL}/api`
  : 'http://localhost:3000/api'

export const API_ADMIN_URL = `${API_URL}/user`
export const API_APPOINTMENTS = `${API_URL}/appointments`
export const API_PUBLIC_URL = `${API_URL}/public`
