/* eslint-disable import/no-anonymous-default-export */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "bg-blue-500", "bg-green-500", "bg-red-500", "bg-purple-500", "bg-yellow-500", "bg-pink-500", 
    "bg-orange-500", "bg-lime-500", "bg-teal-500", "text-rose-500", "text-amber-500", "text-blue-500", "text-teal-400",
    "text-red-600", "text-yellow-600", "text-blue-600", "text-green-600"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      transitionProperty : {
        'width': 'width'
      },
    },
    screens: {
      xxl: { max: "1536px" },
			// => @media (max-width: 1536px) { ... }

			xl: { max: "1279px" },
			// => @media (max-width: 1279px) { ... }

      xllg: {max: "1130px"},
			// => @media (max-width: 1130px) { ... }

			lg: { max: "1023px" },
			// => @media (max-width: 1023px) { ... }

      mdlg: { max: "952px" },
			// => @media (max-width: 952px) { ... }

			md: { max: "767px" },
			// => @media (max-width: 767px) { ... }

			sm: { max: "639px" },
			// => @media (max-width: 639px) { ... }

      xssm: { max: "550px" },
      // => @media (max-width: 550px) { ... }

      xs: { max: "499px" },
      // => @media (max-width: 499px) { ... }
		},
  },
  plugins: [],
};
