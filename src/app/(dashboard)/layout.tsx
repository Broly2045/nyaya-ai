import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--midnight)" }}>
      <Sidebar user={session.user as any} />
      <main
        className="flex-1 overflow-auto p-8"
        style={{ background: "#060F24" }}
      >
        {children}
      </main>
    </div>
  );
}
