
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Zap } from 'lucide-react';

interface ActionNodeData {
  label: string;
  action?: string;
  actionType?: string;
}

interface ActionNodeProps {
  data: ActionNodeData;
  selected?: boolean;
}

const ActionNode = memo(({ data, selected }: ActionNodeProps) => {
  return (
    <Card className={`min-w-[200px] max-w-[300px] shadow-lg border-purple-500 border-2 ${
      selected ? 'ring-2 ring-purple-300' : ''
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-purple-700">Ação</span>
        </div>
        <div className="text-sm">
          <div className="font-medium mb-1">{data.label}</div>
          <div className="text-muted-foreground text-xs break-words">
            {data.action || 'Clique para definir ação'}
          </div>
          {data.actionType && (
            <div className="text-xs text-purple-600 mt-1">
              Tipo: {data.actionType}
            </div>
          )}
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
    </Card>
  );
});

ActionNode.displayName = 'ActionNode';

export default ActionNode;
