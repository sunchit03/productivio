import './globals.css';

export const metadata = {
  title: 'Productivio',
  description: 'Boost your productivity',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
