import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ServerCog, Play, Square, RotateCw } from "lucide-react"

type ServerRecord = {
  id: number
  name: string
  status: string
  players: number
}

export function ServerControls({ servers = [] }: { servers?: ServerRecord[] }) {
  return (
    <Card className="bg-[#0D0F1D] border-[#1E2433] text-white">
      <div className="flex items-center justify-between p-6 border-b border-[#1E2433]">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <ServerCog className="w-5 h-5 text-blue-500" />
          Server Information
        </h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border-emerald-500/20">
            <Play className="w-4 h-4 mr-2" />
            Start
          </Button>
          <Button size="sm" variant="outline" className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20">
            <Square className="w-4 h-4 mr-2" />
            Stop
          </Button>
          <Button size="sm" variant="outline" className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border-blue-500/20">
            <RotateCw className="w-4 h-4 mr-2" />
            Restart
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
        {servers.length === 0 ? (
          <div className="col-span-full rounded-lg border border-[#1E2433] bg-[#0A0B14] p-6 text-center text-white/50">
            No servers available.
          </div>
        ) : servers.map((server) => (
          <div key={server.id} className="p-4 rounded-lg bg-[#0A0B14] hover:bg-[#0D0F1D] transition-colors border border-[#1E2433]">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium capitalize">{server.name}</span>
              <Badge 
                variant="outline" 
                className={server.status.toLowerCase() === "online"
                  ? "bg-emerald-500/10 text-emerald-500 border-0" 
                  : "bg-red-500/10 text-red-500 border-0"
                }
              >
                {server.status}
              </Badge>
            </div>
            <div className="space-y-1 text-sm text-white/50">
              <p>Players: {server.players}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
