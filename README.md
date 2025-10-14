# Digital Seba - Audit Management System (Frontend)

A professional inventory audit management system built with Next.js 15, TypeScript, Redux Toolkit, and shadcn/ui.

## 🚀 Features

- **Dashboard** - Overview of audits, rooms, items, and inventory statistics
- **Audit Management** - Create, update, and complete monthly inventory audits
- **Room Management** - Manage locations with floor and department organization
- **Item Management** - Track items with categories and units
- **Inventory Tracking** - Monitor quantities (active, broken, inactive) by room and item
- **Audit Records** - Real-time inline editing with auto-save functionality
- **Dark Mode** - Full dark mode support
- **Responsive Design** - Mobile-first, works on all devices
- **Authentication** - Secure login with JWT and Redux Persist

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit + RTK Query
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 📋 Prerequisites

- Node.js 20+ 
- pnpm (recommended) or npm
- Backend API running on `http://localhost:5000`

## 🔧 Installation

1. **Install dependencies**:
```bash
pnpm install
```

2. **Set up environment variables**:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

3. **Run the development server**:
```bash
pnpm dev
```

4. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (protected)/       # Protected routes (requires auth)
│   │   ├── audits/        # Audit pages
│   │   ├── rooms/         # Room management
│   │   ├── items/         # Item management
│   │   ├── inventory/     # Inventory management
│   │   └── layout.tsx     # Protected layout with sidebar
│   ├── login/             # Login page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── shared/            # Shared components (Navbar, Sidebar, etc.)
│   ├── ui/                # shadcn/ui components
│   └── forms/             # Form components
├── redux/                 # Redux store
│   ├── api/               # RTK Query base API
│   ├── features/          # Feature slices (auth, audit, room, etc.)
│   └── store.ts           # Redux store configuration
├── types/                 # TypeScript type definitions
├── schemas/               # Zod validation schemas
├── constants/             # Constants (sidebar links, etc.)
└── utils/                 # Utility functions
```

## 🔐 Authentication

The app uses JWT-based authentication:
- Login with mobile number (11 digits) and password
- Access token stored in Redux Persist
- Refresh token handled automatically
- Protected routes redirect to login if not authenticated

**Default Test Credentials** (if seeded):
- Mobile: `01712345678`
- Password: `password123`

## 🎨 UI Components

Built with **shadcn/ui** components:
- Button, Card, Input, Label
- Table, Badge, Skeleton
- Dropdown Menu, Select, Popover
- Form components with validation

## 📡 API Integration

All API calls use **RTK Query** for:
- Automatic caching
- Optimistic updates
- Tag-based cache invalidation
- Loading and error states

### Available API Slices:
- `auditApi` - Audit CRUD operations
- `auditRecordApi` - Audit record management
- `roomApi` - Room management
- `itemApi` - Item management
- `inventoryApi` - Inventory tracking
- `authApi` - Authentication

## 🧪 Development

```bash
# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:5000/api/v1` |

## 🚀 Deployment

1. **Build the application**:
```bash
pnpm build
```

2. **Deploy to Vercel** (recommended):
```bash
vercel deploy
```

Or deploy to any Node.js hosting platform that supports Next.js.

## 📄 License

© 2025 Digital Seba. All rights reserved.
