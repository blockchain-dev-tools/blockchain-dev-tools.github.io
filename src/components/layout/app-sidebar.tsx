"use client"

import * as React from "react"
import {
  ArrowRightLeft,
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  FileCode,
  Frame,
  GalleryVerticalEnd,
  Key,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Wallet,
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavGroup } from "@/components/layout/nav-group"
import { NavProjects } from "@/components/layout/nav-projects"
import { NavUser } from "@/components/layout/nav-user"
import { TeamSwitcher } from "@/components/layout/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: {
    name: "Common",
    items: [
      {
        title: "Wallet",
        url: "#",
        icon: Wallet,
        isActive: true,
        items: [
          {
            title: "Mnemonic Generator",
            url: "/wallet/mnemonic-generator",
          },
        ],
      },
      // {
      //   title: "Models",
      //   url: "#",
      //   icon: Bot,
      //   items: [
      //     {
      //       title: "Genesis",
      //       url: "#",
      //     },
      //     {
      //       title: "Explorer",
      //       url: "#",
      //     },
      //     {
      //       title: "Quantum",
      //       url: "#",
      //     },
      //   ],
      // },
      // {
      //   title: "Documentation",
      //   url: "#",
      //   icon: BookOpen,
      //   items: [
      //     {
      //       title: "Introduction",
      //       url: "#",
      //     },
      //     {
      //       title: "Get Started",
      //       url: "#",
      //     },
      //     {
      //       title: "Tutorials",
      //       url: "#",
      //     },
      //     {
      //       title: "Changelog",
      //       url: "#",
      //     },
      //   ],
      // },
      // {
      //   title: "Settings",
      //   url: "#",
      //   icon: Settings2,
      //   items: [
      //     {
      //       title: "General",
      //       url: "#",
      //     },
      //     {
      //       title: "Team",
      //       url: "#",
      //     },
      //     {
      //       title: "Billing",
      //       url: "#",
      //     },
      //     {
      //       title: "Limits",
      //       url: "#",
      //     },
      //   ],
      // },
    ]
  },
  navEvm: {
    name: "EVM",
    items: [
      {
        title: "Transaction",
        url: "#",
        icon: ArrowRightLeft,
        isActive: true,
        items: [
          {
            title: "Transaction Decoder",
            url: "/evm/tx-decoder",
          },
        ],
      },
      {
        title: "Contract",
        url: "#",
        icon: FileCode,
        isActive: true,
        items: [
          {
            title: "ABI Decoder",
            url: "/evm/abi-decoder",
          },
        ],
      },
      {
        title: "Crypto",
        url: "#",
        icon: Key,
        isActive: true,
        items: [
          {
            title: "Signature Recover",
            url: "/evm/recover",
          },
          {
            title: "Private Key to Address",
            url: "/evm/privatekey-to-address",
          },
        ],
      },
    ]
  },
  navSol: {
    name: "SOL",
    items: [
      {
        title: "Transaction",
        url: "#",
        icon: ArrowRightLeft,
        isActive: true,
        items: [
          {
            title: "Transaction Decoder",
            url: "/sol/tx-decoder",
          },
        ],
      },
    ]
  },
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader> */}
      <SidebarContent>
        <NavGroup groupName={data.navMain.name} items={data.navMain.items} />
        <NavGroup groupName={data.navEvm.name} items={data.navEvm.items} />
        <NavGroup groupName={data.navSol.name} items={data.navSol.items} />
        {/* <NavMain items={data.navMain} /> */}
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  )
}
