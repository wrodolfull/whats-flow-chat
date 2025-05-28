
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Zap, 
  Package, 
  CreditCard, 
  Phone, 
  MapPin, 
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface QuickActionsProps {
  onActionSelect: (action: string) => void;
}

const QuickActions = ({ onActionSelect }: QuickActionsProps) => {
  const actions = [
    {
      id: 'order-status',
      label: 'Status do Pedido',
      icon: Package,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'payment-help',
      label: 'Ajuda Pagamento',
      icon: CreditCard,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      id: 'delivery-info',
      label: 'Info Entrega',
      icon: MapPin,
      color: 'text-orange-600 dark:text-orange-400'
    },
    {
      id: 'business-hours',
      label: 'Horário Funcionamento',
      icon: Clock,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      id: 'urgent-support',
      label: 'Suporte Urgente',
      icon: AlertCircle,
      color: 'text-red-600 dark:text-red-400'
    },
    {
      id: 'problem-solved',
      label: 'Problema Resolvido',
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400'
    }
  ];

  return (
    <Card className="p-4 mb-4 bg-background border">
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-4 w-4 text-yellow-500" />
        <span className="text-sm font-medium">Ações Rápidas</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              className="justify-start h-auto p-2 text-left hover:bg-accent"
              onClick={() => onActionSelect(action.id)}
            >
              <IconComponent className={`h-4 w-4 mr-2 ${action.color}`} />
              <span className="text-xs">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;
