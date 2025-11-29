"use client"

import { usePathname } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

// Route configuration for breadcrumb labels
const routeLabels: Record<string, { parent?: string; label: string }> = {
  "/": { label: "Dashboard" },
  "/wallet": { label: "Wallet" },
  "/wallet/generator": { parent: "Wallet", label: "Mnemonic Generator" },
}

export function SiteHeader() {
  const pathname = usePathname()

  // Get breadcrumb info for current route
  const currentRoute = routeLabels[pathname] || { label: "Page" }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {currentRoute.parent && (
            <>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  {currentRoute.parent}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage>{currentRoute.label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  )
}
