# 🛠️ Fixly Backend API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)


<p align="center">
  <b>API RESTful para la gestión y contratación de servicios y oficios profesionales a domicilio (Fixly).</b>
  <br />
  Diseñada para alimentar clientes móviles (Android) y web con arquitectura modular, control de acceso basado en roles (RBAC) y gestión multimedia.
</p>

</div>

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Variables de Entorno](#-variables-de-entorno)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Inicialización de Superadministrador](#-inicialización-de-superadministrador)
- [Endpoints de la API](#-endpoints-de-la-api)
  - [Autenticación (`/api/auth`)](#autenticación-apiauth)
  - [Usuarios y Perfiles (`/api/users`)](#usuarios-y-perfiles-apiusers)
  - [Solicitudes de Servicio (`/api/service-requests`)](#solicitudes-de-servicio-apiservice-requests)
  - [Calificaciones y Reseñas (`/api/reviews`)](#calificaciones-y-reseñas-apireviews)
  - [Prestadores (`/api/providers`)](#prestadores-apiproviders)
  - [Catálogos (`/api/catalogs`)](#catálogos-apicatalogs)
  - [Administración (`/api/admin`)](#administración-apiadmin)
- [Roles y Permisos](#-roles-y-permisos)
- [Licencia](#-licencia)

---

## 📖 Descripción General

**Fixly** es una plataforma que conecta a clientes con prestadores de servicios calificados para reparaciones, mantenimiento e instalaciones del hogar y oficina (plomería, electricidad, cerrajería, pintura, mecánica, etc.).

Este repositorio contiene el backend del ecosistema Fixly, proveyendo una API REST segura, escalable y modular con soporte para autenticación mediante tokens JWT, control de estados de solicitudes en tiempo real, gestión de perfiles con subida de imágenes a Cloudinary y paneles administrativos.

---

## ✨ Características Principales

- 🔐 **Autenticación y Seguridad:**
  - Registro e inicio de sesión seguro con contraseñas encriptadas con `bcrypt`.
  - Generación y verificación de tokens `JWT` con expiración programada.
  - Validación de esquemas y sanitización de datos de entrada con `Zod`.
- 👥 **Control de Acceso Basado en Roles (RBAC):**
  - Roles definidos: **Administrador**, **Prestador de Servicios** y **Cliente**.
  - Middlewares de autorización específicos por acción y recurso.
- 📦 **Flujo Completo de Solicitudes de Servicio:**
  - Creación de solicitudes por parte de clientes con detalles del problema.
  - Ciclo de vida de solicitudes: `Pendiente` ➔ `Aceptada` ➔ `Finalizada` o `Cancelada`.
  - Edición y cancelación controlada según el estado del servicio.
- ⭐ **Sistema de Reputación y Reseñas:**
  - Calificación de 1 a 5 estrellas y comentarios tras finalizar el servicio.
  - Cálculo automático de promedio de calificación por prestador.
- 🖼️ **Gestión Multimedia en la Nube:**
  - Carga en memoria de fotos de perfil mediante `multer`.
  - Procesamiento y almacenamiento automático en la nube a través de **Cloudinary**.
- 🗂️ **Catálogo de Servicios y Oficios:**
  - Módulos dinámicos para categorías de oficios (Plomería, Electricidad, Jardinería, Limpieza, Pintura, Cerrajería, etc.) y sus correspondientes tareas especializadas.
- 🛡️ **Panel y Herramientas Administrativas:**
  - Gestión y monitoreo de cuentas de usuario.
  - Suspensión y reactivación de cuentas.
  - Búsqueda avanzada de usuarios.
  - Script para sembrado (*seed*) del Superadministrador inicial.

---

## 🚀 Tecnologías Utilizadas

- **Entorno de Ejecución:** [Node.js](https://nodejs.org/) (ES Modules)
- **Framework Web:** [Express.js 5](https://expressjs.com/)
- **Base de Datos:** [MySQL](https://www.mysql.com/) con el driver de alto rendimiento [`mysql2/promise`](https://github.com/sidorares/node-mysql2) y pool de conexiones
- **Autenticación y Criptografía:** [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken) y [`bcrypt`](https://github.com/kelektiv/node.bcrypt.js)
- **Validación de Datos:** [`zod`](https://zod.dev/)
- **Gestión de Archivos e Imágenes:** [`multer`](https://github.com/expressjs/multer) y [Cloudinary SDK](https://cloudinary.com/)
- **Middlewares Utilitarios:** [`cors`](https://github.com/expressjs/cors), [`dotenv`](https://github.com/motdotla/dotenv), [`morgan`](https://github.com/expressjs/morgan)
- **Herramienta de Desarrollo:** [`nodemon`](https://nodemon.io/)

---

## 📁 Estructura del Proyecto

El código está estructurado bajo una arquitectura modular por dominios de negocio:

```plaintext
Fixly-back/
├── src/
│   ├── config/                      # Configuraciones globales
│   │   ├── catalogos.js             # Constantes y diccionarios de roles, estados y oficios
│   │   ├── db.js                    # Inicialización y pool de MySQL
│   │   ├── permisos.js              # Definición de permisos por rol
│   │   └── scripts/
│   │       └── setup.superadmin.js  # Script de inicialización del Superadmin
│   ├── middlewares/
│   │   └── auth.middleware.js       # Validación de JWT y verificación de roles/permisos
│   ├── modules/                     # Módulos de la aplicación
│   │   ├── admin/                   # Módulo de administración
│   │   ├── auth/                    # Módulo de autenticación (login, logout, contraseñas)
│   │   ├── catalogs/                # Módulo de catálogos y categorías
│   │   ├── providers/               # Módulo de prestadores de servicios
│   │   ├── review/                  # Módulo de calificaciones y reseñas
│   │   ├── service-request/         # Módulo de solicitudes y ciclo del servicio
│   │   └── users/                   # Módulo de usuarios y perfiles
│   ├── utils/
│   │   └── cloudinary.js            # Utilidades para subida de imágenes
│   ├── app.js                       # Configuración de Express, middlewares y rutas
│   └── server.js                    # Punto de entrada y arranque del servidor HTTP
├── .env.example                     # Plantilla de variables de entorno
├── .gitignore                       # Archivos ignorados por Git
├── package.json                     # Metadatos y dependencias del proyecto
└── README.md                        # Documentación general
```

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```bash
cp .env.example .env
```

Configura los siguientes valores:

| Variable | Descripción | Ejemplo / Valor por defecto |
| :--- | :--- | :--- |
| `PORT` | Puerto donde correrá el servidor Express | `3000` |
| `DB_HOST` | Host de la base de datos MySQL | `localhost` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña del usuario MySQL | `tu_password` |
| `DB_NAME` | Nombre de la base de datos | `fixly_db` |
| `DB_PORT` | Puerto de MySQL | `3306` |
| `SECRET_JWT_KEY` | Llave secreta para firmar y verificar tokens JWT | `tu_clave_secreta_super_segura` |
| `CLOUDINARY_CLOUD_NAME` | Cloud Name de tu cuenta de Cloudinary | `tu_cloud_name` |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary | `tu_api_key` |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary | `tu_api_secret` |
| `SUPER_EMAIL` | Correo electrónico para el setup inicial de superadmin | `admin@fixly.com` |
| `SUPER_PW` | Contraseña para el setup inicial de superadmin | `SuperPass123!` |

---

## 💻 Instalación y Configuración

### Prerrequisitos

- **Node.js** v18 o superior
- **npm** v9 o superior (o pnpm / yarn)
- Instancia activa de **MySQL Server**
- Cuenta gratuita en **Cloudinary** (para almacenamiento de fotos)

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/Fixly-back.git
   cd Fixly-back
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar las variables de entorno:**
   Copia el archivo `.env.example` a `.env` y asigna tus credenciales.
   ```bash
   cp .env.example .env
   ```

4. **Preparar la base de datos:**
   Asegúrate de que la base de datos configurada en `DB_NAME` exista y cuente con el esquema requerido.

5. **Iniciar en modo desarrollo (con recarga automática):**
   ```bash
   npm run dev
   ```

6. **Iniciar en modo producción:**
   ```bash
   npm start
   ```

El servidor estará escuchando en `http://localhost:3000` (o el puerto configurado en `PORT`).

---

## 👤 Inicialización de Superadministrador

Para crear el usuario administrador inicial en la base de datos, asegúrate de tener definidos `SUPER_EMAIL` y `SUPER_PW` en tu `.env` y ejecuta:

```bash
node src/config/scripts/setup.superadmin.js
```

---

## 🔌 Endpoints de la API

Todas las rutas privadas requieren el envío del token de autenticación en la cabecera HTTP:
`Authorization: Bearer <TOKEN_JWT>`

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Inicia sesión y retorna token JWT | Público |
| `POST` | `/api/auth/logout` | Cierre de sesión de usuario | Público |
| `PUT` | `/api/auth/cambiarPassword` | Modificar contraseña de la cuenta | Autenticado |

---

### Usuarios y Perfiles (`/api/users`)

| Método | Endpoint | Descripción | Acceso / Rol |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/registrarCliente` | Registro de nuevos clientes | Público |
| `POST` | `/api/users/registrarPrestador` | Registro de nuevos prestadores de servicios | Admin |
| `GET` | `/api/users/verPerfil` | Consulta de perfil del usuario en sesión | Autenticado |
| `GET` | `/api/users/verPerfil/:id` | Consulta de perfil por ID | Autenticado |
| `GET` | `/api/users/VerPrestador/:id` | Obtener datos públicos de un prestador | Autenticado |
| `PUT` | `/api/users/editarPerfil` | Actualizar datos y foto de perfil (Multipart) | Autenticado |

---

### Solicitudes de Servicio (`/api/service-requests`)

| Método | Endpoint | Descripción | Acceso / Rol |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/service-requests/verSolicitudes` | Listado de solicitudes del usuario | Autenticado |
| `POST` | `/api/service-requests/solicitarServicio` | Crear nueva solicitud de servicio | Cliente |
| `GET` | `/api/service-requests/verDetalleSolicitud/:id` | Obtener detalle completo de solicitud | Autenticado |
| `GET` | `/api/service-requests/:id/calificada` | Verificar si una solicitud ya fue calificada | Autenticado |
| `PUT` | `/api/service-requests/:id/cancelar` | Cancelar una solicitud pendiente | Cliente |
| `PUT` | `/api/service-requests/:id/aceptar` | Aceptar una solicitud de trabajo | Prestador |
| `PUT` | `/api/service-requests/:id/finalizar` | Marcar servicio como completado | Prestador |
| `PUT` | `/api/service-requests/editarSolicitud/:id` | Modificar datos de una solicitud | Cliente |

---

### Calificaciones y Reseñas (`/api/reviews`)

| Método | Endpoint | Descripción | Acceso / Rol |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reviews/:id/calificar` | Calificar un servicio concluido | Cliente |
| `GET` | `/api/reviews/prestador/:prestadorId/calificaciones` | Listar reseñas recibidas por un prestador | Autenticado |
| `GET` | `/api/reviews/prestador/:prestadorId/promedio` | Consultar calificación promedio de un prestador | Autenticado |

---

### Prestadores (`/api/providers`)

| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/providers/categoria/:categoria_id` | Obtener lista de prestadores por oficio/categoría | Autenticado |

---

### Catálogos (`/api/catalogs`)

| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/catalogs/categorias` | Obtener listado de categorías disponibles | Público |
| `GET` | `/api/catalogs/categorias/servicios` | Obtener servicios asociados a categorías | Público |

---

### Administración (`/api/admin`)

| Método | Endpoint | Descripción | Acceso / Rol |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/usuarios` | Listar usuarios del sistema | Admin |
| `PUT` | `/api/admin/usuarios/:id/estado` | Activar o suspender cuenta de usuario | Admin |
| `GET` | `/api/admin/usuarios/busqueda` | Filtrar y buscar usuarios | Admin |

---

## 🔒 Roles y Permisos

El sistema implementa 3 roles principales gestionados en `src/config/catalogos.js`:

1. **Administrador (`id: 1`)**: Supervisión general de la plataforma, alta de prestadores y control de estado de usuarios.
2. **Prestador de Servicios (`id: 2`)**: Aceptación y finalización de trabajos asignados, consulta de reseñas y métricas de desempeño.
3. **Cliente (`id: 3`)**: Registro público, creación y seguimiento de solicitudes de servicio, y calificación de servicios terminados.

---


## 👥 Desarrolladoras

- **Fátima Talamantes** — [@Fatima-Talamantes](https://github.com/Fatima-Talamantes)
- **Deni Arellano** — [@Deni-Arellano](https://github.com/Deni-Arellano)


