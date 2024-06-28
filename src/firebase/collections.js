import { collection } from 'firebase/firestore'
import { db } from './config'

export const doctorsCollection = collection(db, 'doctors')
export const patientsCollection = collection(db, 'patients')
export const adminCollection = collection(db, 'admins')
export const appointmentsCollection = collection(db, 'appointments')
