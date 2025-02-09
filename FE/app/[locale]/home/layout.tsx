import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { getTranslations } from 'next-intl/server'
import { Breadcrumbs } from '@/components/Breadcrumbs'


const Layout = async ({ children  , params}: { children: React.ReactNode , params: Awaited<Promise<{locale: string }>> }) => {
  const { locale} = await params
  const t = await getTranslations("HomePage")



  return (
    <>
    <SidebarProvider>
    <AppSidebar side={locale === "en" ? "left" : "right"}/>
      <SidebarInset>
        <header className="sticky top-0 z-20 flex bg-white h-16 justify-between shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {/* <Breadcrumbs locale={locale} /> */}
          </div>
          <LanguageSwitcher currentLocale={locale} withGlobe={true} />
        </header>
        <div className='w-full h-full bg-gradient-to-b from-gray-100 to-gray-50'>
        {children}
        </div>
      </SidebarInset>
      
    </SidebarProvider>
    </>
  )
}

export default Layout