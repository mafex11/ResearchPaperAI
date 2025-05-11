import { AppSidebar } from "../components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">
                    AI Research Papers
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="space-y-4">
            {/* Welcome Area */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-2xl font-bold">Welcome back, WWWWWW!</h2>
              <p className="text-muted-foreground">Ready to continue your research journey?</p>
            </div>

            {/* Quick Start Guide */}
            <div className="flex items-center justify-between rounded-lg border bg-card p-6 shadow-sm">
              <div>
                <h3 className="font-semibold">Quick Start</h3>
                <p className="text-sm text-muted-foreground">Create a new research paper or continue your work</p>
              </div>
              <button className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
                Create New Paper
              </button>
            </div>

            {/* Recent Activity */}
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="font-semibold">Recent Activity</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div>
                    <p className="font-medium">Last opened: Research Paper Title</p>
                    <p className="text-sm text-muted-foreground">Last edited 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted" />
                  <div>
                    <p className="font-medium">Recent project: Another Paper</p>
                    <p className="text-sm text-muted-foreground">Last edited yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="font-semibold">AI-based Research Assistant</h3>
              <p className="text-sm text-muted-foreground">Get AI-powered help with your research</p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="font-semibold">Outline Generator</h3>
              <p className="text-sm text-muted-foreground">Create structured outlines for your papers</p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="font-semibold">Citation Manager</h3>
              <p className="text-sm text-muted-foreground">Manage and format your citations</p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="font-semibold">Plagiarism Checker</h3>
              <p className="text-sm text-muted-foreground">Ensure your work is original</p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="font-semibold">Grammar Enhancer</h3>
              <p className="text-sm text-muted-foreground">Improve your writing quality</p>
            </div>
            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="font-semibold">Export Options</h3>
              <p className="text-sm text-muted-foreground">Export to PDF/Word/Latex</p>
            </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
