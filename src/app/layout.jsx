import "./globals.css";

export const metadata = {
  title: "Tournament Bracket Manager",
  description: "Tournament bracket generator and manager",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}