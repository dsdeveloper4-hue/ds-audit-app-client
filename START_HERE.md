# 🚀 Quick Start - DS Audit App

## ⚠️ IMPORTANT: First Time Setup

### Step 1: Create Environment File

**You MUST create this file or the app won't work!**

Create a file named `.env.local` in the `ds-audit-client` folder with this content:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Step 2: Install Dependencies

```bash
cd ds-audit-client
pnpm install
```

### Step 3: Start Backend Server

**In a separate terminal:**

```bash
cd ds-audit-server
npm run dev
```

Backend should start on: **http://localhost:5000**

### Step 4: Start Frontend

```bash
cd ds-audit-client
pnpm dev
```

Frontend will be available at: **http://localhost:3000**

---

## 🔑 Login Credentials

**Default credentials** (if backend is seeded):
- **Mobile**: `01712345678` (11 digits)
- **Password**: `password123`

---

## ✅ Verify Everything Works

### 1. Check Backend is Running
Open: http://localhost:5000/api/v1
- Should see: API response (not an error)

### 2. Check Frontend is Running
Open: http://localhost:3000
- Should redirect to `/login`
- See login form

### 3. Test Login
- Enter mobile and password
- Should redirect to dashboard
- See stats and navigation

### 4. Test CRUD Operations

**Rooms:**
1. Click "Rooms" in sidebar
2. Click "Add Room"
3. Fill: Name, Floor, Department
4. Click "Create"
5. Should see toast: "Room created successfully!"
6. Room appears in table

**Items:**
1. Click "Items" in sidebar
2. Click "Add Item"
3. Fill: Name, Category, Unit
4. Click "Create"
5. Should see toast: "Item created successfully!"
6. Item appears in table

**Inventory:**
1. Click "Inventory" in sidebar
2. Click "Add Inventory"
3. Select: Room, Item
4. Enter quantities
5. Click "Create"
6. Should see toast: "Inventory created successfully!"

**Audits:**
1. Click "Audits" in sidebar
2. Click "New Audit"
3. Select month/year
4. Click "Create Audit"
5. Should see toast: "Audit created with X records!"
6. Redirects to audit details
7. Edit quantities in table
8. Click "Save" for each row
9. Click "Complete Audit"
10. Should see toast: "Audit completed!"

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to API" or blank pages

**Solution 1: Check .env.local file exists**
```bash
# In ds-audit-client folder
ls -la .env.local   # Mac/Linux
dir .env.local      # Windows
```

If file doesn't exist, create it with:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

**Solution 2: Restart frontend**
```bash
# Stop the server (Ctrl+C)
# Then restart
pnpm dev
```

**Solution 3: Check backend is running**
```bash
# Check if backend responds
curl http://localhost:5000/api/v1
```

### Problem: Login fails

**Check:**
1. Backend is running on port 5000
2. Database is connected
3. User exists in database
4. Mobile number is 11 digits
5. Password is correct

### Problem: 404 errors or routing issues

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
# Restart server
pnpm dev
```

### Problem: CRUD operations don't work

**Check:**
1. `.env.local` file exists
2. Backend API is responding
3. Check browser console for errors
4. Check browser network tab for failed requests

---

## 📝 Common Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Clear cache
rm -rf .next

# Check if port is in use (Windows)
netstat -ano | findstr :3000

# Check if port is in use (Mac/Linux)
lsof -i :3000
```

---

## 🎯 Features to Test

### ✅ Authentication
- [x] Login with mobile/password
- [x] Logout
- [x] Protected routes redirect to login
- [x] User name displays in navbar

### ✅ Dashboard
- [x] Shows statistics (audits, rooms, items, inventory)
- [x] Responsive design
- [x] Dark mode toggle

### ✅ Rooms CRUD
- [x] Create room
- [x] View all rooms
- [x] Edit room
- [x] Delete room
- [x] Toast notifications

### ✅ Items CRUD
- [x] Create item with category/unit
- [x] View all items
- [x] Edit item
- [x] Delete item
- [x] Toast notifications

### ✅ Inventory CRUD
- [x] Create inventory (room + item)
- [x] View all inventories
- [x] Edit quantities (active, broken, inactive)
- [x] Delete inventory
- [x] Toast notifications

### ✅ Audit Management
- [x] Create audit (auto-generates records)
- [x] View all audits
- [x] View audit details
- [x] Edit audit records inline
- [x] Save individual records
- [x] Complete audit (updates inventory)
- [x] Delete audit
- [x] Toast notifications

---

## 📞 Support

**If you're still having issues:**

1. Check both backend and frontend terminals for errors
2. Check browser console (F12) for JavaScript errors
3. Check browser network tab for failed API requests
4. Verify `.env.local` file exists and is correct
5. Make sure backend database is running

---

## 🎉 Success Indicators

You'll know everything is working when:

✅ Login works without errors  
✅ Dashboard shows data  
✅ Can create rooms, items, inventory  
✅ Can create and complete audits  
✅ See green toast notifications on success  
✅ No red errors in browser console  
✅ All navigation links work  

---

**Need more help?** Check:
- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Detailed setup
- `IMPLEMENTATION_SUMMARY.md` - Feature list
