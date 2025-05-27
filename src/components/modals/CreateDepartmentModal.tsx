
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

interface CreateDepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDepartmentCreated: (department: any) => void;
}

const CreateDepartmentModal = ({ open, onOpenChange, onDepartmentCreated }: CreateDepartmentModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    strategy: '',
    description: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.strategy) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newDepartment = {
      id: Date.now(),
      name: formData.name,
      strategy: formData.strategy,
      description: formData.description,
      agents: [],
      createdAt: new Date().toISOString()
    };

    onDepartmentCreated(newDepartment);
    
    toast({
      title: "Sucesso!",
      description: "Departamento criado com sucesso.",
    });

    setFormData({ name: '', strategy: '', description: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Departamento</DialogTitle>
          <DialogDescription>
            Configure um novo departamento com estratégia de distribuição de conversas.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dept-name">Nome do Departamento *</Label>
            <Input
              id="dept-name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Vendas, Suporte, Financeiro"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="strategy">Estratégia de Distribuição *</Label>
            <Select
              value={formData.strategy}
              onValueChange={(value) => setFormData(prev => ({ ...prev, strategy: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a estratégia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="round_robin">Round Robin</SelectItem>
                <SelectItem value="load_balance">Balanceamento de Carga</SelectItem>
                <SelectItem value="random">Aleatório</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição do departamento (opcional)"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Criar Departamento</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDepartmentModal;
