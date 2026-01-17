import "./globals.css";

export const metadata = {
  title: "Smart Helmet Dashboard",
  description: "Crash Detection System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
