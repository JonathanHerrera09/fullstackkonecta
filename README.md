#  FullStack Konecta

Aplicación Full Stack para gestión de usuarios, empleados y solicitudes con roles **admin** y **employee**.  
Incluye login, CRUD, scroll infinito y alertas visuales.

##  Instalación

###  Usando Docker (recomendado)

# Clonar repositorio
git clone https://github.com/usuario/fullstackkonecta.git
cd fullstackkonecta

# Levantar todo (MySQL, backend y frontend)
docker compose up --build -d

Acceso:

Backend: http://localhost:4000

Frontend: http://localhost:5173

Usando consola (sin Docker)

Requisitos: Node.js 21+, MySQL 8

Configurar .env en backend con datos de conexión MySQL.

Instalar dependencias:

cd backend && npm install
cd ../frontend && npm install

Iniciar backend:
cd backend
npm run dev
Iniciar frontend:


cd frontend
npm run dev
