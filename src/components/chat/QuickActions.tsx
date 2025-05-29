
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Package, 
  CreditCard, 
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
      color: 'text-blue-600'
    },
    {
      id: 'payment-help',
      label: 'Ajuda Pagamento',
      icon: CreditCard,
      color: 'text-green-600'
    },
    {
      id: 'delivery-info',
      label: 'Info Entrega',
      icon: MapPin,
      color: 'text-orange-600'
    },
    {
      id: 'business-hours',
      label: 'Horário Funcionamento',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      id: 'urgent-support',
      label: 'Suporte Urgente',
      icon: AlertCircle,
      color: 'text-red-600'
    },
    {
      id: 'problem-solved',
      label: 'Problema Resolvido',
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  return (
    <Card className="p-4 mb-4 bg-white border-slate-200 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action) => {
          const IconComponent = action.icon;
          return (
            <Button
              key={action.id}
              variant="ghost"
              size="sm"
              className="justify-start h-auto p-3 text-left hover:bg-slate-50 border border-slate-100"
              onClick={() => onActionSelect(action.id)}
            >
              <IconComponent className={`h-4 w-4 mr-2 ${action.color}`} />
              <span className="text-xs text-slate-700">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default QuickActions;
