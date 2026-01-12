import "./globals.css";
import Sidebar from "../components/sidebar";

export const metadata = {
  title: "iProvidence",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex">
        <Sidebar />

        {/* 사이드바 오른쪽 영역 */}
        <main className="flex-1 ml-64 p-6 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}