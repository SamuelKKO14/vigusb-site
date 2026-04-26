"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/lib/hooks/use-toast";

interface StaffMember {
  user_id: string;
  role: string;
  magasins: { id: string; code: string; nom: string; ville: string }[];
}

interface Props {
  staff: StaffMember[];
  magasins: { id: string; code: string; nom: string; ville: string }[];
}

export function StaffClient({ staff, magasins }: Props) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("manager");
  const [magasinId, setMagasinId] = useState<string>("");
  const [password, setPassword] = useState("");
  const [inviting, setInviting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function handleInvite() {
    if (!email || !password || !magasinId) {
      toast({ variant: "destructive", title: "Remplis tous les champs" });
      return;
    }
    setInviting(true);
    try {
      const res = await fetch("/api/staff/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role, magasin_id: magasinId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur");
      }
      toast({ title: `${email} invité avec succès` });
      setInviteOpen(false);
      setEmail("");
      setPassword("");
      setMagasinId("");
      router.refresh();
    } catch (err: any) {
      toast({ variant: "destructive", title: err.message });
    } finally {
      setInviting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold sm:text-2xl">Staff</h1>
        <Button
          className="bg-violet hover:bg-violet-dark gap-2"
          onClick={() => setInviteOpen(true)}
        >
          <UserPlus className="h-4 w-4" /> Inviter
        </Button>
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Magasin(s)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  Aucun membre staff
                </TableCell>
              </TableRow>
            ) : (
              staff.map((s) => (
                <TableRow key={s.user_id}>
                  <TableCell className="font-mono text-xs">
                    {s.user_id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge className={s.role === "admin" ? "bg-violet" : "bg-blue-500"}>
                      {s.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {s.role === "admin" ? (
                        <span className="text-sm text-muted-foreground">Tous</span>
                      ) : (
                        s.magasins.map((m) => (
                          <Badge key={m.id} variant="outline" className="text-xs">
                            {m.nom}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Inviter un membre staff</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="manager@vigusb.fr"
              />
            </div>
            <div className="space-y-1">
              <Label>Mot de passe initial</Label>
              <Input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe temporaire"
              />
            </div>
            <div className="space-y-1">
              <Label>Rôle</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Magasin</Label>
              <Select value={magasinId} onValueChange={setMagasinId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un magasin" />
                </SelectTrigger>
                <SelectContent>
                  {magasins.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.nom} ({m.ville})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-violet hover:bg-violet-dark"
              onClick={handleInvite}
              disabled={inviting}
            >
              {inviting ? "..." : "Inviter"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
