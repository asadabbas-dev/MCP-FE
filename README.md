# My Class Portal (MCP) - Frontend

A comprehensive academic management system frontend built with Next.js, Tailwind CSS, and Lucide React.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Fix npm cache permissions** (if needed):
   ```bash
   sudo chown -R $(whoami) ~/.npm
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js app router
│   ├── (auth)/              # Authentication routes
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── dashboard/      # Main dashboard
│   │   ├── courses/        # Courses page
│   │   ├── results/        # Results page
│   │   ├── assignments/    # Assignments page
│   │   ├── notifications/  # Notifications page
│   │   ├── timetable/      # Timetable page
│   │   ├── library/         # Library page
│   │   ├── forum/          # Forum page
│   │   ├── lost-found/     # Lost & Found page
│   │   └── requests/       # Requests page
│   └── layout.js           # Root layout
├── components/              # React components
│   ├── common/             # Common UI components
│   │   ├── button.jsx
│   │   ├── input.jsx
│   │   ├── card.jsx
│   │   ├── loading.jsx
│   │   └── alert.jsx
│   └── dashboard/          # Dashboard components
│       ├── sidebar.jsx
│       └── header.jsx
└── lib/                    # Utilities and helpers
    └── utils/
        ├── index.js        # General utilities
        └── api.js          # API helper functions
```

## 🎨 Features

### Authentication
- Login page
- Registration page
- Role-based access (Student/Teacher/Admin)

### Dashboard
- Overview with academic summary
- Quick stats (courses, assignments, exams, library)
- Today's timetable
- Recent notifications

### Pages
- **Courses**: View enrolled courses
- **Results**: Semester results and CGPA
- **Assignments**: Submit and track assignments
- **Notifications**: View announcements and alerts
- **Timetable**: Weekly class schedule
- **Library**: Borrowed books management
- **Forum**: Community discussions
- **Lost & Found**: Report and browse items
- **Requests**: Submit requests and feedback

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: JavaScript (not TypeScript)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Forms**: React Hook Form (to be integrated)
- **HTTP Client**: Axios (configured)

## 📝 Naming Convention

- **Folders and files**: kebab-case
- **Components**: PascalCase (e.g., `Button.jsx`)
- **Functions**: camelCase

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Next Steps

1. Connect to backend API (when backend is ready)
2. Implement authentication state management
3. Add form validation
4. Implement file uploads
5. Add loading states and error handling
6. Integrate AI Chatbot (when ready)

## 📄 License

This project is part of a final year project for a university student in Pakistan.
