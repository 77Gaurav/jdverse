# JDVerse

A modern web application built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS v4** — initialized with **Bun** for fast package management and runtime.

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.1+ recommended) — install via:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Installation

```bash
# Clone the repository
git clone https://github.com/77Gaurav/jdverse.git
cd jdverse

# Install dependencies (using Bun)
bun install

Add .env file with Gemini API key (Google-Ai-Studio) 
    
    GEMINI_API_KEY = {your gemini key here}

# Start the development server
bun run dev
```

Your app will be running at [http://localhost:3000](http://localhost:3000).

### Other Scripts

| Command            | Description                      |
|--------------------|----------------------------------|
| `bun run dev`      | Start the development server     |
| `bun run build`    | Build the application for production |
| `bun run start`    | Start the production server      |
| `bun run lint`     | Run ESLint across the codebase   |

## 🏗️ Project Structure

```
jdverse/
├── app/                    # App Router directory
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts    # Example API route
│   ├── favicon.ico
│   ├── globals.css         # Global styles (Tailwind)
│   ├── layout.tsx          # Root layout component
│   └── page.tsx            # Home page
├── public/                 # Static assets
├── .gitignore
├── bun.lock                # Bun lockfile
├── eslint.config.mjs       # ESLint flat config
├── next.config.ts          # Next.js configuration
├── package.json
├── postcss.config.mjs      # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md
```

## 🧰 Tech Stack

| Technology        | Version    | Purpose                  |
|-------------------|------------|--------------------------|
| [Next.js](https://nextjs.org/)    | 16.2.6     | React framework (App Router) |
| [React](https://react.dev/)       | 19.2.4     | UI library               |
| [TypeScript](https://www.typescriptlang.org/) | ^5         | Type-safe JavaScript     |
| [Tailwind CSS](https://tailwindcss.com/) | ^4         | Utility-first CSS        |
| [Bun](https://bun.sh/)           | —          | Package manager & runtime |
| [React Icons](https://react-icons.github.io/react-icons/) | ^5.6.0     | Icon library             |
| [next-themes](https://github.com/pacocoursey/next-themes) | ^0.4.6     | Dark mode support        |
| [ESLint](https://eslint.org/)     | ^9         | Code linting             |

## ✨ Features

- ⚡ **Next.js App Router** — file-based routing with React Server Components
- 🎨 **Tailwind CSS v4** — modern utility-first styling with improved performance
- 🌓 **Dark Mode** — theme switching via `next-themes`
- 🧩 **React Icons** — popular icon sets ready to use
- 📡 **API Routes** — backend endpoints in `app/api/`
- 🛡️ **TypeScript** — full type safety across the codebase

## 🖥️ API Endpoints

| Method | Endpoint            | Description          |
|--------|---------------------|----------------------|
| GET    | `/api/analyze`      | Analyze endpoint     |

*(Add more endpoints and documentation as needed.)*

## 📦 Dependencies

All dependencies are installed with Bun. Key packages:

**Production:**
- `next`, `react`, `react-dom`
- `next-themes`, `react-icons`

**Development:**
- `typescript`, `@types/react`, `@types/node`
- `tailwindcss`, `@tailwindcss/postcss`
- `eslint`, `eslint-config-next`

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/my-feature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/my-feature`).
5. Open a Pull Request.

## 📄 License

This project is private and not licensed for public use.

---

Built by Gaurav with ❤️ using [Bun](https://bun.sh/) + [Next.js](https://nextjs.org/).