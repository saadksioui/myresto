import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./_components/app-sidebar";



const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-50 w-full">
      <AppSidebar />
      <main className="flex-1 overflow-auto p-4 lg:p-5">
        {children}
      </main>
    </div>

  )
};

export default layout
