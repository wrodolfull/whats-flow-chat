
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Trash2, Phone, User, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WhatsAppNumberModal from '@/components/modals/WhatsAppNumberModal';

interface WhatsAppNumber {
  id: string;
  phoneNumber: string;
  displayName: string;
  phoneNumberId: string;
  accessToken: string;
  businessAccountId: string;
  status: 'active' | 'inactive' | 'pending';
  assignedAgent?: string;
  webhookUrl: string;
  verifyToken: string;
}

const WhatsAppNumbers = () => {
  const [numbers, setNumbers] = useState<WhatsAppNumber[]>([
    {
      id: '1',
      phoneNumber: '+55 11 99999-9999',
      displayName: 'Suporte Principal',
      phoneNumberId: '123456789',
      accessToken: 'EAAxxxxx...',
      businessAccountId: '987654321',
      status: 'active',
      assignedAgent: 'João Silva',
      webhookUrl: 'https://api.empresa.com/webhook/whatsapp/1',
      verifyToken: 'verify123'
    },
    {
      id: '2',
      phoneNumber: '+55 11 88888-8888',
      displayName: 'Vendas',
      phoneNumberId: '987654321',
      accessToken: 'EAAyyyyy...',
      businessAccountId: '123456789',
      status: 'active',
      assignedAgent: 'Maria Santos',
      webhookUrl: 'https://api.empresa.com/webhook/whatsapp/2',
      verifyToken: 'verify456'
    }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingNumber, setEditingNumber] = useState<WhatsAppNumber | null>(null);
  const { toast } = useToast();

  const handleAddNumber = (numberData: Omit<WhatsAppNumber, 'id'>) => {
    const newNumber: WhatsAppNumber = {
      ...numberData,
      id: Date.now().toString()
    };
    setNumbers(prev => [...prev, newNumber]);
    setShowModal(false);
    toast({
      title: "Número adicionado!",
      description: "Número WhatsApp configurado com sucesso.",
    });
  };

  const handleEditNumber = (numberData: Omit<WhatsAppNumber, 'id'>) => {
    if (editingNumber) {
      setNumbers(prev => prev.map(num => 
        num.id === editingNumber.id 
          ? { ...numberData, id: editingNumber.id }
          : num
      ));
      setEditingNumber(null);
      setShowModal(false);
      toast({
        title: "Número atualizado!",
        description: "Configurações do número atualizadas com sucesso.",
      });
    }
  };

  const handleDeleteNumber = (id: string) => {
    setNumbers(prev => prev.filter(num => num.id !== id));
    toast({
      title: "Número removido!",
      description: "Número WhatsApp removido com sucesso.",
    });
  };

  const openEditModal = (number: WhatsAppNumber) => {
    setEditingNumber(number);
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingNumber(null);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Números WhatsApp</h1>
          <p className="text-gray-600">Gerencie todos os números WhatsApp Business configurados</p>
        </div>

        <div className="mb-6">
          <Button onClick={openAddModal} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Número
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {numbers.map((number) => (
            <Card key={number.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{number.displayName}</CardTitle>
                  <Badge 
                    variant={number.status === 'active' ? 'default' : 'secondary'}
                    className={number.status === 'active' ? 'bg-green-500' : ''}
                  >
                    {number.status}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {number.phoneNumber}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>Agente: {number.assignedAgent || 'Não atribuído'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <span>ID: {number.phoneNumberId}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(number)}
                    className="flex-1"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteNumber(number.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <WhatsAppNumberModal
          open={showModal}
          onOpenChange={setShowModal}
          onNumberCreated={handleAddNumber}
          onNumberUpdated={handleEditNumber}
          editingNumber={editingNumber}
        />
      </div>
    </div>
  );
};

export default WhatsAppNumbers;
