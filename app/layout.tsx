import "./globals.css";
import TopNav from "@/components/TopNav";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
          <TopNav />
          <main className="flex-1 flex items-center justify-center px-4">
            <div className="w-full text-center [&_*]:text-center bg-red-100">
              {children}
            </div>
          </main>
      </body>
    </html>
  );
}
