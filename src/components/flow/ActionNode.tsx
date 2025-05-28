
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Zap } from 'lucide-react';

interface ActionNodeData {
  label: string;
  action?: string;
}

interface ActionNodeProps {
  data: ActionNodeData;
}

const ActionNode = memo(({ data }: ActionNodeProps) => {
  return (
    <Card className="min-w-[200px] shadow-lg border-purple-500 border-2">
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
        <p className="text-sm text-muted-foreground">
          {data.action || 'Clique para definir ação'}
        </p>
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
