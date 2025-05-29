
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';

interface ConditionNodeData {
  label: string;
  condition?: string;
  conditionType?: string;
}

interface ConditionNodeProps {
  data: ConditionNodeData;
  selected?: boolean;
}

const ConditionNode = memo(({ data, selected }: ConditionNodeProps) => {
  return (
    <Card className={`min-w-[200px] max-w-[300px] shadow-lg border-yellow-500 border-2 ${
      selected ? 'ring-2 ring-yellow-300' : ''
    }`}>
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
        <div className="text-sm">
          <div className="font-medium mb-1">{data.label}</div>
          <div className="text-muted-foreground text-xs break-words">
            {data.condition || 'Clique para definir condição'}
          </div>
          {data.conditionType && (
            <div className="text-xs text-yellow-600 mt-1">
              Tipo: {data.conditionType}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between px-4 pb-2">
        <span className="text-xs text-green-600 font-medium">Sim</span>
        <span className="text-xs text-red-600 font-medium">Não</span>
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
