# SkillBridge Frontend

A modern tutoring platform built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- User authentication (Student, Tutor, Admin roles)
- Browse and search tutors
- Book tutoring sessions
- Manage bookings and availability
- Review system
- Admin dashboard
- Responsive design with shadcn/ui components

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **State Management**: React Context API

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on http://localhost:5000

## Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory (already created):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
skillbridge-frontend/
├── app/                      # Next.js app directory
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   └── layout/              # Layout components (Header, Footer)
├── contexts/                # React contexts
│   ├── AuthContext.tsx      # Authentication context
│   └── ToastContext.tsx     # Toast notifications
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts           # Auth hooks
│   └── useBookings.ts       # Booking hooks
├── lib/                     # Utility libraries
│   ├── api.ts               # API service
│   └── utils.ts             # Helper functions
├── types/                   # TypeScript type definitions
│   └── index.ts             # Main types
└── public/                  # Static assets

```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

The frontend connects to the backend API at `http://localhost:5000/api`. Make sure the backend is running before starting the frontend.

### API Endpoints Used

- `/auth/login` - User login
- `/auth/register` - User registration
- `/auth/me` - Get current user
- `/tutors` - Get all tutors
- `/tutors/:id` - Get tutor by ID
- `/bookings` - Manage bookings
- `/reviews` - Manage reviews
- `/categories` - Get categories
- `/admin/*` - Admin endpoints

## Key Features Implementation

### Authentication
- JWT token-based authentication
- Role-based access control (Student, Tutor, Admin)
- Protected routes with middleware
- Persistent login with localStorage

### User Roles

1. **Student**
   - Browse and search tutors
   - Book tutoring sessions
   - View and manage bookings
   - Leave reviews

2. **Tutor**
   - Manage profile and availability
   - View and manage sessions
   - Respond to booking requests

3. **Admin**
   - Manage users
   - Manage bookings
   - Manage categories
   - View dashboard statistics

## Styling

The project uses Tailwind CSS with a custom design system based on shadcn/ui. The color scheme and component styles can be customized in:

- `tailwind.config.js` - Tailwind configuration
- `app/globals.css` - CSS variables and global styles

## Development Notes

- The project uses Next.js 14 App Router
- All pages are client components (`'use client'`) for interactivity
- Form validation uses Zod schemas
- Toast notifications for user feedback
- Responsive design for mobile and desktop

## Next Steps

To complete the full implementation, you would need to add:

1. Tutor browsing page with filters
2. Tutor profile page with booking
3. Student dashboard
4. Tutor dashboard
5. Admin dashboard
6. Booking management components
7. Review components
8. Additional UI components (Sheet, Dialog, etc.)

## License

MIT
