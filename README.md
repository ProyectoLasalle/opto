# Optometría La Salle

## Estructuración del proyecto

### API:

La página tiene una API hecha en Vercel, una serverless function, que se encarga de hacer las operaciones de admin, como crear usuarios y cambiarles el custom-claim (POST), cambiar emails (PUT), borrar usuarios (DELETE) y cambiar contraseñas (PATCH).

### Layouts:

La página está hecha con `react-router-dom`, se pueden ver todas las rutas desde el archivo `app`, las diferentes rutas tienen layouts, hay 2 tipos de layout (que están en la carpeta `components/layout`):

1. `ProtectedRoute`: es un wrapper que redirecciona al usuario a la página de `/login`, si no se cumple un booleano que se le pasa como parámetro.

2. `userLayout`: Es la barra de navegación que está presente al ver la información del usuario.

El componente que tienen las rutas, siempre viene de la carpeta `pages`, generalmente este componente es muy simple y contiene dentro el título de la ruta (por ejemplo: "Resultados") y después contiene el componente complejo que es el principal de la vista.

### Vistas de roles:

Mi approach al problema de las vistas fue tener diferentes `useMemos` dentro de los componentes, que me permitieran tener los entries de cada vista de rol, y mapearlos después, por ejemplo, en la navbar.

### Sesión:

La sesión se maneja de la forma que ofrece Firebase, hay un contexto global que tiene un `useEffect` que maneja el `onAuthStateChanged` IMPORTANTE, este `onAuthStateChanged` no es la función nativa de Firebase, es una función creada por mí (que por dentro usa la función nativa de Firebase) que tiene el mismo nombre, y lo que hace es hacer la petición del usuario, y después recuperar el usuario de Firestore, y devuelve ambos, también verifica que el `active` del usuario sea `true`.

### Asignación de usuarios:

La página de asignación de usuarios tiene un reducer que me permite manejar los estados del componente de manera más óptima.

### Resultados:

La página de resultados tiene un contexto solo para esta página, que por dentro está usando un reducer también, porque de otra forma hubiese hecho mucho prop drilling.

### user-profile:

`User-profile` es el componente que se utiliza en la página del perfil del usuario, y en la modal de edición del usuario. Este componente quizá es un poco complejo y difícil de entender. Este componente utiliza el hook `useGetUserPage`, que se encarga de fetchear el usuario y de proporcionar la vista de cada usuario a través de un `useMemo`.

Luego estas entries se mapean, y se devuelve un componente `UserEntry`, que es el que maneja el estado de la entry, si se está editando, cuál es el componente que tiene que renderizar si se está editando (`input[type=text] || options`) y cuando se edita se modifica un estado `editedFields`, que es el que después se agrega al update de Firebase. Adicionalmente, si uno de los campos de `editedFields` es el email, se manda una petición a la API para cambiar el email del usuario del Firebase Authentication.