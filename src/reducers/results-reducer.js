export const RESULTS_INITIAL_STATE = {
  selected_test: {
    name: null,
    key: null,
  },
  data: {
    loading: null,
    error: null,
    data: null,
  },
  graphic_open: false,
  notes_open: {
    open: false,
    row_data: null,
  },
  write_open: {
    open: false,
    row_data: null,
  },
  delete_open: {
    open: false,
    row_data: null,
  },
  deleting: false,
}

export function ResultsReducer(state, action) {
  switch (action.type) {
    case 'setData':
      return {
        ...state,
        data: { error: null, loading: false, data: action.payload },
      }
    case 'setDataError':
      return {
        ...state,
        data: { error: action.payload, loading: false, data: null },
      }

    case 'openGraphic':
      return { ...state, graphic_open: action.payload }
    case 'closeGraphic':
      return { ...state, graphic_open: null }

    case 'openWrite':
      return { ...state, write_open: { open: true, row_data: action.payload } }
    case 'closeWrite':
      return { ...state, write_open: { open: false, row_data: null } }
    case 'closeDelete':
      return { ...state, delete_open: { open: false, row_data: null } }

    case 'openNotes':
      return { ...state, notes_open: { open: true, row_data: action.payload } }
    case 'closeNotes':
      return { ...state, notes_open: { open: false, row_data: null } }
    case 'openDelete':
      return { ...state, delete_open: { open: true, row_data: action.payload } }

    case 'setPreferencial':
      return {
        ...state,
        selected_test: {
          ...state.selected_test,
          name: 'preferencial',
          key: 'Terapia1',
        },
        data: { ...state.data, loading: true },
      }
    case 'setContraste':
      return {
        ...state,
        selected_test: {
          ...state.selected_test,
          name: 'contraste',
          key: 'Terapia2',
        },
        data: { ...state.data, loading: true },
      }
    case 'setPreferencialError':
      return {
        ...state,
        selected_test: { ...state.selected_test, error: action.payload },
      }
    case 'setContrasteError':
      return {
        ...state,
        selected_test: { ...state.selected_test, error: action.payload },
      }

    case 'deleteResult': {
      const deleteResultTestId = action.payload
      return {
        ...state,
        data: {
          ...state.data,
          data:
            state.data.data?.filter((el) => el.id !== deleteResultTestId) || [],
        },
      }
    }

    case 'addNote':
      const addNoteTestId = action.payload.id
      const addNoteTestIndex = state.data.data?.findIndex(
        (el) => el.id === addNoteTestId,
      )
      if (addNoteTestIndex === (-1 || undefined)) return state

      const addNoteState = { ...state }
      addNoteState.data.data[addNoteTestIndex].notes = addNoteState.data.data[
        addNoteTestIndex
      ].notes?.concat(action.payload.newNote) || [action.payload.newNote]

      return addNoteState

    case 'removeNote':
      const removeNoteTestId = action.payload.id
      const removeNoteTestIndex = state.data.data?.findIndex(
        (el) => el.id === removeNoteTestId,
      )
      if (removeNoteTestIndex === (-1 || undefined)) return state

      const removeNoteState = { ...state }
      removeNoteState.data.data[removeNoteTestIndex].notes =
        removeNoteState.data.data[removeNoteTestIndex].notes?.filter(
          (el) => el.date !== action.payload.note.date,
        ) || []

      return removeNoteState

    case 'openDeleting':
      return {
        ...state,
        deleting: action.payload,
      }
    case 'closeDeleting':
      return {
        ...state,
        deleting: false,
      }

    default:
      return state
  }
}
