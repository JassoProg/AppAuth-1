# Auth App - Sistema de Autenticación Angular

Este proyecto es una aplicación Angular completa de autenticación con JWT que incluye registro, login, guards de rutas, interceptores HTTP y gestión de roles.

## 🚀 Características Implementadas

- ✅ **Servicio de autenticación** (`auth.service.ts`)
- ✅ **Interceptor JWT** - Agrega automáticamente el token a las solicitudes HTTP
- ✅ **Guards de Rutas** - `AuthGuard` y `RoleGuard` para proteger rutas
- ✅ **Componentes protegidos** - Dashboard y páginas que requieren autenticación
- ✅ **Servicio de usuario** (`user.service.ts`) - Para obtener detalles del usuario autenticado
- ✅ **Logout/Limpiar sesión** - Botón de cerrar sesión en toda la aplicación
- ✅ **Redirección basada en autenticación** - Redirecciona usuarios no autenticados
- ✅ **Gestión de roles** - Verificación de permisos basada en roles
- ✅ **Navegación responsive** - Navbar que se muestra solo cuando el usuario está logueado

## 🏗️ Estructura del Proyecto

```
src/app/
├── auth/
│   ├── auth.guard.ts          # Guard para rutas autenticadas
│   ├── auth.service.ts        # Servicio principal de autenticación
│   ├── jwt.interceptor.ts     # Interceptor para agregar JWT a requests
│   ├── role.guard.ts          # Guard para verificar roles
│   ├── login/                 # Componente de login
│   ├── register/              # Componente de registro
│   └── profile/               # Componente de perfil
├── components/
│   ├── dashboard/             # Dashboard principal (protegido)
│   ├── navbar/                # Navegación principal
│   └── unauthorized/          # Página de acceso no autorizado
├── services/
│   └── user.service.ts        # Servicio para gestión de usuarios
└── models/                    # Interfaces TypeScript
```

## 🔐 Flujo de Autenticación

1. **Login**: Usuario ingresa credenciales → Recibe JWT → Token se almacena en localStorage
2. **Interceptor**: Todas las requests HTTP agregan automáticamente el header `Authorization: Bearer {token}`
3. **Guards**: Verifican autenticación y roles antes de acceder a rutas protegidas
4. **Redirección**: Usuarios no autenticados son redirigidos al login
5. **Logout**: Limpia el token y redirige al login

## 🛡️ Rutas y Protección

| Ruta | Componente | Protección | Descripción |
|------|------------|------------|-------------|
| `/auth/login` | LoginComponent | Pública | Página de inicio de sesión |
| `/auth/register` | RegisterComponent | Pública | Página de registro |
| `/auth/profile` | ProfileComponent | AuthGuard | Perfil del usuario autenticado |
| `/dashboard` | DashboardComponent | AuthGuard | Dashboard principal |
| `/admin` | DashboardComponent | RoleGuard (Admin) | Panel administrativo |
| `/unauthorized` | UnauthorizedComponent | Pública | Acceso no autorizado |

## 🔧 Configuración del Backend

La aplicación está configurada para conectarse a un backend ASP.NET Core en:
- **URL Base**: `https://localhost:5000/api/Account`
- **Endpoints utilizados**:
  - `POST /login` - Autenticación
  - `GET /detail` - Obtener detalles del usuario autenticado

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
