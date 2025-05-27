
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Camera, 
  Save, 
  Bell, 
  Shield, 
  Palette,
  ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: 'João Silva',
    email: 'joao@empresa.com',
    phone: '+55 11 99999-9999',
    company: 'Empresa LTDA',
    department: 'Suporte',
    role: 'Agente',
    bio: 'Especialista em atendimento ao cliente com 3 anos de experiência.',
    notifications: {
      email: true,
      push: true,
      sound: false
    },
    theme: 'light'
  });

  const handleSave = () => {
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const handleAvatarChange = () => {
    // Simular upload de avatar
    toast({
      title: "Avatar atualizado!",
      description: "Sua foto de perfil foi alterada com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
            <p className="text-gray-600">Gerencie suas informações pessoais e preferências</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Atualize seus dados pessoais e profissionais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações
                </CardTitle>
                <CardDescription>Configure como você quer receber notificações</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificações por Email</p>
                    <p className="text-sm text-gray-500">Receba atualizações importantes por email</p>
                  </div>
                  <Switch
                    checked={formData.notifications.email}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ 
                        ...prev, 
                        notifications: { ...prev.notifications, email: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificações Push</p>
                    <p className="text-sm text-gray-500">Receba notificações no navegador</p>
                  </div>
                  <Switch
                    checked={formData.notifications.push}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ 
                        ...prev, 
                        notifications: { ...prev.notifications, push: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Sons de Notificação</p>
                    <p className="text-sm text-gray-500">Reproduzir som ao receber mensagens</p>
                  </div>
                  <Switch
                    checked={formData.notifications.sound}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ 
                        ...prev, 
                        notifications: { ...prev.notifications, sound: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-2xl">{formData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                      onClick={handleAvatarChange}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-semibold text-lg">{formData.name}</h3>
                    <p className="text-gray-500">{formData.role}</p>
                    <Badge variant="default" className="mt-2">
                      {formData.department}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Informações da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-500">{formData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Telefone</p>
                    <p className="text-sm text-gray-500">{formData.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Empresa</p>
                    <p className="text-sm text-gray-500">{formData.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleSave} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
