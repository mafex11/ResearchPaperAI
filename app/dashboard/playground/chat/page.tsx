"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Upload, Loader2, AlertCircle, Save } from "lucide-react"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useChatHistory, Message } from "@/hooks/useChatHistory"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"


export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { saveChat } = useChatHistory()
  const { toast } = useToast()
  const router = useRouter()

  // Save chat to history and redirect to history page
  const handleSaveChat = () => {
    if (messages.length === 0) {
      toast({
        title: "Nothing to save",
        description: "Start a conversation first",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    const chatId = saveChat(messages);
    
    // Show success toast
    toast({
      title: "Chat saved",
      description: "Your research conversation has been saved to history",
    });
    
    setIsSaving(false);
    
    // Redirect to history page after short delay
    setTimeout(() => {
      router.push('/dashboard/playground/history');
    }, 500);
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Clear any previous errors
    setError(null)

    const userMessage: Message = {
      role: "user",
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].filter(msg => msg.role !== "error"),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Invalid response format from AI service");
      }

      const aiMessage: Message = {
        role: "assistant",
        content: data.choices[0].message.content,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error while fetching AI response:", error);
      
      setError((error as Error).message || "An unexpected error occurred");
      
      const errorMessage: Message = {
        role: "error",
        content: "Sorry, there was an error processing your request. Please try again.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  // Function to render message content with proper formatting
  const renderMessageContent = (content: string) => {
    // Split content by newlines to handle paragraphs
    return content.split('\n').map((paragraph, i) => (
      paragraph ? <p key={i} className={i > 0 ? "mt-2" : ""}>{paragraph}</p> : <br key={i} />
    ));
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
                  <BreadcrumbPage>Chat</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {messages.length > 0 && (
            <div className="ml-auto pr-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSaveChat} 
                disabled={isSaving || messages.length === 0}
                className="flex items-center gap-1"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Chat
              </Button>
            </div>
          )}
        </header>
        <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
          {error && (
            <Alert variant="destructive" className="mx-4 mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <ScrollArea className="flex-1 w-full p-4">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-3xl space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2">Research Guidelines</h2>
                    <p className="text-muted-foreground text-base">Follow these guidelines to get the best research results</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card/50 rounded-lg p-6 border border-border">
                      <h3 className="text-base font-semibold mb-2">Be Specific and Contextual</h3>
                      <p className="text-sm text-muted-foreground">
                        Provide clear, detailed information about your research topic, including specific aspects you want to explore.
                      </p>
                    </div>
                    <div className="bg-card/50 rounded-lg p-6 border border-border">
                      <h3 className="text-base font-semibold mb-2">Avoid Few-Shot Prompting</h3>
                      <p className="text-sm text-muted-foreground">
                        Focus on a single, well-defined research question rather than multiple examples or scenarios.
                      </p>
                    </div>
                    <div className="bg-card/50 rounded-lg p-6 border border-border">
                      <h3 className="text-base font-semibold mb-2">Provide Relevant Context</h3>
                      <p className="text-sm text-muted-foreground">
                        Include important background information, relevant theories, or specific methodologies you want to explore.
                      </p>
                    </div>
                    <div className="bg-card/50 rounded-lg p-6 border border-border">
                      <h3 className="text-base font-semibold mb-2">Think Like a Professor</h3>
                      <p className="text-sm text-muted-foreground">
                        Frame your questions with academic rigor, considering theoretical frameworks and scholarly perspectives.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Try asking:</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={() => setInput("Analyze the impact of artificial intelligence on healthcare delivery, focusing on diagnostic accuracy and patient outcomes.")}
                        className="text-left p-4 bg-card/50 rounded-lg border border-border hover:bg-accent transition-colors"
                      >
                        <p className="text-sm">Analyze the impact of artificial intelligence on healthcare delivery, focusing on diagnostic accuracy and patient outcomes.</p>
                      </button>
                      <button
                        onClick={() => setInput("Compare and contrast the major theories of quantum mechanics, including their mathematical foundations and experimental evidence.")}
                        className="text-left p-4 bg-card/50 rounded-lg border border-border hover:bg-accent transition-colors"
                      >
                        <p className="text-sm">Compare and contrast the major theories of quantum mechanics, including their mathematical foundations and experimental evidence.</p>
                      </button>
                      <button
                        onClick={() => setInput("Examine the role of social media in modern political movements, with emphasis on information dissemination and public engagement.")}
                        className="text-left p-4 bg-card/50 rounded-lg border border-border hover:bg-accent transition-colors"
                      >
                        <p className="text-sm">Examine the role of social media in modern political movements, with emphasis on information dissemination and public engagement.</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : message.role === "error"
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {renderMessageContent(message.content)}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted max-w-[80%] rounded-lg p-4 flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>AI is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          <div className="w-full p-4">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center justify-center max-w-3xl mx-auto">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0 h-12 w-12"
              >
                <Upload className="h-5 w-5" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="what's your research paper about?"
                className="w-[600px] h-12 text-base"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading} className="h-12 w-12">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}