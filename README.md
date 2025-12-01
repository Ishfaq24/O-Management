# 🏢 Office Management System

A modern full-stack **Office Management System** designed to manage **employees, attendance, projects, profile data, and admin workflows** with a clean UI and scalable backend.

Built using **React + Vite + Tailwind + Clerk + Supabase**.

---

## ✨ Features (All in One)

---

### 👤 User & Profile Management

- Secure login/signup using **Clerk**
- Auto-creation of user profiles in Supabase
- Roles supported:
  - `admin`
  - `manager`
  - `employee`
- Users can update:
  - Full Name
  - Department
  - Phone
  - Avatar
- Admin dashboard to view & manage all employee profiles

---

### 🕒 Attendance Management

- One-click **Check-In** and **Check-Out**
- Prevents double check-in attempts
- Tracks:
  - Timestamps  
  - Auto date  
  - Optional notes  
- Admin can view attendance for all users  
- Real-time UI updates and toast notifications

---

### 📁 Project Management

- Admins/Managers can create projects  
- Project fields include:
  - Title  
  - Description  
  - Status (`active`, `pending`, `completed`)
  - Start Date  
  - End Date  
  - Assigned Manager  
- View all projects or filter by manager  

---

### 👥 Project Assignment System

- Assign employees to specific projects  
- Store role-based assignments (Developer, Designer, Tester, etc.)  
- Supports many-to-many relations between users and projects  

---

### 🧭 Admin Dashboard

- View all employees  
- View global attendance logs  
- Manage projects & assignments  
- Modify roles (employee → manager → admin)  
- Clean interface with responsive navbar  

---

## 🔐 Authentication Flow

1. User logs in using **Clerk**  
2. Clerk sends user data → Supabase  
3. A new profile entry is created in the `profiles` table:


4. All features rely on the Supabase profile:
- Attendance  
- Projects  
- Assignments  
- Admin controls  

---

## 🗂️ Database Schema

### **profiles**
```sql
create table profiles (
id uuid primary key references auth.users(id) on delete cascade,
full_name text,
role text default 'employee',
department text,
phone text,
avatar_url text,
created_at timestamptz default now()
);




🧪 Tech Stack
Frontend

React + Vite

Tailwind CSS

DaisyUI

Shadcn UI

React Router DOM

Lucide Icons

Backend / Database

Supabase PostgreSQL

Supabase Auth

RLS Policies

Realtime Queries

Authentication

Clerk Authentication

Clerk → Supabase Profile Sync

📸 Screenshots (Add yours)
/screenshots/login.png
/screenshots/dashboard.png
/screenshots/attendance.png
/screenshots/projects.png

▶️ Installation & Setup
1️⃣ Clone the repo
git clone https://github.com/your-username/office-management-system.git
cd office-management-system

2️⃣ Install dependencies
npm install

3️⃣ Add environment variables

Create a .env.local file:

VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CLERK_SECRET_KEY=your_clerk_secret

4️⃣ Start development server
npm run dev

📁 Folder Structure
/src
  /components
  /pages
  /hooks
  /lib
  /context
  App.jsx
  main.jsx

🚀 Future Enhancements

Attendance analytics dashboard

Task management inside projects

Payroll automation

Leave application & approval workflow

Email & push notifications

Export attendance to CSV or PDF

Advanced role-based protected routes

🤝 Contributing

Pull requests are welcome!
Please open an issue before making major changes.

