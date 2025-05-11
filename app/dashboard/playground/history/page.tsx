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
import { Button } from "@/components/ui/button"
import { Clock, MessageSquare, Tag, Trash, ExternalLink } from "lucide-react"
import { useChatHistory, ChatSession } from "@/hooks/useChatHistory"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function HistoryPage() {
  const { history, deleteChat, clearAllHistory } = useChatHistory();
  const router = useRouter();
  const { toast } = useToast();
  
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleViewChat = (chat: ChatSession) => {
    // Future improvement: add a page to view a specific chat
    // For now, we'll just show a toast
    toast({
      title: "View feature coming soon",
      description: "The ability to view and continue past chats is coming soon",
    });
  };
  
  const handleDeleteChat = (id: string, event: React.MouseEvent) => {
    // Prevent event from bubbling up to the card
    event.stopPropagation();
    
    deleteChat(id);
    toast({
      title: "Chat deleted",
      description: "The chat has been removed from your history",
    });
  };
  
  const handleClearAll = () => {
    if (history.length === 0) {
      toast({
        title: "Nothing to clear",
        description: "Your history is already empty",
        variant: "destructive",
      });
      return;
    }
    
    clearAllHistory();
    toast({
      title: "History cleared",
      description: "All chat history has been removed",
    });
  };
  
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
          {history.length > 0 && (
            <div className="ml-auto pr-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearAll}
                className="flex items-center gap-1"
              >
                <Trash className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          )}
        </header>
        <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] p-6">
          <ScrollArea className="flex-1">
            {history.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-3">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium">No chat history yet</h3>
                  <p className="text-muted-foreground text-sm max-w-xs">
                    Your saved research conversations will appear here. Start a new chat and save it to see it in your history.
                  </p>
                  <Button onClick={() => router.push('/dashboard/playground/chat')} className="mt-2">
                    Start a New Chat
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((chat) => (
                  <Card 
                    key={chat.id} 
                    className="hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => handleViewChat(chat)}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-semibold">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          {chat.title}
                        </div>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(chat.timestamp)}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{chat.preview}</p>
                      
                      {chat.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {chat.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={(e) => {
                          e.stopPropagation();
                          handleViewChat(chat);
                        }}>
                          <ExternalLink className="h-3.5 w-3.5" />
                          View Conversation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
