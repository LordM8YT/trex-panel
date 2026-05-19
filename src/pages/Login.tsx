import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "Invalid email or password");
      }

      toast({
        title: "Signed in",
        description: "Welcome to Trex Panel.",
      });
      navigate("/", { replace: true });
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B14] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#151620] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <Server className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Trex Panel</h1>
          <p className="mt-2 text-sm text-white/60">Sign in with an account from your configured database.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="bg-white/5 border-white/10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="bg-white/5 border-white/10"
              required
            />
          </div>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 border-t border-white/10 pt-6 text-sm text-white/50">
          <Lock className="h-4 w-4" />
          <span>Database-backed authentication</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
