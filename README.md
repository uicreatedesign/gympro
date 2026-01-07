# Gympro - Gym Management System

A comprehensive web-based gym management system built with Laravel 12 and React 19, featuring role-based access control, member management, subscription tracking, attendance monitoring, payment processing, and more.

## Features

### Core Modules

#### 1. Member Management
- Add, edit, and delete gym members
- Track member details (name, email, phone, gender, DOB, address)
- Member status tracking (active, inactive, expired)
- Optional user account creation for member portal access
- Pagination and search functionality
- Serial number column for easy reference

#### 2. Plan Management
- Create and manage membership plans
- Flexible plan configuration:
  - Duration (in months)
  - Pricing and admission fees
  - Shift options (morning, evening, full day)
  - Features (personal training, group classes, locker facility)
- Plan status management (active/inactive)
- Soft-colored badges for visual identification

#### 3. Subscription Management
- Link members to plans with subscriptions
- Automatic end date calculation based on plan duration
- Payment status tracking (pending, paid, overdue)
- Subscription status (active, expired, cancelled)
- Advanced search and filtering
- Pagination with customizable rows per page
- Admission fee tracking
- Trainer assignment to subscriptions

#### 4. Attendance Tracking
- Manual attendance marking
- QR code-based check-in system
- Date-wise attendance filtering
- Attendance reports and analytics
- Status indicators (present, absent, late)
- Dashboard cards with shadcn/ui styling

#### 5. Payment Management
- Payment recording and tracking
- Multiple payment methods support
- PhonePe payment gateway integration
- Payment status tracking (pending, completed, failed, refunded)
- Invoice generation (PDF)
- Payment history and reports
- Pagination and search

#### 6. Trainer Management
- Add and manage gym trainers
- Trainer profiles with specialization
- Contact information management
- Status tracking (active/inactive)
- Pagination support

#### 7. User Management
- Create and manage system users
- Role assignment
- User status management
- Profile image support
- Pagination with customizable rows per page

#### 8. Equipment Management
- Track gym equipment inventory
- Equipment categories and conditions
- Purchase tracking with dates and prices
- Photo uploads for equipment
- Status management (active, maintenance, retired)
- Quantity tracking

#### 9. Expense Management
- Record and categorize gym expenses
- Multiple expense categories
- Receipt uploads
- Payment method tracking
- Date-wise expense filtering
- Expense reports

#### 10. Roles & Permissions
- Dynamic role-based access control (RBAC)
- Granular permission management
- Pre-defined roles: Admin, Manager, Trainer, Viewer, Member
- Permission categories:
  - Members (view, create, edit, delete)
  - Plans (view, create, edit, delete)
  - Subscriptions (view, create, edit, delete)
  - Attendance (view, create, edit, delete)
  - Trainers (view, create, edit, delete)
  - Payments (view, create, edit, delete)
  - Users (view, create, edit, delete)
  - Roles (view, create, edit, delete)
  - Equipment (view, create, edit, delete)
  - Expenses (view, create, edit, delete)
  - Settings (view, edit)
  - Reports (view)
- Scrollable permissions grid in edit modal

#### 11. Dashboard
- Overview statistics cards
- Expiring subscriptions alerts
- Recent subscriptions list
- Attendance summary
- Payment analytics
- Revenue and attendance trend charts
- Soft-colored status badges

#### 12. Reports
- Attendance reports
- Payment reports
- Subscription analytics
- Member statistics
- Excel export functionality

#### 13. General Settings
- Application configuration:
  - App name (displayed in sidebar logo)
  - App logo upload
  - Currency and symbol
  - Tax rate configuration
- Business information:
  - Business name and address
  - Contact details (phone, email, website)
- System preferences:
  - Timezone settings
  - Date format configuration
- Payment gateway settings:
  - PhonePe configuration
- Settings cached for performance (1-hour TTL)
- Permission-based access control

#### 14. Notification System
- System notifications
- Notification settings management
- Real-time updates

### Member Portal
- Dedicated member dashboard
- View active subscriptions
- Browse available plans
- Online plan purchase with PhonePe integration
- Attendance history with calendar view
- Payment history
- QR code for check-in

### Authentication & Security
- Laravel Fortify authentication
- Two-factor authentication (2FA)
- Email verification
- Password reset functionality
- Session management
- XSS protection with input sanitization
- CSRF protection
- Google OAuth integration

### UI/UX Features
- Modern, responsive design
- Dark mode support
- shadcn/ui components
- Soft-colored badge system:
  - Green: active, completed, paid
  - Yellow: pending
  - Red: expired, failed, overdue
  - Gray: inactive, cancelled
  - Blue: morning shift, admin role
  - Purple: evening shift, trainer role
  - Orange: full day shift
- Hover effects on table rows
- Serial number columns on all tables
- Smart pagination with ellipsis
- "Showing X to Y of Z results" display
- Customizable rows per page selector
- Toast notifications (Sonner)
- Loading states
- Form validation with error messages

## Technologies Used

### Backend
- **Framework**: Laravel 12
- **PHP Version**: 8.2+
- **Database**: MySQL (or any Laravel-supported database)
- **Authentication**: Laravel Fortify
- **PDF Generation**: DomPDF (for invoices)
- **Payment Gateway**: PhonePe SDK v2
- **QR Code**: Bacon QR Code
- **Excel Export**: Maatwebsite Excel

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite 7
- **SSR**: Inertia.js 2
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Date Handling**: date-fns
- **Theme**: next-themes (dark mode)
- **Charts**: Recharts
- **Calendar**: React Day Picker

## Getting Started

### Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18 and npm
- MySQL or other database server

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/gympro.git
   cd gympro
   ```

2. **Install backend dependencies:**

   ```bash
   composer install
   ```

3. **Install frontend dependencies:**

   ```bash
   npm install
   ```

4. **Set up your environment:**

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configure your database in `.env`:**

   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=gympro
   DB_USERNAME=root
   DB_PASSWORD=
   ```

6. **Configure PhonePe credentials in `.env`:**

   ```env
   PHONEPE_MERCHANT_ID=your_merchant_id
   PHONEPE_MERCHANT_USER_ID=your_merchant_user_id
   PHONEPE_SALT_KEY=your_salt_key
   PHONEPE_SALT_INDEX=1
   PHONEPE_ENV=UAT
   ```

7. **Configure Google OAuth (optional) in `.env`:**

   ```env
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://127.0.0.1:8000/auth/google/callback
   ```

8. **Run database migrations and seeders:**

   ```bash
   php artisan migrate --seed
   ```

9. **Build frontend assets:**

   ```bash
   npm run build
   ```

10. **Start the development server:**

    ```bash
    # Terminal 1: Laravel server
    php artisan serve

    # Terminal 2: Vite dev server
    npm run dev
    ```

    Or use the combined command:

    ```bash
    composer dev
    ```

11. **Access the application:**

    Open your browser and navigate to `http://127.0.0.1:8000`

### Default Credentials

After running the seeder, you can log in with:

- **Admin Account**: Check your database or seeder file for default credentials

## Configuration

### Environment Variables

Key environment variables to configure:

```env
# Application
APP_NAME=Gympro
APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=gympro
DB_USERNAME=root
DB_PASSWORD=

# PhonePe Payment Gateway
PHONEPE_MERCHANT_ID=
PHONEPE_MERCHANT_USER_ID=
PHONEPE_SALT_KEY=
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=UAT

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=
```

### General Settings

After installation, configure general settings via the admin panel:

1. Log in as admin
2. Navigate to Settings > General Settings
3. Configure:
   - Application name and logo
   - Currency and tax settings
   - Business information
   - Timezone and date format

## Project Structure

```
gympro/
├── app/
│   ├── Http/Controllers/     # Application controllers
│   ├── Models/               # Eloquent models
│   └── Services/             # Business logic services
├── database/
│   ├── migrations/           # Database migrations
│   └── seeders/              # Database seeders
├── resources/
│   ├── js/
│   │   ├── components/       # React components
│   │   ├── pages/            # Inertia pages
│   │   ├── layouts/          # Layout components
│   │   └── types/            # TypeScript types
│   └── views/                # Blade templates
├── routes/
│   ├── web.php               # Web routes
│   ├── settings.php          # Settings routes
│   └── notifications.php     # Notification routes
└── public/                   # Public assets
```

## Key Features Implementation

### Role-Based Access Control

- Dynamic permission system stored in database
- Middleware-based route protection
- Frontend permission checks for UI elements
- Permissions shared via Inertia middleware

### Performance Optimizations

- Lazy loading for dropdown data
- Query optimization with eager loading
- Settings caching (1-hour TTL)
- Pagination on all list views
- Input sanitization for XSS prevention

### Payment Integration

- PhonePe payment gateway integration
- Secure payment processing
- Webhook handling for payment status
- Invoice generation with PDF
- Payment status tracking

### QR Code Check-in

- Unique QR codes for members
- Quick attendance marking
- Mobile-friendly interface

## Development

### Running Tests

```bash
php artisan test
```

### Code Formatting

```bash
# PHP (Laravel Pint)
vendor/bin/pint

# JavaScript/TypeScript (Prettier)
npm run format

# ESLint
npm run lint
```

### Type Checking

```bash
npm run types
```

## Documentation

- [Member Login Guide](MEMBER_LOGIN_GUIDE.md)
- [Member Sidebar Guide](MEMBER_SIDEBAR_GUIDE.md)
- [Payment Setup](PAYMENT_SETUP.md)
- [RBAC Setup](RBAC_SETUP.md)
- [Mobile App Guide](MOBILE_APP_GUIDE.md)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Acknowledgments

- Laravel Framework
- React and the React community
- shadcn/ui for beautiful components
- Inertia.js for seamless SPA experience
- All contributors and supporters