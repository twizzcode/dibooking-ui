
import { Navbar } from "@/components/navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="w-full fixed top-0 z-100">
        <Navbar className="bg-background border-b border-border" />
      </div>
      {children}
    </>
  );
}
