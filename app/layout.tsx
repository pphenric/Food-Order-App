import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Food Order App",
  description: "A food order app created with next.js",
};

export default function RootLayout(
  {children}: Readonly<{children: React.ReactNode}>
) {
  return (
    <html lang="en">
      <body>
        <div id="dialog-container"></div>
        {children}
      </body>
    </html>
  );
}
