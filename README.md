# Gympro - Gym Management System

## About the Project

Gympro is a web-based application designed to streamline the management of a gym or fitness center. It provides a comprehensive set of features to manage members, their subscriptions, attendance, and payments. The application is built with a modern technology stack, featuring a powerful backend powered by Laravel and a dynamic frontend built with React.

## Features

*   **Member Management:** Easily add, view, and manage gym members.
*   **Plan and Subscription Management:** Create and manage membership plans and subscriptions.
*   **Attendance Tracking:** Track member attendance with a QR code check-in system.
*   **Payment Processing:** Securely process payments using the PhonePe payment gateway.
*   **Role-Based Access Control:** Manage user roles and permissions to control access to different parts of the application.
*   **Reporting and Analytics:** Generate reports on attendance and payments to gain insights into your gym's performance.
*   **Invoice Generation:** Automatically generate invoices for payments.
*   **Modern User Interface:** A clean and responsive user interface built with React, TypeScript, and Tailwind CSS.

## Technologies Used

*   **Backend:** Laravel 12, PHP 8.2
*   **Frontend:** React 19, TypeScript, Vite, Inertia.js
*   **Database:** MySQL (or any other Laravel-supported database)
*   **UI Libraries:** shadcn/ui, Radix UI, Tailwind CSS
*   **Authentication:** Laravel Fortify
*   **Payment Gateway:** PhonePe

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   PHP >= 8.2
*   Composer
*   Node.js and npm
*   A database server (e.g., MySQL)

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/gympro.git
    cd gympro
    ```

2.  **Install backend dependencies:**

    ```sh
    composer install
    ```

3.  **Install frontend dependencies:**

    ```sh
    npm install
    ```

4.  **Set up your environment:**

    *   Copy the `.env.example` file to `.env`:

        ```sh
        cp .env.example .env
        ```

    *   Generate a new application key:

        ```sh
        php artisan key:generate
        ```

    *   Configure your database and other environment variables in the `.env` file.

5.  **Run the database migrations:**

    ```sh
    php artisan migrate
    ```

6.  **Build the frontend assets:**

    ```sh
    npm run build
    ```

7.  **Start the development server:**

    ```sh
    php artisan serve
    ```

    And in a separate terminal:

    ```sh
    npm run dev
    ```

## Configuration

The application requires the following environment variables to be set in the `.env` file:

*   `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`: Database connection details.
*   `PHONEPE_MERCHANT_ID`, `PHONEPE_MERCHANT_USER_ID`, `PHONEPE_SALT_KEY`, `PHONEPE_SALT_INDEX`, `PHONEPE_ENV`: PhonePe API credentials.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.