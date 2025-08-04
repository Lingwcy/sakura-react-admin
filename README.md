# Sakura React Admin

A modern, feature-rich React admin dashboard built with cutting-edge technologies for enterprise-level applications.

## ✨ Features

### 🎨 Modern UI/UX
- **Responsive Design**: Fully responsive layout that works seamlessly across desktop, tablet, and mobile devices
- **Dark/Light Theme**: Built-in theme switching with `next-themes` integration
- **Component Library**: Comprehensive UI components built with Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system

### 🛠️ Developer Experience
- **TypeScript**: Full TypeScript support for type safety and better development experience
- **React 19**: Latest React features with concurrent rendering
- **Vite**: Lightning-fast build tool with HMR (Hot Module Replacement)
- **ESLint**: Code quality enforcement with modern linting rules

### 📊 Data Management
- **TanStack Table**: Powerful data tables with sorting, filtering, and pagination
- **React Query**: Efficient server state management and caching
- **Zustand**: Lightweight state management for client-side state
- **Form Handling**: React Hook Form with Zod validation

### 🔧 Admin Features
- **API Tool**: Built-in API testing tool with request/response inspection
- **Server Management**: Minecraft server archive and review system
- **User Management**: Comprehensive user CRUD operations
- **File Upload**: Drag-and-drop file upload functionality

### 🏗️ Architecture
- **Component-Based**: Modular component architecture for scalability
- **Custom Hooks**: Reusable hooks for common functionality
- **Type Safety**: Comprehensive TypeScript types throughout the application
- **Mock API**: Development-friendly mock API using MockJS

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd react-jike

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run production` - Start production build preview
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🛡️ Tech Stack

### Core
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend tooling

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful & consistent icons
- **Class Variance Authority** - Component variant management

### State Management
- **Zustand** - Lightweight state management
- **TanStack React Query** - Server state management
- **React Hook Form** - Performant forms with easy validation

### Data & Validation
- **Zod** - TypeScript-first schema validation
- **Axios** - Promise-based HTTP client
- **MockJS** - Mock data generation

### Development Tools
- **ESLint** - Code linting
- **Faker.js** - Generate fake data for testing
- **Vite Plugin Mock** - API mocking during development

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   ├── table/          # Data table components
│   └── createDialog/   # Modal dialogs
├── pages/              # Application pages
│   ├── Tools/          # Tool pages (API testing, etc.)
│   ├── Server/         # Server management pages
│   └── Publish/        # Publishing features
├── store/              # Zustand stores
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── apis/               # API layer
```

## 🎯 Key Features Breakdown

### API Testing Tool
- Support for GET, POST, PUT, DELETE requests
- Request/response header inspection
- Built-in API endpoint selector
- Response formatting and syntax highlighting

### Data Tables
- Server-side and client-side pagination
- Column sorting and filtering
- Row selection with bulk operations
- Responsive design with mobile optimization

### Server Management
- Minecraft server listing and management
- Server status monitoring
- Archive and review system
- Badge system for server types and versions

### Form Management
- Dynamic form validation
- File upload with drag-and-drop
- Switch between URL and file upload modes
- Real-time validation feedback

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [TanStack](https://tanstack.com/) for powerful data management tools
- [Lucide](https://lucide.dev/) for beautiful icons
