
import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";



export const metadata: Metadata = {
  title: "Blockchain Dev Tools",
  description: "Tools for developing on the blockchain",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen"
          style={{ fontFamily: 'Monaco, "Bitstream Vera Sans Mono", "Lucida Console", Terminal, "Courier New", monospace' }}>
          <Sidebar />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
