
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface MessageNodeData {
  label: string;
  message?: string;
}

interface MessageNodeProps {
  data: MessageNodeData;
  selected?: boolean;
}

const MessageNode = memo(({ data, selected }: MessageNodeProps) => {
  return (
    <Card className={`min-w-[200px] max-w-[300px] shadow-lg border-blue-500 border-2 ${
      selected ? 'ring-2 ring-blue-300' : ''
    }`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold text-blue-700">Mensagem</span>
        </div>
        <div className="text-sm">
          <div className="font-medium mb-1">{data.label}</div>
          <div className="text-muted-foreground text-xs break-words">
            {data.message || 'Clique para editar mensagem'}
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white"
      />
    </Card>
  );
});

MessageNode.displayName = 'MessageNode';

export default MessageNode;
