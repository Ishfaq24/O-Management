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

projects
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text default 'active',
  start_date date,
  end_date date,
  manager_id uuid references profiles(id),
  created_at timestamptz default now()
);

attendance
create table attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  check_in timestamptz,
  check_out timestamptz,
  date date default (now()::date),
  note text,
  created_at timestamptz default now()
);

project_assignments
create table project_assignments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  role text,
  created_at timestamptz default now()
);



```
## 🧪 Tech Stack

### **Frontend**
- ⚛️ React + Vite  
- 🎨 Tailwind CSS  
- 🌼 DaisyUI  
- 🎛️ Shadcn UI  
- 🔀 React Router DOM  
- 🔧 Lucide Icons  

### **Backend / Database**
- 🗄️ Supabase PostgreSQL  
- 🔐 Supabase Auth  
- 🛡️ Row Level Security (RLS) Policies  
- ⚡ Realtime Queries  

### **Authentication**
- 🔑 Clerk Authentication  
- 🔄 Clerk → Supabase Profile Sync  


## ▶️ Installation & Setup

### 1️⃣ Clone the repository
```sh
git clone https://github.com/ishfaq24/office-management-system.git
cd office-management-system



2️⃣ Install dependencies
npm install

3️⃣ Configure environment variables

Create a .env.local file in the project root:

VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CLERK_SECRET_KEY=your_clerk_secret

4️⃣ Start the development server
npm run dev

📁 Folder Structure
src/
 ├── components/
 ├── pages/
 ├── hooks/
 ├── lib/
 ├── context/
 ├── App.jsx
 └── main.jsx

🚀 Future Enhancements

📊 Attendance analytics dashboard

📌 Task management within projects

💰 Payroll automation

📝 Leave application & approval workflow

📩 Email & push notifications

📤 Export attendance to CSV or PDF

🛡️ Advanced role-based protected routes

🤝 Contributing

Pull requests are welcome!
Please open an issue first to discuss any major changes.
