import { Search, Settings, Layers, Moon } from "lucide-react"
import { DashboardLayout } from "@/components/DashboardLayout"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { PlayerChart } from "@/components/dashboard/PlayerChart"
import { ConsoleView } from "@/components/dashboard/ConsoleView"
import { ServerControls } from "@/components/dashboard/ServerControls"
import { Switch } from "@/components/ui/switch"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"

type Server = {
  id: number
  name: string
  status: string
  players: number
  ram_usage: number
  cpu_usage: number
}

const Index = () => {
  const { data: servers, isLoading, error } = useQuery({
    queryKey: ['servers'],
    queryFn: async () => {
      const response = await fetch('/api/servers')

      if (!response.ok) {
        toast({
          title: "Error",
          description: "Failed to fetch servers",
          variant: "destructive",
        })
        throw new Error('Failed to fetch servers')
      }

      return response.json() as Promise<Server[]>
    },
  })

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0A0B14] text-white">
        {/* Header */}
        <div className="border-b border-white/5 bg-[#0A0B14]/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-14 items-center px-4 gap-4">
            <h1 className="text-lg font-semibold">Trex Panel</h1>
            <div className="ml-auto flex items-center gap-4">
              <Search className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
              <Settings className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
              <Layers className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
              <Moon className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container py-6 space-y-8">
          {/* Server Toggle */}
          <div className="flex items-center justify-end gap-2 text-sm text-white/70">
            <span>SHOWING OTHER'S SERVERS</span>
            <Switch />
          </div>

          {/* Server List */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 bg-white/5" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-white/50 py-12">
              <p>Failed to load servers. Please try again.</p>
            </div>
          ) : servers?.length === 0 ? (
            <div className="text-center text-white/50 py-12">
              <p>You don't have any servers yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servers?.map((server) => (
                <div
                  key={server.id}
                  className="p-6 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <h3 className="text-lg font-medium mb-2">{server.name}</h3>
                  <div className="space-y-2 text-sm text-white/70">
                    <p>Status: {server.status}</p>
                    <p>Players: {server.players}</p>
                    <p>RAM Usage: {server.ram_usage}%</p>
                    <p>CPU Usage: {server.cpu_usage}%</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <StatsCards servers={servers || []} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PlayerChart servers={servers || []} />
            <ConsoleView />
          </div>

          <ServerControls servers={servers || []} />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Index
