import { Frame, LifeBuoy, Send, Settings2, SquareTerminal } from "lucide-react"
export const navMain = [
    {
        title: "Admission",
        url: "/dashboards/admin",
        icon: SquareTerminal,
        isActive: true,
        items: [
            { title: "Student Applicant", url: "/dashboards/admin/pages/student/studentApplicant" },
            { title: "Student Admission", url: "/dashboards/admin/pages/student/studentAdmission" },
            { title: "Student Group", url: "/dashboards/admin/pages/student/studentGroup" },
            { title: "Student Guardian", url: "/dashboards/admin/pages/guardian" },
            { title: "Teacher Onboarding", url: "/dashboards/admin/pages/instructor" },
            { title: "Course Enrollment", url: "/dashboards/admin/pages/courses/courseEnrollment" },
            { title: "Program Enrollment", url: "/dashboards/admin/pages/program/programEnrollment" },
            { title: "Student Batch Name", url: "/dashboards/admin/pages/student/studentBatchName" },
            { title: "Student Category", url: "/dashboards/admin/pages/student/studentCategory" },
            { title: "Program", url: "/dashboards/admin/pages/program" },
            { title: "Course", url: "/dashboards/admin/pages/courses" },
        ],
    },
    {
        title: "Fees &  Structure",
        url: "#",
        icon: Settings2,
        items: [
            { title: "Fee Structure", url: "#" },
            { title: "Fee Category", url: "#" },
            { title: "Fee Schedule", url: "#" },
            { title: "Student Fee Collection", url: "#" },
            { title: "Collection Report", url: "#" },
            { title: "Program Wise-Fee Collection Report", url: "#" },
        ],
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
            { title: "Education Settings", url: "#" },
            { title: "Academic Term", url: "/dashboards/admin/pages/configurations/academicTerm" },
            { title: "Academic Year", url: "/dashboards/admin/pages/configurations/academicYear" },
            { title: "Rooms", url: "/dashboards/admin/pages/configurations/rooms" },
        ],
    },
];

export const navSecondary = [
    { title: "Support", url: "#", icon: LifeBuoy },
    { title: "Feedback", url: "#", icon: Send },
];
