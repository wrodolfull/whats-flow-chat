
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';

interface ConditionNodeData {
  label: string;
  condition?: string;
}

interface ConditionNodeProps {
  data: ConditionNodeData;
}

const ConditionNode = memo(({ data }: ConditionNodeProps) => {
  return (
    <Card className="min-w-[200px] shadow-lg border-yellow-500 border-2">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-yellow-500 border-2 border-white"
      />
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
            <GitBranch className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-yellow-700">Condição</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {data.condition || 'Clique para definir condição'}
        </p>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="w-3 h-3 bg-green-500 border-2 border-white"
        style={{ left: '25%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-3 h-3 bg-red-500 border-2 border-white"
        style={{ left: '75%' }}
      />
    </Card>
  );
});

ConditionNode.displayName = 'ConditionNode';

export default ConditionNode;
