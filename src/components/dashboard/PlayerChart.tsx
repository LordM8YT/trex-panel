import { Card } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type ServerRecord = {
  name: string
  cpu_usage: number
  ram_usage: number
}

export function PlayerChart({ servers = [] }: { servers?: ServerRecord[] }) {
  const data = servers.map((server) => ({
    name: server.name,
    cpu: Number(server.cpu_usage || 0),
    ram: Number(server.ram_usage || 0),
  }))

  return (
    <Card className="bg-[#0D0F1D] border-[#1E2433] text-white p-6 animate-fade-up lg:col-span-2">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-blue-500" />
        Server Usage
      </h2>
      <div className="h-[400px] w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-md border border-[#1E2433] text-white/50">
            No server usage data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2433" />
              <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: '#6B7280' }} />
              <YAxis stroke="#6B7280" tick={{ fill: '#6B7280' }} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0D0F1D",
                  border: "1px solid #1E2433",
                  borderRadius: "8px",
                  color: "white"
                }}
              />
              <Bar dataKey="cpu" name="CPU Usage" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ram" name="RAM Usage" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  )
}
