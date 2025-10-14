# DS Audit App - Frontend Setup Guide

## Quick Start (5 Minutes)

### Step 1: Install Dependencies
```bash
cd ds-audit-client
pnpm install
```

### Step 2: Configure Environment
Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Step 3: Start Development Server
```bash
pnpm dev
```

### Step 4: Access Application
Open browser to: **http://localhost:3000**

---

## Backend Requirements

**Make sure backend is running first!**

```bash
# In separate terminal, start backend
cd ../ds-audit-server
npm run dev
```

Backend should be running on: **http://localhost:5000**

---

## Login Credentials

Use the test user credentials from your backend:

**Default (after running seed/migration):**
- Mobile: `01712345678` (11 digits)
- Password: `password123`

Or use any user you've created in the database.

---

## Troubleshooting

### Issue: "Cannot connect to API"
**Solution:**
1. Check backend is running on http://localhost:5000
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check browser console for CORS errors

### Issue: "Login not working"
**Solution:**
1. Verify user exists in database
2. Check mobile number is 11 digits
3. Check backend logs for authentication errors
4. Clear browser cookies and localStorage

### Issue: "Page shows 404 or blank"
**Solution:**
1. Restart development server: `pnpm dev`
2. Clear Next.js cache: `rm -rf .next`
3. Reinstall dependencies: `pnpm install`

### Issue: "TypeScript errors in IDE"
**Solution:**
1. Restart TypeScript server in your IDE
2. Check `tsconfig.json` is correct
3. Run: `pnpm build` to see actual errors

### Issue: "Dark mode not working"
**Solution:**
- Dark mode is system-based. Check your OS settings.
- Use browser dev tools to toggle `dark` class on `<html>`

---

## Development Workflow

### 1. Create New Feature
```bash
# Create page
src/app/(protected)/my-feature/page.tsx

# Create API slice
src/redux/features/myFeature/myFeatureApi.ts

# Create types
src/types/myFeature.ts
```

### 2. Add to Navigation
Edit `src/constants/sidebarLinks.ts`:
```typescript
{
  title: "My Feature",
  href: "/my-feature",
  icon: MyIcon,
}
```

### 3. Test Changes
```bash
# Run dev server
pnpm dev

# Build to check for errors
pnpm build
```

---

## Production Build

### Build for Production
```bash
pnpm build
```

### Test Production Build Locally
```bash
pnpm start
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
```

---

## Project Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint

# Package Management
pnpm install          # Install dependencies
pnpm add <package>    # Add new package
pnpm remove <package> # Remove package
```

---

## API Integration Checklist

- [x] Authentication (login, logout, refresh)
- [x] Audits CRUD
- [x] Audit Records management
- [x] Rooms CRUD
- [x] Items CRUD
- [x] Inventory CRUD
- [x] Cache invalidation
- [x] Error handling
- [x] Loading states

---

## File Structure Reference

```
ds-audit-client/
├── src/
│   ├── app/
│   │   ├── (protected)/         # Auth-protected pages
│   │   │   ├── audits/         # Audit management
│   │   │   ├── rooms/          # Room management
│   │   │   ├── items/          # Item management
│   │   │   ├── inventory/      # Inventory management
│   │   │   ├── layout.tsx      # Protected layout
│   │   │   └── page.tsx        # Dashboard
│   │   ├── login/              # Login page
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── shared/             # Navbar, Sidebar, etc.
│   │   ├── ui/                 # shadcn/ui components
│   │   └── forms/              # Form components
│   ├── redux/
│   │   ├── api/                # Base API setup
│   │   ├── features/           # API slices
│   │   └── store.ts            # Redux store
│   ├── types/                  # TypeScript types
│   ├── schemas/                # Zod schemas
│   └── utils/                  # Utility functions
├── public/                     # Static files
├── .env.local                  # Environment variables
├── package.json                # Dependencies
└── tsconfig.json               # TypeScript config
```

---

## Testing Checklist

### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials shows error
- [ ] Logout clears session
- [ ] Protected routes redirect to login
- [ ] Token refresh works automatically

### Audit Management
- [ ] Create new audit
- [ ] View audit list
- [ ] View audit details
- [ ] Edit audit records
- [ ] Save individual records
- [ ] Complete audit
- [ ] Delete audit

### Room Management
- [ ] Create room
- [ ] Edit room
- [ ] Delete room
- [ ] View all rooms

### Item Management
- [ ] Create item
- [ ] Edit item
- [ ] Delete item
- [ ] View all items

### Inventory Management
- [ ] Create inventory
- [ ] Edit quantities
- [ ] Delete inventory
- [ ] View all inventories

---

## Performance Tips

1. **Enable caching**: RTK Query automatically caches API responses
2. **Use loading states**: All queries provide `isLoading` state
3. **Optimize images**: Use Next.js Image component
4. **Code splitting**: Automatic with Next.js App Router
5. **Minimize bundle**: Remove unused imports

---

## Security Notes

- Tokens stored in Redux Persist (encrypted localStorage)
- HTTP-only cookies for refresh tokens (backend)
- CORS configured on backend
- No sensitive data in client-side code
- Protected routes require authentication

---

## Support

**Common Issues:**
1. API connection → Check backend is running
2. Login fails → Verify credentials and backend
3. Blank page → Check browser console
4. Build errors → Run `pnpm build` for details

**For Backend Issues:**
- Check `ds-audit-server/` directory
- Review Prisma migrations
- Check database connection

---

## Next Steps After Setup

1. **Seed Database** (if not done):
   ```bash
   cd ../ds-audit-server
   npx prisma db seed
   ```

2. **Create Test Data**:
   - Add rooms (e.g., "Office A", "Warehouse 1")
   - Add items (e.g., "Laptop", "Chair", "Desk")
   - Create inventory for room-item combinations
   - Create an audit for current month

3. **Test Full Workflow**:
   - Login
   - View dashboard
   - Create audit
   - Fill in audit records
   - Complete audit
   - Verify inventory updated

---

## Production Deployment

### Vercel (Recommended)
```bash
vercel deploy
```

### Other Platforms
1. Build: `pnpm build`
2. Upload `.next/` and `public/` folders
3. Set environment variables
4. Run: `pnpm start`

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
```

---

**Ready to Go! 🚀**

Start with: `pnpm dev` and open http://localhost:3000
