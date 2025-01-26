This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




productivio-frontend/
├── public/                     # Static assets
│   ├── assets/                 # App-specific assets
│   │   ├── images/             # Images (e.g., logos, hero images)
│   │   └── icons/              # Icons used across the app
│   └── .svg                    # svg images for the app
├── src/                        # Main application source
│   ├── app/                    # Next.js App Directory (if enabled)
│   │   ├── page.js             # Homepage entry point
│   │   ├── layout.js           # Shared layout (includes Navbar & Footer)
│   │   └── components/         # Components specific to pages
│   │       ├── home            #main page
│   │       |   ├── Navbar.js       # Top navigation bar
│   │       |   ├── Footer.js       # Footer for all pages
│   │       |   ├── HeroSection.js  # Hero section of the homepage
│   │       |   └── FeatureCard.js  # Reusable card for features section
│   │       └── tasks           #task and other functionality page(contains components further)
│   ├── components/             # Reusable global components
│   │   ├── Button.js           # Reusable button component
│   │   └── InputField.js       # Reusable input field component (for future)
│   ├── styles/                 # Styling for the app
│   │   ├── globals.css         # Global styles (e.g., typography, resets)
│   │   ├── Navbar.module.css   # Scoped styles for Navbar
│   │   ├── Footer.module.css   # Scoped styles for Footer
│   │   ├── HeroSection.module.css # Scoped styles for Hero Section
│   │   └── FeatureCard.module.css # Scoped styles for FeatureCard
│   ├── context/                # Context API for global state management
│   │   ├── AuthContext.js      # Authentication context
│   │   └── ThemeContext.js     # Theme-related context (e.g., dark mode)
│   ├── hooks/                  # Custom hooks
│   │   ├── useAuth.js          # Hook for authentication logic
│   │   ├── useDarkMode.js      # Hook for toggling dark mode
│   │   └── useFeatures.js      # Hook for fetching features
│   ├── services/               # API calls and backend communication
│   │   ├── authService.js      # Authentication-related API calls
│   │   ├── featureService.js   # Features-related API calls
│   │   └── apiClient.js        # Axios or Fetch client setup
│   ├── utils/                  # Utility functions and constants
│       ├── constants.js        # Shared constants (e.g., feature data)
│       └── formatDate.js       # Helper function for date formatting                              
├── .env                        # Environment variables (e.g., API keys)
├── .gitignore                  # Files and folders to ignore in Git
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and project metadata
├── postcss.config.js           # Tailwind/PostCSS configuration
├── tailwind.config.js          # Tailwind configuration
└── README.md                   # Documentation for the project

To run the frontend-

-- npm install
-- npm run dev
-- Local: http://localhost:3000

Tech Stack
Frontend: Next.js, React
Styling: Tailwind CSS
State Management: Context API
API Integration: Axios / Fetch
Version Control: Git/GitHub



