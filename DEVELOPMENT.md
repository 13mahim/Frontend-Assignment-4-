# SkillBridge Frontend - Development Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Initial Setup

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Configure environment**:
   - Check `.env.local` file exists
   - Verify API URL points to your backend

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   - Navigate to http://localhost:3000

## 📂 Project Structure Explained

### `/app` - Next.js App Router
This directory contains all your pages and routes. Next.js uses file-based routing.

```
app/
├── layout.tsx          # Root layout (wraps all pages)
├── page.tsx            # Home page (/)
├── globals.css         # Global styles
├── login/
│   └── page.tsx        # Login page (/login)
├── register/
│   └── page.tsx        # Register page (/register)
├── student/
│   ├── page.tsx        # Student dashboard (/student)
│   └── bookings/
│       └── page.tsx    # Bookings page (/student/bookings)
└── tutors/
    ├── page.tsx        # Browse tutors (/tutors)
    └── [id]/
        └── page.tsx    # Tutor profile (/tutors/:id)
```

### `/components` - Reusable Components

```
components/
├── layout/
│   ├── Header.tsx      # Navigation header
│   └── Footer.tsx      # Footer
└── ui/                 # shadcn/ui components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    └── ...
```

### `/contexts` - React Context Providers

```
contexts/
├── AuthContext.tsx     # Authentication state & methods
└── ToastContext.tsx    # Toast notification system
```

### `/hooks` - Custom React Hooks

```
hooks/
├── useAuth.ts          # Auth helpers (useRequireAuth, useRequireRole)
└── useBookings.ts      # Booking management
```

### `/lib` - Utility Libraries

```
lib/
├── api.ts              # API service class
└── utils.ts            # Helper functions (cn, etc.)
```

### `/types` - TypeScript Definitions

```
types/
└── index.ts            # All type definitions
```

## 🎨 Adding New Pages

### 1. Create a New Public Page

```bash
# Create directory
mkdir -p app/about

# Create page file
touch app/about/page.tsx
```

```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">About Us</h1>
      <p>Your content here...</p>
    </div>
  );
}
```

### 2. Create a Protected Page

```tsx
// app/student/profile/page.tsx
'use client';

import { useRequireRole } from '@/hooks/useAuth';

export default function StudentProfilePage() {
  const { user, loading } = useRequireRole(['STUDENT']);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Profile: {user?.name}</h1>
    </div>
  );
}
```

## 🧩 Adding New Components

### 1. Create a UI Component

```tsx
// components/ui/my-component.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary'
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "base-styles",
          variant === 'primary' && "primary-styles",
          className
        )}
        {...props}
      />
    )
  }
)
MyComponent.displayName = "MyComponent"

export { MyComponent }
```

### 2. Create a Feature Component

```tsx
// components/bookings/BookingCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Booking } from '@/types';

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({ booking }: BookingCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3>{booking.subject}</h3>
        <Badge>{booking.status}</Badge>
      </CardContent>
    </Card>
  );
}
```

## 🔌 Working with the API

### 1. Using the API Service

```tsx
import { api } from '@/lib/api';

// In a component
const fetchData = async () => {
  try {
    const tutors = await api.getTutors();
    console.log(tutors);
  } catch (error) {
    console.error('Failed to fetch:', error);
  }
};
```

### 2. Adding New API Endpoints

```typescript
// lib/api.ts
class ApiService {
  // ... existing methods

  // Add new method
  async getMyNewEndpoint() {
    return this.request<ResponseType>('/my-endpoint');
  }

  async postMyNewEndpoint(data: RequestType) {
    return this.request<ResponseType>('/my-endpoint', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}
```

## 🎯 Using Context

### 1. Auth Context

```tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function MyComponent() {
  const { user, login, logout } = useAuth();

  return (
    <div>
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <button onClick={() => login({ email, password })}>
          Login
        </button>
      )}
    </div>
  );
}
```

### 2. Toast Context

```tsx
'use client';

import { useToast } from '@/contexts/ToastContext';

export default function MyComponent() {
  const { showToast } = useToast();

  const handleAction = () => {
    showToast({
      title: 'Success',
      description: 'Action completed',
      type: 'success'
    });
  };

  return <button onClick={handleAction}>Do Something</button>;
}
```

## 🎨 Styling Guidelines

### 1. Using Tailwind Classes

```tsx
// Good: Use Tailwind utility classes
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
</div>

// Use cn() for conditional classes
<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)}>
  Content
</div>
```

### 2. Responsive Design

```tsx
<div className="
  grid 
  grid-cols-1          /* Mobile: 1 column */
  md:grid-cols-2       /* Tablet: 2 columns */
  lg:grid-cols-3       /* Desktop: 3 columns */
  gap-4
">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### 3. Custom Colors

```tsx
// Use theme colors from tailwind.config.js
<div className="bg-primary text-primary-foreground">
  Primary colored box
</div>

<div className="bg-secondary text-secondary-foreground">
  Secondary colored box
</div>
```

## 📝 Forms with React Hook Form

### 1. Basic Form

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
});

type FormData = z.infer<typeof schema>;

export default function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input {...register('name')} placeholder="Name" />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Input {...register('email')} type="email" placeholder="Email" />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## 🔒 Protected Routes

### 1. Require Authentication

```tsx
'use client';

import { useRequireAuth } from '@/hooks/useAuth';

export default function ProtectedPage() {
  const { user, loading } = useRequireAuth('/login');

  if (loading) return <div>Loading...</div>;

  return <div>Protected content for {user?.name}</div>;
}
```

### 2. Require Specific Role

```tsx
'use client';

import { useRequireRole } from '@/hooks/useAuth';

export default function AdminPage() {
  const { user, loading } = useRequireRole(['ADMIN'], '/');

  if (loading) return <div>Loading...</div>;

  return <div>Admin content</div>;
}
```

## 🧪 Testing

### Running Tests (when added)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚀 Building for Production

### 1. Build the App

```bash
npm run build
```

### 2. Test Production Build

```bash
npm start
```

### 3. Analyze Bundle Size

```bash
npm run build
# Check the output for bundle sizes
```

## 🐛 Debugging

### 1. Browser DevTools
- Open Chrome DevTools (F12)
- Check Console for errors
- Use React DevTools extension
- Check Network tab for API calls

### 2. VS Code Debugging
Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    }
  ]
}
```

### 3. Common Issues

**Port already in use:**
```bash
# Kill process on port 3000
npx kill-port 3000
```

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**
```bash
rm -rf .next
npm run build
```

## 📦 Adding Dependencies

### 1. Install Package

```bash
npm install package-name
```

### 2. Install Dev Dependency

```bash
npm install -D package-name
```

### 3. Update Dependencies

```bash
npm update
```

## 🎯 Best Practices

### 1. Component Organization
- One component per file
- Use TypeScript interfaces for props
- Export component as default
- Keep components small and focused

### 2. State Management
- Use React Context for global state
- Use local state for component-specific data
- Use custom hooks for reusable logic

### 3. API Calls
- Always use try-catch
- Show loading states
- Handle errors gracefully
- Use toast notifications for feedback

### 4. TypeScript
- Define types for all props
- Use interfaces over types when possible
- Avoid `any` type
- Use type inference when obvious

### 5. Performance
- Use `'use client'` only when needed
- Lazy load heavy components
- Optimize images with Next.js Image
- Minimize bundle size

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Hook Form](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📞 Support

For issues or questions:
- Check the documentation
- Review existing code examples
- Ask the team

---

**Happy Coding! 🚀**
