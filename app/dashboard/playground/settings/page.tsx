"use client"

import { useState } from "react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 2000,
    enableContext: true,
    enableHistory: true,
    enableCitations: true,
    enableAgentStats: true
  })

  const handleSave = () => {
    // TODO: Implement settings save functionality
    console.log("Saving settings:", settings)
  }

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
                  <BreadcrumbPage>Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] p-6">
          <div className="max-w-3xl mx-auto w-full space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Model Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Select
                    value={settings.model}
                    onValueChange={(value) => setSettings({ ...settings, model: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Temperature: {settings.temperature}</Label>
                  <Slider
                    value={[settings.temperature]}
                    onValueChange={([value]) => setSettings({ ...settings, temperature: value })}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Tokens: {settings.maxTokens}</Label>
                  <Slider
                    value={[settings.maxTokens]}
                    onValueChange={([value]) => setSettings({ ...settings, maxTokens: value })}
                    min={100}
                    max={4000}
                    step={100}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="context">Enable Context Memory</Label>
                  <Switch
                    id="context"
                    checked={settings.enableContext}
                    onCheckedChange={(checked) => setSettings({ ...settings, enableContext: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="history">Enable Chat History</Label>
                  <Switch
                    id="history"
                    checked={settings.enableHistory}
                    onCheckedChange={(checked) => setSettings({ ...settings, enableHistory: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="citations">Enable Auto Citations</Label>
                  <Switch
                    id="citations"
                    checked={settings.enableCitations}
                    onCheckedChange={(checked) => setSettings({ ...settings, enableCitations: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="agentStats">Enable Agent Stats</Label>
                  <Switch
                    id="agentStats"
                    checked={settings.enableAgentStats}
                    onCheckedChange={(checked) => setSettings({ ...settings, enableAgentStats: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave}>Save Settings</Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
