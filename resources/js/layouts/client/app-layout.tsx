import { Header } from "@/components/client/Header";
import { Toaster } from "@/components/ui/sonner";
import { usePage } from "@inertiajs/react";
import { type SharedData } from '@/types';
import { toast } from "sonner";
import { useEffect } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
}



export default function AppLayout({ children }: AppLayoutProps) {
    const {flash}: any = usePage<SharedData>().props;
    useEffect(() => {
        if(flash){
            toast.info(flash);
        }
    }, [flash]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Toaster  position="top-right"/>
    </div>
  );
}
