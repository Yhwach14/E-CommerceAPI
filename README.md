# Ecommerce API

A REST API for a simple ecommerce platform, built with NestJS, TypeORM, and PostgreSQL. Built as a learning project to get hands-on with the NestJS framework.

## Features

- **Auth** — JWT-based registration and login
- **Users** — profile management, with ownership-based access control (a user can only view/edit their own account, admins can access any)
- **Products & Categories** — full CRUD, public browsing, admin-only writes
- **Cart** — add, update, remove, and clear items, scoped to the logged-in user, with stock validation
- **Orders** — checkout converts a user's cart into an order (stock is checked and decremented, and each order item snapshots the product's name/price at time of purchase), plus order history and order lookup

## Tech stack

- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/) + PostgreSQL
- [Passport](https://www.passportjs.org/) + JWT for authentication
- [class-validator](https://github.com/typestack/class-validator) for request validation

## Getting started

### Prerequisites

- Node.js
- A running PostgreSQL instance

### Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in your own values:
   ```bash
   cp .env.example .env
   ```

3. Start the app:
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:PORT` (as set in your `.env`).

## Scripts

| Command | Description |
|---|---|
| `npm run start:dev` | Run in watch mode |
| `npm run build` | Build for production |
| `npm run start:prod` | Run the production build |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |
| `npm run lint` | Lint the codebase |
| `npm run format` | Format the codebase |

## API overview

| Method | Route | Access |
|---|---|---|
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| GET | `/users` | Admin only |
| GET/PATCH/DELETE | `/users/:id` | Owner or admin |
| GET | `/products`, `/products/:id` | Public |
| POST/PATCH/DELETE | `/products`, `/products/:id` | Admin only |
| GET | `/categories`, `/categories/:id` | Public |
| POST/PATCH/DELETE | `/categories`, `/categories/:id` | Admin only |
| GET/POST/PATCH/DELETE | `/cart` | Logged-in user (own cart) |
| POST | `/orders/checkout` | Logged-in user (own cart) |
| GET | `/orders` | Logged-in user (own orders) |
| GET | `/orders/:id` | Owner or admin |
