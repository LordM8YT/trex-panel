import { useQuery } from "@tanstack/react-query";
import { Database, PackageOpen, Server } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";

type EggVariable = {
  id: number;
  name: string;
  env_variable: string;
  default_value: string | null;
  user_viewable: boolean;
  user_editable: boolean;
  rules: string | null;
};

type Egg = {
  id: number;
  name: string;
  author: string | null;
  description: string | null;
  docker_image: string;
  startup_command: string;
  server_count: number;
  variables: EggVariable[];
};

const Eggs = () => {
  const { data: eggs, isLoading, error } = useQuery({
    queryKey: ["eggs"],
    queryFn: async () => {
      const response = await fetch("/api/eggs");

      if (!response.ok) {
        toast({
          title: "Error",
          description: "Failed to fetch eggs",
          variant: "destructive",
        });
        throw new Error("Failed to fetch eggs");
      }

      return response.json() as Promise<Egg[]>;
    },
  });

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0A0B14] text-white">
        <div className="border-b border-white/5 bg-[#0A0B14]/95">
          <div className="flex h-14 items-center px-4">
            <h1 className="text-lg font-semibold">Eggs</h1>
          </div>
        </div>

        <div className="container py-6 space-y-6">
          <Card className="bg-[#0D0F1D] border-[#1E2433] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PackageOpen className="h-5 w-5 text-blue-500" />
                Game templates
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/60">
              Eggs are database-backed game templates. Import or create eggs in your database through the API, then attach servers to them.
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map((item) => (
                <Skeleton key={item} className="h-48 bg-white/5" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-6 text-red-100">
              Could not load eggs. Check database connectivity and authentication.
            </div>
          ) : eggs?.length === 0 ? (
            <div className="rounded-lg border border-[#1E2433] bg-[#0D0F1D] p-10 text-center text-white/60">
              <PackageOpen className="mx-auto mb-4 h-10 w-10 text-white/30" />
              <p className="text-lg font-medium text-white">No eggs installed</p>
              <p className="mt-2">Add egg records to your database or POST an egg definition to `/api/eggs`.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {eggs?.map((egg) => (
                <Card key={egg.id} className="bg-[#0D0F1D] border-[#1E2433] text-white">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle>{egg.name}</CardTitle>
                        {egg.author ? <p className="mt-1 text-sm text-white/50">By {egg.author}</p> : null}
                      </div>
                      <Badge variant="outline" className="border-blue-500/20 bg-blue-500/10 text-blue-300">
                        <Server className="mr-1 h-3 w-3" />
                        {egg.server_count}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {egg.description ? <p className="text-sm text-white/60">{egg.description}</p> : null}
                    <div className="rounded-md border border-[#1E2433] bg-[#0A0B14] p-3">
                      <p className="mb-1 flex items-center gap-2 text-xs uppercase text-white/40">
                        <Database className="h-3 w-3" />
                        Docker image
                      </p>
                      <p className="break-all font-mono text-sm text-white/80">{egg.docker_image}</p>
                    </div>
                    <div className="rounded-md border border-[#1E2433] bg-[#0A0B14] p-3">
                      <p className="mb-1 text-xs uppercase text-white/40">Startup command</p>
                      <p className="break-all font-mono text-sm text-white/80">{egg.startup_command}</p>
                    </div>
                    <div>
                      <p className="mb-2 text-xs uppercase text-white/40">Variables</p>
                      {egg.variables.length === 0 ? (
                        <p className="text-sm text-white/50">No variables configured.</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {egg.variables.map((variable) => (
                            <Badge key={variable.id} variant="outline" className="border-white/10 text-white/70">
                              {variable.env_variable}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Eggs;
