
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Play } from 'lucide-react';

interface StartNodeData {
  label: string;
}

interface StartNodeProps {
  data: StartNodeData;
  selected?: boolean;
}

const StartNode = memo(({ data, selected }: StartNodeProps) => {
  return (
    <Card className={`min-w-[200px] max-w-[300px] shadow-lg border-green-500 border-2 ${
      selected ? 'ring-2 ring-green-300' : ''
    }`}>
      <div className="p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <Play className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-green-700">Início</span>
        </div>
        <div className="text-sm">
          <div className="font-medium">{data.label}</div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
    </Card>
  );
});

StartNode.displayName = 'StartNode';

export default StartNode;
