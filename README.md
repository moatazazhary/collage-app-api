# 🎓 Collage App API

A modular, scalable RESTful API built with **Node.js**, **Express**, and **Prisma**, designed to manage college-related operations such as authentication, students, research data, and permissions.

This project follows **clean architecture principles** with a **module-based structure**, making it production-ready and easy to maintain or extend.


## 🚀 Tech Stack

- **Node.js**
- **Express.js**
- **Prisma ORM**
- **PostgreSQL** (or any Prisma-supported database)
- **JWT Authentication**
- **Swagger (OpenAPI)** for API documentation
- **Multer** for file uploads
- **Zod / Custom validation**
- **Role-Based Access Control (RBAC)**


## 📂 Project Structure

Src/ ├── configs/        # App & database configurations ├── errors/         # Custom error classes ├── middlewares/    # Auth, validation, permissions, uploads ├── modules/        # Feature-based modules │   ├── auth/ │   ├── students/ │   ├── research/ │   └── core/ ├── utils/          # Helper functions ├── app.js          # Express app setup └── index.js        # App entry point

Each module follows a clean separation of concerns:
- **Routes** → define endpoints
- **Controllers** → handle request/response
- **Services** → business logic
- **Validations** → input validation schemas


## 🔐 Authentication & Authorization

- JWT-based authentication
- Role-based access control (RBAC)
- Permission checking service
- OTP-based verification
- Email validation support

Roles and permissions are centrally managed to ensure secure access to resources.


## 📑 API Documentation

Swagger documentation is available after running the project:

GET /api-docs

It provides:
- Endpoint descriptions
- Request/response examples
- Authentication requirements


## 🗄️ Database & Prisma

- Prisma is used as the ORM
- Schema is defined in `prisma/schema.prisma`
- Database access is centralized via Prisma client
- Seed support available for initial data


## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/db_name
JWT_SECRET=your_secret



▶️ Getting Started

1️⃣ Install dependencies

Npm install

2️⃣ Generate Prisma client

Npx prisma generate

3️⃣ Run migrations

Npx prisma migrate dev

4️⃣ Start the server

Npm run dev



🧪 Validation & Error Handling

Centralized validation logic

Custom error classes

Consistent API error responses

Upload and file-related error handling




📌 Key Features

Modular & scalable architecture

Clean separation of concerns

Production-style authentication system

Role & permission management

Swagger API documentation

Ready for future testing & CI/CD integration




📈 Project Status

✅ Actively developed
🛠️ Open for improvements (tests, CI/CD, Docker)



👨‍💻 Author

Moataz Azhary
Backend Developer (Node.js / Express / Prisma)

GitHub: https://github.com/moatazazhary




⭐ Notes

This project is designed to demonstrate professional backend engineering practices and can be used as:

Portfolio project

Base for SaaS products

Production-ready backend foundation


Contributions and feedback are welcome.
