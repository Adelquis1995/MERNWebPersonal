# MERN Web Personal

Web personal desarrollada con el stack MERN. Este repositorio contiene la API REST
(`server/`); el cliente en React se agregará más adelante en `client/`.

## Stack

- **Node.js** + **Express 5**
- **MongoDB Atlas** con **Mongoose**
- Autenticación con **JWT** (access + refresh token)
- Hash de contraseñas con **bcrypt**
- Subida de archivos con **multer**

## Puesta en marcha

```bash
cd server
npm install
cp .env.example .env    # completar con los valores reales
npm run dev
```

La API queda escuchando en `http://localhost:3977/api/v1`.

| Script | Descripción |
| --- | --- |
| `npm start` | Arranca el servidor |
| `npm run dev` | Arranca con nodemon (recarga automática) |

## Variables de entorno

Se cargan desde `server/.env`, que **no se versiona**. Usá `server/.env.example`
como plantilla. `server/config.js` las valida al arrancar: si falta alguna de las
obligatorias, el proceso falla con un mensaje claro en vez de arrancar a medias.

| Variable | Obligatoria | Descripción |
| --- | --- | --- |
| `DB_USER` | sí | Usuario de MongoDB Atlas |
| `DB_PASSWORD` | sí | Contraseña de MongoDB Atlas |
| `DB_HOST` | sí | Host del cluster (`cluster0.xxxxx.mongodb.net`) |
| `JWT_SECRET_KEY` | sí | Clave para firmar los JWT |
| `PORT` | no | Puerto del servidor (por defecto `3977`) |
| `IP_SERVER` | no | Host mostrado al arrancar (por defecto `localhost`) |
| `API_VERSION` | no | Prefijo de versión de la API (por defecto `v1`) |

Para generar un `JWT_SECRET_KEY`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Endpoints

Base: `/api/v1`

### Autenticación

| Método | Ruta | Body | Descripción |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | `firstname`, `lastname`, `email`, `password` | Registra un usuario |
| `POST` | `/auth/login` | `email`, `password` | Devuelve `access` y `refresh` |
| `POST` | `/auth/refresh_access_token` | `token` (refresh) | Devuelve un nuevo `access` |

### Usuarios

Requieren la cabecera `Authorization: Bearer <access_token>`.

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/user/me` | Datos del usuario autenticado |
| `GET` | `/users?active=true` | Lista de usuarios, filtrable por estado |
| `POST` | `/user` | Crea un usuario (`multipart/form-data`, campo `avatar` opcional) |

## Notas de seguridad

- Los tokens se validan con `jwt.verify`, comprobando **firma y expiración**.
- Access y refresh son tokens de tipo distinto y no son intercambiables.
- El campo `password` nunca se incluye en las respuestas.
- Login y registro no revelan qué emails están dados de alta.
- Los avatares se guardan en `server/uploads/`, que no se versiona.

## Estructura

```
server/
├── config.js        # carga y valida las variables de entorno
├── index.js         # conexión a Mongo y arranque del servidor
├── app.js           # configuración de Express, CORS y rutas
├── router/          # definición de rutas
├── controllers/     # lógica de cada endpoint
├── middlewares/     # autenticación y subida de archivos
├── models/          # esquemas de Mongoose
└── utils/           # helpers de JWT e imágenes
```
