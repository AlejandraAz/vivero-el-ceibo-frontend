#Vivero El Ceibo

**E-commerce para un vivero familiar con más de 45 años de trayectoria.**  
Este proyecto busca digitalizar la venta de productos de jardinería, facilitando la gestión interna y la experiencia de compra del cliente.Este frontend está desarrollado en React y se conecta al backend para gestionar productos, usuarios, carritos y pedidos.

---

## 🛠️ Tecnologías utilizadas

| Categoría         | Tecnologías                               |
| ----------------- | ----------------------------------------- |
| Framework         | React                                     |
| Estilo            | Tailwind CSS • Material UI • Lucide Icons |
| Estado / Contexto | React Context API                         |
| API Requests      | Axios                                     |
| Routing           | React Router DOM                          |

---
⚙️ Requisitos previos

Asegurarse de tener instalado:

Node.js 18+

npm 9+

Backend del proyecto corriendo localmente:
👉 https://github.com/AlejandraAz/vivero-el-ceibo-backend

## ⚙️ Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone [URL_DEL_REPO]
cd vivero-el-ceibo

Instalar dependencias

npm install

🔗 La aplicación estará disponible en:
👉 http://localhost:5173/


🔑 Variables de entorno

Crear un archivo .env en la raíz del proyecto:
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=tuclave
VITE_EMAILJS_SERVICE_ID=tuid
VITE_EMAILJS_TEMPLATE_ID=tuclave
VITE_EMAILJS_PUBLIC_KEY=tuclave

Base de datos

Crear una base de datos llamada vivero_db (o el nombre que pongas en DB_NAME)

Ejecutar migraciones y seeders (si están disponibles)

El proyecto incluye un seeder para crear un usuario administrador

Para correr proyecto front y back
npm run dev

Seeder incluido

Se incluye un seeder para crear un usuario administrador. Esto permite acceder al panel de administración desde el inicio.

Funcionalidades actuales

Login de administrador con JWT y cookies

CRUD de administradores de gestion de usuarios productos y categorias

Sistema de roles (admin / cliente)

Rutas protegidas con middleware
Autenticación

JWT para acceso seguro

Cookies HTTP-only para mantener la sesión

Rutas privadas para administración

📂 Estructura del proyecto

src/
 ├─ Pubic/
 ├─ css/
 ├─ data/
 ├─ layouts/
 ├─ Admin/
 ├─ Customer/
 ├─ components/
 ├─ context/
 ├─ services/
 ├─ pages/
 ├─ router/
 ├─ utils/
 └─ App.jsx



✅ Funcionalidades actuales
🛍️ Cliente

Registro y login (credenciales + Google)

Navegación por catálogo de productos

Búsqueda por nombre y categorías

Sistema de carrito de compras:

Agregar y eliminar productos

Modificar cantidades

Vaciar carrito

Gestión del perfil:

Ver y editar datos

Cambio de contraseña

Subida de imagen de perfil

Gestión de compras:

Crear pedido

Ver historial de pedidos

Ver detalle de cada pedido

Reseñas:

Crear reseñas de productos comprados

Ver reseñas propias

👑 Administrador

Panel administrativo con dashboard

Gestión de productos:

Crear, editar, desactivar, destacar y restaurar productos

Gestión de imágenes

Estadísticas por categoría

Gestión de usuarios:

Listado de usuarios

Activar / desactivar cuentas

Ver usuarios nuevos por semana (gráfico)

Gestión de pedidos:

Listado completo

Ver detalle + cambiar estado

Gestión de reseñas:

Revisar pendientes

Aprobar / rechazar

Eliminar reseñas

Gestión de envíos:

Activar / desactivar

Cambiar estado del envío

🔐 Rutas protegidas

Sistema basado en roles:

Cliente (cliente)

Administrador (admin)

El acceso se controla con:
✅ AuthContext en frontend
✅ JWT + middleware en backend

📌 Próximas funcionalidades (Pendientes reales)

| Funcionalidad                        |     Estado     |
| ------------------------------------ | :------------: |
| Pasarela de pagos (ej. Mercado Pago) | 🔄 En análisis |
| Mejoras de accesibilidad             | 🔄 Planificada |

👩‍💻 Créditos

Proyecto académico desarrollado por:
Alejandra Az

📌 Estado del proyecto

🚧 Activo y en desarrollo
Se irá actualizando la documentación a medida que se integren nuevas funcionalidades.










#Trabajo práctico de desarrollo web 2
Crear un sitio web diseñado con Material UI,tailwind css sin funcionalidades, la temática de este sitio es de un vivero llamado el Ceibo.

para los iconos utilizo lucide,porque es mas liviana y sencilla de aplicar.
https://recharts.org/en-US p/ los graficos