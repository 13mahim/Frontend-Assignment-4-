# SkillBridge Frontend - Quick Start Guide

## ✅ Project Status

Your SkillBridge frontend is fully set up and ready to run!

## 📁 What's Included

### Pages
- ✅ Home page (landing with hero, features, CTA)
- ✅ Login page
- ✅ Register page  
- ✅ Browse Tutors page (with search & filters)
- ✅ Tutor Profile page (detailed view)
- ✅ Student Dashboard
- ✅ Student Bookings page

### Features Implemented
- ✅ User authentication (login/register)
- ✅ Role-based access (Student, Tutor, Admin)
- ✅ Browse and search tutors
- ✅ View tutor profiles with reviews
- ✅ Student dashboard with stats
- ✅ Booking management
- ✅ Responsive design
- ✅ Toast notifications
- ✅ Protected routes

## 🚀 Running the App

### Prerequisites
- Node.js 18+ installed
- Backend API running on http://localhost:5000

### Start Development Server

**Option 1: Using npm**
```bash
npm run dev
```

**Option 2: Using the setup script (Windows)**
```bash
setup.bat
```

**Option 3: Using the setup script (Mac/Linux)**
```bash
./setup.sh
```

The app will start at: **http://localhost:3000**

## 🔑 Environment Variables

Already configured in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📱 Available Routes

### Public Routes
- `/` - Home page
- `/login` - Login
- `/register` - Register
- `/tutors` - Browse tutors
- `/tutors/[id]` - Tutor profile

### Student Routes (Protected)
- `/student` - Student dashboard
- `/student/bookings` - My bookings
- `/student/profile` - Profile settings

### Tutor Routes (Protected) - To be implemented
- `/tutor` - Tutor dashboard
- `/tutor/availability` - Manage availability
- `/tutor/profile` - Profile settings

### Admin Routes (Protected) - To be implemented
- `/admin` - Admin dashboard
- `/admin/users` - Manage users
- `/admin/bookings` - All bookings
- `/admin/categories` - Manage categories

## 🧪 Testing the App

1. **Start the backend** (make sure it's running on port 5000)

2. **Start the frontend**:
   ```bash
   npm run dev
   ```

3. **Test the flow**:
   - Visit http://localhost:3000
   - Click "Sign Up" and register as a Student
   - Browse tutors at `/tutors`
   - View a tutor profile
   - Check your dashboard at `/student`

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📦 Key Dependencies

All dependencies are already installed:
- next@14.0.4
- react@18
- typescript@5
- tailwindcss@3.3.0
- @radix-ui/* (UI primitives)
- react-hook-form@7.47.0
- zod@3.22.4
- lucide-react@0.292.0

## 🔧 Project Structure

```
skillbridge-frontend/
├── app/                    # Next.js pages
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── student/           # Student dashboard & bookings
│   ├── tutors/            # Browse & view tutors
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── layout/            # Header, Footer
│   └── ui/                # shadcn/ui components
├── contexts/              # React contexts
│   ├── AuthContext.tsx    # Authentication
│   └── ToastContext.tsx   # Notifications
├── hooks/                 # Custom hooks
│   ├── useAuth.ts
│   └── useBookings.ts
├── lib/                   # Utilities
│   ├── api.ts             # API service
│   └── utils.ts           # Helper functions
├── types/                 # TypeScript types
│   └── index.ts
└── .env.local            # Environment variables
```

## 🐛 Troubleshooting

### Port already in use
If port 3000 is busy, Next.js will automatically use the next available port (3001, 3002, etc.)

### API connection errors
- Verify backend is running on http://localhost:5000
- Check `.env.local` has correct API URL
- Check browser console for CORS errors

### Module not found errors
```bash
npm install
```

### Build errors
```bash
rm -rf .next
npm run dev
```

## 📝 Next Steps

To complete the full application, you can add:

1. **Tutor Dashboard** - Create tutor pages
2. **Admin Panel** - Build admin management pages
3. **Booking Form** - Add booking creation UI
4. **Review System** - Implement review submission
5. **Profile Management** - Add profile edit pages
6. **Real-time Updates** - Add WebSocket support
7. **Payment Integration** - Add payment processing

## 🎯 Current Status

✅ **Ready for Development**
- All core pages created
- Authentication working
- API integration complete
- UI components ready
- Responsive design implemented

## 💡 Tips

- Use the Header dropdown menu to navigate between roles
- Check the browser console for API errors
- Use React DevTools to inspect component state
- Tailwind classes can be customized in `tailwind.config.js`

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com)

---

**Happy Coding! 🚀**
