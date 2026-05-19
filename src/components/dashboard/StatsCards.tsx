import { Card } from "@/components/ui/card"
import { Users, HardDrive, Cpu, Server } from "lucide-react"

type ServerRecord = {
  players: number
  ram_usage: number
  cpu_usage: number
  status: string
}

export function StatsCards({ servers = [] }: { servers?: ServerRecord[] }) {
  const onlineServers = servers.filter((server) => server.status.toLowerCase() === "online").length
  const players = servers.reduce((total, server) => total + Number(server.players || 0), 0)
  const averageRam = servers.length
    ? Math.round(servers.reduce((total, server) => total + Number(server.ram_usage || 0), 0) / servers.length)
    : 0
  const averageCpu = servers.length
    ? Math.round(servers.reduce((total, server) => total + Number(server.cpu_usage || 0), 0) / servers.length)
    : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-[#0D0F1D] border-[#1E2433] text-white">
        <div className="flex items-center gap-4 p-6">
          <div className="p-3 bg-emerald-500/10 rounded-lg">
            <Users className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm text-white/50">Online Players</p>
            <p className="text-2xl font-bold">{players}</p>
          </div>
        </div>
      </Card>

      <Card className="bg-[#0D0F1D] border-[#1E2433] text-white">
        <div className="flex items-center gap-4 p-6">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <HardDrive className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-white/50">Average RAM</p>
            <p className="text-2xl font-bold">{averageRam}%</p>
          </div>
        </div>
      </Card>

      <Card className="bg-[#0D0F1D] border-[#1E2433] text-white">
        <div className="flex items-center gap-4 p-6">
          <div className="p-3 bg-purple-500/10 rounded-lg">
            <Cpu className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-white/50">Average CPU</p>
            <p className="text-2xl font-bold">{averageCpu}%</p>
          </div>
        </div>
      </Card>

      <Card className="bg-[#0D0F1D] border-[#1E2433] text-white">
        <div className="flex items-center gap-4 p-6">
          <div className="p-3 bg-orange-500/10 rounded-lg">
            <Server className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-white/50">Online Servers</p>
            <p className="text-2xl font-bold">{onlineServers}/{servers.length}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
