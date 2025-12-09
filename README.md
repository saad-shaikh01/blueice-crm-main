# BlueIce CRM

## High-Level Overview

BlueIce CRM is a full-stack project management solution, inspired by Jira, built using Next.js 14 and Appwrite. It aims to provide a robust and modern platform for teams to manage tasks, track progress, and collaborate effectively.

## Architecture Summary

This project is a full-stack Next.js application leveraging the App Router for both frontend rendering and API routes.

-   **Frontend**: Developed with React, utilizing a component-based architecture with [Radix UI](https://www.radix-ui.com/) for accessible and customizable UI primitives, styled extensively with [Tailwind CSS](https://tailwindcss.com/).
-   **Backend/API**: Implemented using Next.js API routes, with potential integration of [Hono](https://hono.dev/) for building fast and lightweight API endpoints.
-   **Database**: Utilizes [Prisma ORM](https://www.prisma.io/) for type-safe database access, with MongoDB identified as the underlying database based on project dependencies.
-   **Storage**: Integrates with [AWS S3](https://aws.amazon.com/s3/) for secure and scalable file storage, enabling features like attachment uploads.
-   **Authentication & Other Services**: Leverages [Firebase](https://firebase.google.com/) and [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) for authentication, user management, and other potential backend functionalities. JWT (`jsonwebtoken`) and `bcryptjs` are also used, suggesting a robust authentication flow.
-   **Key Libraries**:
    -   `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`: AWS S3 integration.
    -   `@hello-pangea/dnd`: Drag-and-drop functionality for task boards.
    -   `@hono/zod-validator`, `hono`: API development and validation.
    -   `@prisma/client`, `prisma`: Database ORM.
    -   `firebase`, `firebase-admin`: Backend services, likely authentication.
    -   `next`, `react`, `react-dom`: Core Next.js and React.
    -   `tailwindcss`: CSS framework.
    -   `react-big-calendar`: Calendar component for scheduling/tracking.
    -   `react-mentions`: For user mentions in comments or descriptions.

## Technical Stack Overview

-   **Framework**: Next.js 14 (Frontend + API routes)
-   **UI**: React, Tailwind CSS, Radix UI
-   **ORM**: Prisma ORM
-   **Database**: MongoDB
-   **Backend Services**: Firebase / Firebase Admin
-   **Cloud Storage**: AWS S3

## Key Development Commands

To get started with development or maintenance, the following `npm` scripts are available:

-   `npm run dev`: Starts the development server on `http://localhost:3004`.
-   `npm run build`: Compiles the application for production deployment.
-   `npm run start`: Serves the compiled production application.
-   `npm run lint`: Runs ESLint and Next.js linting checks to identify code quality issues.
-   `npm run lint:fix`: Automatically fixes fixable linting errors.
-   `npm run format`: Checks code formatting using Prettier.
-   `npm run format:fix`: Automatically reformats code using Prettier.
-   `npm run db:seed`: Executes the database seeding script defined in `prisma/seed.ts`.

## Features and Modules

Based on the architecture and dependencies, the project likely includes the following core functionalities:

-   **Project & Task Management**: Creation, viewing, updating, and deletion of projects and individual tasks/issues. Drag-and-drop interfaces (`@hello-pangea/dnd`) suggest Kanban-style boards or similar interactive task management.
-   **User Authentication**: Secure user registration, login, and session management, potentially leveraging Firebase and JWTs.
-   **File Attachments**: Ability to upload and manage files associated with tasks or projects via AWS S3 integration.
-   **User Interactions**: Functionality for mentioning users (`react-mentions`) in comments or descriptions.
-   **Scheduling/Calendar Views**: Integration of a calendar component (`react-big-calendar`) for visualizing deadlines, events, or task timelines.
-   **API Endpoints**: A set of robust API endpoints for all CRUD operations related to projects, tasks, users, and files.

## Folder Structure Overview

The project adheres to a standard Next.js application structure with additional directories for backend and database concerns:

-   `app/`: Contains all Next.js App Router components, including pages, layouts, and API routes (`app/api`). This is the primary location for frontend and backend logic.
-   `components/`: Reusable UI components used across the application.
-   `lib/`: Houses utility functions, helper modules, and potentially custom hooks.
-   `prisma/`: Contains the Prisma schema (`schema.prisma`), database migration files, and seeding scripts (`seed.ts`).
-   `public/`: Stores static assets such as images, fonts, and other public files.
-   `styles/`: Configuration for Tailwind CSS and any global stylesheets.
-   `next.config.js`: Next.js configuration file.
-   `tailwind.config.ts`: Tailwind CSS configuration file.
-   `.env.local`: Environment variables for local development.

## Setup Instructions

To set up and run the BlueIce CRM project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/blueice-crm.git # Replace with actual repo URL
    cd blueice-crm
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root of the project and populate it with necessary environment variables. These will include:
    -   `DATABASE_URL` (for your MongoDB instance)
    -   AWS S3 credentials (e.g., `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_BUCKET_NAME`)
    -   Firebase configuration (e.g., `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, etc.)
    -   JWT secret for authentication (e.g., `JWT_SECRET`)

    _Example `.env.local` content:_
    ```
    DATABASE_URL="mongodb://localhost:27017/blueice_crm"
    AWS_ACCESS_KEY_ID="YOUR_AWS_ACCESS_KEY_ID"
    AWS_SECRET_ACCESS_KEY="YOUR_AWS_SECRET_ACCESS_KEY"
    AWS_REGION="YOUR_AWS_REGION"
    AWS_BUCKET_NAME="YOUR_AWS_BUCKET_NAME"
    FIREBASE_API_KEY="..."
    # ... other Firebase config
    JWT_SECRET="YOUR_SUPER_SECRET_JWT_KEY"
    ```

4.  **Database Setup:**
    Apply Prisma migrations and seed the database.
    ```bash
    npx prisma migrate dev --name init # Or the appropriate migration command for your setup
    npm run db:seed
    ```

5.  **Start the Development Server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:3004`.

## Future Improvements and Roadmap

Based on the current architecture and common project management needs, potential future enhancements could include:

-   **Advanced Workflows**: Custom task statuses, transitions, and automated workflows.
-   **Notifications**: Real-time notifications for task assignments, updates, and comments.
-   **Reporting & Analytics**: Dashboards and reports for project progress, team performance, and resource allocation.
-   **Real-time Collaboration**: Enhanced real-time updates for shared task boards and document editing.
-   **Integrations**: Connect with other tools like Slack, GitHub, or popular CI/CD services.
-   **Permission Management**: More granular role-based access control for projects and tasks.