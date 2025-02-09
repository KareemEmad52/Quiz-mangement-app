"use client"

import type * as React from "react"
import { BookCheck, BookOpen, BookOpenCheck, Brain, CirclePlus, History, Home, LogOut, User, Users } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { useAppStore } from "@/lib/Store/Store"
import type { User as userType } from "@/types/types"
import { useIsMobile } from "@/hooks/use-mobile"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations("HomePage")
  const user: userType = useAppStore((state) => state.user)
  const activeQuizID = useAppStore((state) => state.quizId)
  const { setOpenMobile } = useSidebar()
  const isMobile = useIsMobile()

  const data = {
    navMain: [
      {
        title: t("home"),
        url: "/home",
        icon: <Home className="h-4 w-4" />,
      },
      {
        title: t("available-quiz"),
        url: "/home/available-quiz",
        icon: <BookOpen className="h-4 w-4" />,
      },
      {
        title: t("quiz"),
        url: `/home/quiz/${activeQuizID}`,
        icon: <BookCheck className="h-4 w-4" />,
      },
      {
        title: t("scores-history"),
        url: "/home/scores-history",
        icon: <History className="h-4 w-4" />,
      },
      {
        title: t("profile"),
        url: "/home/profile",
        icon: <User className="h-4 w-4" />,
      },
    ],
  }

  if (user.role === "admin") {
    data.navMain.push(
      {
        title: t("generate-quiz"),
        url: "/home/generate-quiz",
        icon: <CirclePlus className="h-4 w-4" />,
      },
      {
        title: t("students"),
        url: "/home/students",
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: t("edit-quiz"),
        url: "/home/edit-quiz",
        icon: <BookOpenCheck className="h-4 w-4" />,
      },
    )
  }

  const handleItemClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/" onClick={handleItemClick}>
              <SidebarMenuButton size="lg" asChild>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-semibold">QuizMaster</span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url} onClick={handleItemClick}>
                  <SidebarMenuButton asChild>
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <div className="font-medium">{item.title}</div>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/login" onClick={handleItemClick}>
              <SidebarMenuButton asChild className="cursor-pointer">
                <div className="flex items-center gap-2 p-5">
                  <LogOut /> {t("logout")}
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

