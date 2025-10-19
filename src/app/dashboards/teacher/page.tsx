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
import data from "./data.json"
import HeaderPage from "@/app/components/header"
import { useEffect, useState } from "react"
import { Frame, LifeBuoy, PieChart, Send, Settings2, SquareTerminal } from "lucide-react"


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
  const navMain = [
    {
      title: "Course",
      url: "/dashboards/teacher",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "Course Schedule", url: "#" },
        { title: "Course Activity", url: "#" },
        { title: "Quiz Activity", url: "#" },
        { title: "Video", url: "#" },
      ],
    },
    {
      title: "Attedance",
      url: "/dashboards/teacher",
      icon: Settings2,
      items: [
        { title: "Student Montly Attedance", url: "#" },
        { title: "Absent Report", url: "#" },
        { title: "Student Attendance Montly", url: "#" },
        { title: "Student Leave Application", url: "#" },
      ],
    },
    {
      title: "Assesment",
      url: "/dashboards/teacher",
      icon: Settings2,
      items: [
        { title: "Assesment Paln", url: "#" },
        { title: "Assesment Group", url: "#" },
        { title: "Assesment Results", url: "#" },
        { title: "Assesment Criteria", url: "#" },
        { title: "Grading Sacle", url: "#" },
      ],
    },
  ]

  const navSecondary = [
    { title: "Support", url: "#", icon: LifeBuoy },
  ]

  return (
    <SidebarProvider>
      {userData && userData.roles ? (
        <AppSidebar companyName={userData?.companyName} menuName="Teacher Navigations" email={userData?.email} userName={userData?.full_name} navMain={navMain} navSecondary={navSecondary} />
      ) : (
        <AppSidebar companyName="NA" menuName="Teacher Navigations" email="NA" userName="NA" navMain={navMain} navSecondary={navSecondary} />
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
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
