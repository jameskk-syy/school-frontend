"use client"
import { AppSidebar } from "@/app/components/app-sidebar"
import { ChartAreaInteractive } from "@/app/components/chart-area-interactive"
import { DataTable } from "@/app/components/data-table"
import { SectionCards } from "@/app/components/section-cards"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import HeaderPage from "@/app/components/header"
import { useEffect, useState } from "react"
import { Frame, LifeBuoy, PieChart, Send, Settings2, SquareTerminal } from "lucide-react"
import api from "@/lib/axios"
import { TabsDemo } from "./components/new-program"
import { navMain, navSecondary } from "../../navbar_items"

export default function Page() {
    const [userData, setUserData] = useState<any>({})

    useEffect(() => {
        const storedUser = localStorage.getItem("userData")
        if (storedUser) {
            const parsed = JSON.parse(storedUser)
            setUserData(parsed)

        } else {
            setUserData(null)
        }
    }, [])
    return (
        <SidebarProvider>
            {userData && userData.roles ? (
                <AppSidebar companyName={userData?.companyName} menuName="Admin Dashboard" email={userData?.email} userName={userData?.full_name} navMain={navMain} navSecondary={navSecondary} />
            ) : (
                <AppSidebar companyName="NA" menuName="" email="NA" userName="NA" navMain={navMain} navSecondary={navSecondary} />
            )
            }
            <SidebarInset>
                {userData && userData.roles ? (
                    <HeaderPage role={userData.roles[0]} />
                ) : (
                    <HeaderPage role="Guest" />
                )}

                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-14 w-full">
                                <TabsDemo />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
