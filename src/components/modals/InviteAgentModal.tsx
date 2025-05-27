
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail } from 'lucide-react';

interface InviteAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  departments: any[];
  onAgentInvited: (agent: any) => void;
}

const InviteAgentModal = ({ open, onOpenChange, departments, onAgentInvited }: InviteAgentModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: 'agent'
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.department) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    const newAgent = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      department: formData.department,
      role: formData.role,
      status: 'pending',
      invitedAt: new Date().toISOString()
    };

    onAgentInvited(newAgent);
    
    toast({
      title: "Convite enviado!",
      description: `Convite enviado para ${formData.email}`,
    });

    setFormData({ name: '', email: '', department: '', role: 'agent' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Convidar Novo Agente
          </DialogTitle>
          <DialogDescription>
            Envie um convite para um novo membro da equipe se juntar ao sistema.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agent-name">Nome Completo *</Label>
            <Input
              id="agent-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome do agente"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="agent-email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="agent-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@empresa.com"
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="agent-dept">Departamento *</Label>
            <Select
              value={formData.department}
              onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o departamento" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.name}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="agent-role">Função</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="agent">Agente</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <UserPlus className="h-4 w-4 mr-2" />
              Enviar Convite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteAgentModal;
