import React from "react";
import "./globals.css";

export const metadata = {
  title: "VISIBLE MC | Vote Portal",
  description: "A clean, modern voting portal and website for the VISIBLE MC Minecraft server.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
