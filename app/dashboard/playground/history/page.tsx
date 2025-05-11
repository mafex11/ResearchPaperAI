"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "../../../components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MessageSquare, FileText, Tag } from "lucide-react"

interface ChatHistory {
  id: string
  title: string
  timestamp: string
  preview: string
  tags: string[]
  documents: {
    id: string
    name: string
    type: string
  }[]
}

export default function HistoryPage() {
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])

  useEffect(() => {
    // TODO: Replace with actual API call to fetch chat history
    const mockHistory: ChatHistory[] = [
      {
        id: "1",
        title: "AI in Healthcare Research",
        timestamp: "2024-03-20T10:30:00",
        preview: "Analysis of AI applications in healthcare delivery systems...",
        tags: ["Healthcare", "AI", "Research"],
        documents: [
          { id: "doc1", name: "medical_ai_paper.pdf", type: "pdf" },
          { id: "doc2", name: "healthcare_stats.xlsx", type: "excel" }
        ]
      },
      {
        id: "2",
        title: "Quantum Mechanics Discussion",
        timestamp: "2024-03-19T15:45:00",
        preview: "Comparison of major quantum mechanics theories...",
        tags: ["Physics", "Quantum", "Theory"],
        documents: [
          { id: "doc3", name: "quantum_theory.pdf", type: "pdf" }
        ]
      },
      {
        id: "3",
        title: "Social Media Impact Study",
        timestamp: "2024-03-18T09:15:00",
        preview: "Examination of social media's role in political movements...",
        tags: ["Social Media", "Politics", "Analysis"],
        documents: [
          { id: "doc4", name: "social_media_data.csv", type: "csv" },
          { id: "doc5", name: "political_impact.pdf", type: "pdf" }
        ]
      }
    ]
    setChatHistory(mockHistory)
  }, [])

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
                  <BreadcrumbLink href="/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>History</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] p-6">
          <ScrollArea className="flex-1">
            <div className="space-y-4">
              {chatHistory.map((chat) => (
                <Card key={chat.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {chat.title}
                      </div>
                    </CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(chat.timestamp).toLocaleDateString()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{chat.preview}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {chat.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {chat.documents.map((doc) => (
                        <Badge key={doc.id} variant="outline" className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {doc.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
