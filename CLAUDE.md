# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

-   **Development Server**: `npm run dev` or `yarn dev` - Starts the development server on port 3004.
-   **Build**: `npm run build` or `yarn build` - Creates a production build of the application.
-   **Start Production Server**: `npm run start` or `yarn start` - Starts the built production application.
-   **Lint**: `npm run lint` or `yarn lint` - Runs ESLint and Next.js linting checks.
-   **Lint Fix**: `npm run lint:fix` or `yarn lint:fix` - Automatically fixes linting issues.
-   **Format Check**: `npm run format` or `yarn format` - Checks code formatting with Prettier.
-   **Format Fix**: `npm run format:fix` or `yarn format:fix` - Automatically fixes code formatting with Prettier.
-   **Database Seed**: `npm run db:seed` or `yarn db:seed` - Seeds the database using Prisma.

## High-Level Code Architecture

This is a full-stack Next.js 14 application.

-   **Frontend**: Built with Next.js and React, utilizing Radix UI components and Tailwind CSS for styling.
-   **Backend/API**: Leverages Next.js API routes, potentially with Hono for building fast, lightweight APIs.
-   **Database**: Uses Prisma as an ORM for database interactions.
-   **Storage**: Integrates with AWS S3 for file storage.
-   **Authentication/Other Services**: Firebase and Firebase Admin are used, likely for authentication or other backend services.
-   **Project Structure**: Follows a standard Next.js project structure, with pages/app router, components, lib, and API routes.
