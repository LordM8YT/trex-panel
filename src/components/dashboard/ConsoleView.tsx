import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Terminal, Play, Square, RotateCw } from "lucide-react"
import { Input } from "@/components/ui/input"

export function ConsoleView() {
  return (
    <Card className="bg-[#0D0F1D] border-[#1E2433] text-white">
      <div className="flex items-center justify-between p-4 border-b border-[#1E2433]">
        <h2 className="text-lg font-medium flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-500" />
          Console
        </h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border-emerald-500/20">
            <Play className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border-red-500/20">
            <Square className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border-blue-500/20">
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[350px] rounded-md">
        <div className="flex h-[350px] items-center justify-center p-4 text-sm text-white/50">
          No console stream configured.
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-[#1E2433]">
        <div className="flex gap-2">
          <Input 
            placeholder="Type a command..." 
            className="bg-[#0A0B14] border-[#1E2433] text-white placeholder:text-white/30"
          />
          <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
            Send
          </Button>
        </div>
      </div>
    </Card>
  )
}
