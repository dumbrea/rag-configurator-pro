import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ToolType, Tool, RAGTool, APITool, MCPTool, ActionTool } from '@/types/tools';
import { Check, X } from 'lucide-react';

interface ViewToolModalProps {
  open: boolean;
  onClose: () => void;
  tool: Tool | null;
  toolType: ToolType;
}

const ViewToolModal = ({ open, onClose, tool, toolType }: ViewToolModalProps) => {
  if (!tool) return null;

  const renderValue = (label: string, value: string | boolean | string[] | undefined) => {
    if (value === undefined || value === null) return null;
    
    return (
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        {typeof value === 'boolean' ? (
          value ? (
            <Badge className="bg-success/20 text-success border-success/30">
              <Check className="mr-1 h-3 w-3" /> Yes
            </Badge>
          ) : (
            <Badge variant="secondary">
              <X className="mr-1 h-3 w-3" /> No
            </Badge>
          )
        ) : Array.isArray(value) ? (
          <div className="flex flex-wrap gap-1">
            {value.map((v, i) => (
              <Badge key={i} variant="outline" className="font-mono text-xs">{v}</Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground">{value}</p>
        )}
      </div>
    );
  };

  const renderRAGDetails = (rag: RAGTool) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {renderValue('Vector Store', rag.params.vector_store)}
        {renderValue('Database', rag.params.database_name)}
      </div>
      <div className="grid grid-cols-2 gap-4">
        {renderValue('Collection', rag.params.collection_name)}
        {renderValue('Partition', rag.params.partition_name)}
      </div>
      {renderValue('Columns', rag.columns)}
      {renderValue('Embedding Column', rag.embedding_column)}
      {renderValue('Discoverable', rag.discoverable)}
    </div>
  );

  const renderAPIDetails = (api: APITool) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Method</p>
          <Badge className="uppercase font-mono">{api.method}</Badge>
        </div>
        {renderValue('Endpoint', api.url)}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Base URLs</p>
        <div className="p-3 rounded-lg bg-background/50 font-mono text-xs space-y-1">
          <p><span className="text-muted-foreground">Local:</span> {api.base_url.local}</p>
          {api.base_url.development && <p><span className="text-muted-foreground">Dev:</span> {api.base_url.development}</p>}
          {api.base_url.preprod && <p><span className="text-muted-foreground">Preprod:</span> {api.base_url.preprod}</p>}
          {api.base_url.production && <p><span className="text-muted-foreground">Prod:</span> {api.base_url.production}</p>}
        </div>
      </div>
      {api.input.body.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Body Parameters</p>
          {api.input.body.map((param, i) => (
            <div key={i} className="p-3 rounded-lg bg-background/50 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-primary">{param.name}</span>
                <Badge variant="outline" className="text-xs">{param.type}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{param.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMCPDetails = (mcp: MCPTool) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Server Type</p>
          <Badge variant="secondary" className="uppercase font-mono">{mcp.server_type}</Badge>
        </div>
        {renderValue('Discoverable', mcp.discoverable)}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Base URLs</p>
        <div className="p-3 rounded-lg bg-background/50 font-mono text-xs space-y-1">
          <p><span className="text-muted-foreground">Local:</span> {mcp.base_url.local}</p>
          {mcp.base_url.preprod && <p><span className="text-muted-foreground">Preprod:</span> {mcp.base_url.preprod}</p>}
          {mcp.base_url.prod && <p><span className="text-muted-foreground">Prod:</span> {mcp.base_url.prod}</p>}
        </div>
      </div>
      {Object.keys(mcp.input).length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Input Parameters</p>
          {Object.entries(mcp.input).map(([name, val], i) => (
            <div key={i} className="p-3 rounded-lg bg-background/50 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-primary">{name}</span>
                <Badge variant="outline" className="text-xs">{val.type}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{val.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderActionDetails = (action: ActionTool) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {renderValue('Discoverable', action.discoverable)}
        {renderValue('Conversational', action.conversational)}
      </div>
      {action.Variables.length > 0 && renderValue('Variables', action.Variables)}
      {action.Tag && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tag Configuration</p>
          <div className="p-3 rounded-lg bg-background/50 space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="text-muted-foreground">Source:</span> {action.Tag.SourceName}</p>
              <p><span className="text-muted-foreground">Type:</span> {action.Tag.SourceType}</p>
              <p><span className="text-muted-foreground">Action:</span> {action.Tag.Action}</p>
            </div>
            {(action.Tag.SourceUrl.web || action.Tag.SourceUrl.app) && (
              <div className="pt-2 border-t border-border/30 text-xs font-mono">
                {action.Tag.SourceUrl.web && <p><span className="text-muted-foreground">Web:</span> {action.Tag.SourceUrl.web}</p>}
                {action.Tag.SourceUrl.app && <p><span className="text-muted-foreground">App:</span> {action.Tag.SourceUrl.app}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{toolType}</Badge>
            <span className="font-mono text-primary">{tool.FunctionName}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-2">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</p>
            <p className="text-sm text-foreground leading-relaxed">{tool.FunctionDescription}</p>
          </div>
          
          <Separator className="bg-border/50" />
          
          {toolType === 'RAG' && renderRAGDetails(tool as RAGTool)}
          {toolType === 'API' && renderAPIDetails(tool as APITool)}
          {toolType === 'MCP' && renderMCPDetails(tool as MCPTool)}
          {toolType === 'Action' && renderActionDetails(tool as ActionTool)}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewToolModal;
