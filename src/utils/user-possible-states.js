// Esto está hecho para saber si el usuario no está logeado o simplemente no se conoce su estado
// tendría state NOT_KNOWN cuando recién entra a la página y se está realizando el fetch a firebase

export const USER_POSSIBLE_STATES = {
  NOT_KNOWN: undefined,
  NOT_LOGGED: false,
}
