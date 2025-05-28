
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Square } from 'lucide-react';

interface EndNodeData {
  label: string;
}

interface EndNodeProps {
  data: EndNodeData;
}

const EndNode = memo(({ data }: EndNodeProps) => {
  return (
    <Card className="min-w-[200px] shadow-lg border-red-500 border-2">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-red-500 border-2 border-white"
      />
      
      <div className="p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <Square className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-red-700">Fim</span>
        </div>
        <p className="text-sm text-muted-foreground">{data.label}</p>
      </div>
    </Card>
  );
});

EndNode.displayName = 'EndNode';

export default EndNode;
