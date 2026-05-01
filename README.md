# Paytm-like Money Transfer App

This project is a full-stack money transfer web application, inspired by Paytm. It is built using a modern monorepo architecture powered by Turborepo, featuring a Next.js frontend and an Express.js backend. The primary goal of this project was to explore and implement a clean, scalable, and efficient system by separating concerns into distinct applications and shared packages.

**[Live Link](https://paytm-project-web.vercel.app/)**

## Key Learnings & Features

This project served as a great learning experience, focusing on modern web development practices. The key takeaways include:

- **Monorepo Architecture with Turborepo:** Efficiently managing a multi-package repository with shared dependencies, configurations, and build pipelines.
- **Separated Frontend and Backend:** Building a decoupled system with a **Next.js** client (`web`) and an **Express.js** API (`server`).
- **Shared Packages:** Creating reusable modules for database models (`@repo/db`), validation schemas (`@repo/zod`), and configurations (`eslint-config`, `typescript-config`) to ensure consistency and reduce code duplication.
- **Next.js Server Actions:** Implementing form submissions and data mutations directly on the server using Server Actions, along with `useActionState` for handling form state and `revalidatePath` for on-demand cache revalidation.
- **Custom APIFeatures Class:** A robust, reusable class on the backend for advanced querying, including dynamic filtering, sorting, field limiting, and pagination for features like user search.
- **Atomic Transactions:** Ensuring data integrity during money transfers using MongoDB sessions to perform atomic debit and credit operations.

---

## Tech Stack

| Category            | Technology                                                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Monorepo**        | [Turborepo](https://turbo.build/repo)                                                                                   |
| **Frontend**        | [Next.js](https://nextjs.org/) (with App Router), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/) |
| **Backend**         | [Express.js](https://expressjs.com/), [Node.js](https://nodejs.org/)                                                    |
| **Database**        | [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)                                            |
| **Authentication**  | JWT (JSON Web Tokens)                                                                                                   |
| **Validation**      | [Zod](https://zod.dev/)                                                                                                 |
| **Language**        | [TypeScript](https://www.typescriptlang.org/)                                                                           |
| **Package Manager** | [yarn](https://yarn.io/)                                                                                                |

---

## Project Structure

The project is organized as a monorepo with the following structure:

```
/
├── apps/
│   ├── server/         # Express.js Backend API
│   └── web/            # Next.js Frontend
├── packages/
│   ├── db/             # MongoDB models and connection logic
│   ├── eslint-config/  # Shared ESLint configurations
│   ├── tailwind-config/# Shared Tailwind CSS configuration
│   ├── typescript-config/# Shared TypeScript configurations
│   └── zod/            # Shared Zod validation schemas
└── package.json
```

---

## Core Features Implemented

1.  **User Authentication:**
    - Secure user signup with password hashing (`bcrypt`).
    - User signin with email/password, returning a secure JWT.
    - Protected routes to ensure only authenticated users can access sensitive data.

2.  **Account Management:**
    - Upon signup, each user is automatically assigned an account with a random starting balance.
    - Ability for users to check their current account balance.

3.  **Peer-to-Peer Money Transfer:**
    - Users can search for other registered users by their first or last name.
    - Functionality to send money to another user.
    - The transfer is handled within a **MongoDB transaction** to ensure atomicity. If either the debit from the sender or the credit to the receiver fails, the entire transaction is rolled back.

4.  **User Search:**
    - A dynamic search feature allowing users to find other users in the system.
    - This is powered by the custom `APIFeatures` class on the backend, which constructs a flexible MongoDB query based on user input.

---

## Quick Setup Guide

Follow these steps to get the project running locally.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later)
- [yarn](https://yarn.io/installation)
- [MongoDB](https://www.mongodb.com/try/download/community) instance (local or cloud-based like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/paytm-project.git
    cd paytm-project
    ```

2.  **Install dependencies:**

    ```bash
    yarn install
    ```

3.  **Set up environment variables:**
    Navigate to the backend server directory and create a `.env` file.

    ```bash
    cd apps/server
    cp example.config.env config.env
    ```

    Now, open `config.env` and fill in the required values:

    ```env
    DATABASE=<your_mongodb_connection_string>
    DATABASE_PASSWORD=<your_mongodb_password> # If applicable
    JWT_SECRET=<a_strong_random_secret_key>
    JWT_EXPIRES_IN=90d
    ```

4.  **Run the development server:**
    Go back to the root directory and start the development servers for both the frontend and backend.

    ```bash
    cd ../..
    yarn dev
    ```

5.  **Access the application:**
    - The Next.js frontend will be available at `http://localhost:3000`.
    - The Express.js backend will be running on `http://localhost:8000`.

---

## Architectural Highlights

### Monorepo with Turborepo

Using Turborepo was fundamental to managing this project. It provides:

- **Faster Builds:** Caches build outputs to avoid re-computing work.
- **Simplified Dependency Management:** `yarn` workspaces allow for easy sharing of packages.
- **Task Orchestration:** A single `dev` command can start multiple services.

### Next.js Server Actions & State Management

Instead of creating traditional API endpoints for every form, this project leverages **Server Actions** for mutations like sending money.

- The `useActionState` hook is used to manage loading, error, and success states directly within the component, simplifying client-side logic.
- `revalidatePath('/dashboard')` is called after a successful transfer to invalidate the Next.js cache and refetch the user's balance, ensuring the UI is always up-to-date.

### Reusable `APIFeatures` Class

To avoid writing repetitive query logic in the backend, a generic `APIFeatures` class was created. It takes a Mongoose query object and a query string (from `req.query`) and chains methods to it.

**Example Usage:**

```typescript
const features = new APIFeatures(User.find(), req.query)
  .filter()
  .sort()
  .limitFields()
  .paginate();

const users = await features.query;
```

This makes controllers cleaner and the query logic highly reusable and extensible.
