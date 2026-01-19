import { useState, useEffect } from 'react';
import { X, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ToolType, Tool, RAGTool, APITool, MCPTool, ActionTool } from '@/types/tools';
import { cn } from '@/lib/utils';

interface ToolFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (tool: Tool) => void;
  toolType: ToolType;
  editTool?: Tool | null;
}

interface InputParam {
  name: string;
  type: string;
  description: string;
}

const ToolFormModal = ({ open, onClose, onSave, toolType, editTool }: ToolFormModalProps) => {
  const [baseUrlOpen, setBaseUrlOpen] = useState(true);
  const [inputParams, setInputParams] = useState<InputParam[]>([]);
  
  // Common fields
  const [functionName, setFunctionName] = useState('');
  const [functionDescription, setFunctionDescription] = useState('');
  const [discoverable, setDiscoverable] = useState(true);
  
  // RAG specific
  const [vectorStore, setVectorStore] = useState('milvus');
  const [databaseName, setDatabaseName] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [partitionName, setPartitionName] = useState('_default');
  const [columns, setColumns] = useState('id, content, sourcepage, sourcefile, url');
  const [embeddingColumn, setEmbeddingColumn] = useState('embedding');
  
  // API/MCP specific
  const [baseUrlLocal, setBaseUrlLocal] = useState('');
  const [baseUrlDev, setBaseUrlDev] = useState('');
  const [baseUrlPreprod, setBaseUrlPreprod] = useState('');
  const [baseUrlProd, setBaseUrlProd] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [method, setMethod] = useState('post');
  const [serverType, setServerType] = useState('sse');
  
  // Action specific
  const [variables, setVariables] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [sourceType, setSourceType] = useState('Link');
  const [sourceUrlWeb, setSourceUrlWeb] = useState('');
  const [sourceUrlApp, setSourceUrlApp] = useState('');
  const [actionType, setActionType] = useState('Redirect');
  const [conversational, setConversational] = useState(false);

  const isEditMode = !!editTool;

  useEffect(() => {
    if (editTool) {
      setFunctionName(editTool.FunctionName);
      setFunctionDescription(editTool.FunctionDescription);
      
      if (toolType === 'RAG') {
        const rag = editTool as RAGTool;
        setDiscoverable(rag.discoverable);
        setVectorStore(rag.params.vector_store);
        setDatabaseName(rag.params.database_name);
        setCollectionName(rag.params.collection_name);
        setPartitionName(rag.params.partition_name);
        setColumns(rag.columns.join(', '));
        setEmbeddingColumn(rag.embedding_column.join(', '));
      } else if (toolType === 'API') {
        const api = editTool as APITool;
        setBaseUrlLocal(api.base_url.local || '');
        setBaseUrlDev(api.base_url.development || '');
        setBaseUrlPreprod(api.base_url.preprod || '');
        setBaseUrlProd(api.base_url.production || '');
        setApiUrl(api.url);
        setMethod(api.method);
        setInputParams(api.input.body.map(p => ({ name: p.name, type: p.type, description: p.description })));
      } else if (toolType === 'MCP') {
        const mcp = editTool as MCPTool;
        setDiscoverable(mcp.discoverable);
        setBaseUrlLocal(mcp.base_url.local || '');
        setBaseUrlPreprod(mcp.base_url.preprod || '');
        setBaseUrlProd(mcp.base_url.prod || '');
        setServerType(mcp.server_type);
        setInputParams(Object.entries(mcp.input).map(([name, val]) => ({
          name,
          type: val.type,
          description: val.description
        })));
      } else if (toolType === 'Action') {
        const action = editTool as ActionTool;
        setDiscoverable(action.discoverable);
        setConversational(action.conversational);
        setVariables(action.Variables.join(', '));
        if (action.Tag) {
          setSourceName(action.Tag.SourceName);
          setSourceType(action.Tag.SourceType);
          setSourceUrlWeb(action.Tag.SourceUrl.web || '');
          setSourceUrlApp(action.Tag.SourceUrl.app || '');
          setActionType(action.Tag.Action);
        }
      }
    } else {
      resetForm();
    }
  }, [editTool, toolType]);

  const resetForm = () => {
    setFunctionName('');
    setFunctionDescription('');
    setDiscoverable(true);
    setVectorStore('milvus');
    setDatabaseName('');
    setCollectionName('');
    setPartitionName('_default');
    setColumns('id, content, sourcepage, sourcefile, url');
    setEmbeddingColumn('embedding');
    setBaseUrlLocal('');
    setBaseUrlDev('');
    setBaseUrlPreprod('');
    setBaseUrlProd('');
    setApiUrl('');
    setMethod('post');
    setServerType('sse');
    setVariables('');
    setSourceName('');
    setSourceType('Link');
    setSourceUrlWeb('');
    setSourceUrlApp('');
    setActionType('Redirect');
    setConversational(false);
    setInputParams([]);
  };

  const addInputParam = () => {
    setInputParams([...inputParams, { name: '', type: 'string', description: '' }]);
  };

  const removeInputParam = (index: number) => {
    setInputParams(inputParams.filter((_, i) => i !== index));
  };

  const updateInputParam = (index: number, field: keyof InputParam, value: string) => {
    const updated = [...inputParams];
    updated[index] = { ...updated[index], [field]: value };
    setInputParams(updated);
  };

  const handleSave = () => {
    const id = editTool?.id || `${toolType.toLowerCase()}-${Date.now()}`;
    
    let tool: Tool;
    
    switch (toolType) {
      case 'RAG':
        tool = {
          id,
          FunctionName: functionName,
          FunctionDescription: functionDescription,
          discoverable,
          params: {
            vector_store: vectorStore,
            database_name: databaseName,
            collection_name: collectionName,
            partition_name: partitionName,
          },
          columns: columns.split(',').map(c => c.trim()),
          embedding_column: embeddingColumn.split(',').map(c => c.trim()),
        } as RAGTool;
        break;
      case 'API':
        tool = {
          id,
          FunctionName: functionName,
          FunctionDescription: functionDescription,
          base_url: {
            local: baseUrlLocal,
            development: baseUrlDev,
            preprod: baseUrlPreprod,
            production: baseUrlProd,
          },
          url: apiUrl,
          method: method as APITool['method'],
          input: {
            body: inputParams.map(p => ({ name: p.name, type: p.type as any, description: p.description })),
            path: [],
            query: [],
          },
          postprocess: [],
        } as APITool;
        break;
      case 'MCP':
        const mcpInput: MCPTool['input'] = {};
        inputParams.forEach(p => {
          mcpInput[p.name] = { type: p.type, description: p.description };
        });
        tool = {
          id,
          FunctionName: functionName,
          FunctionDescription: functionDescription,
          base_url: {
            local: baseUrlLocal,
            preprod: baseUrlPreprod,
            prod: baseUrlProd,
          },
          server_type: serverType as MCPTool['server_type'],
          input: mcpInput,
          discoverable,
        } as MCPTool;
        break;
      case 'Action':
        tool = {
          id,
          FunctionName: functionName,
          FunctionDescription: functionDescription,
          Variables: variables.split(',').map(v => v.trim()).filter(Boolean),
          Tag: {
            SourceName: sourceName,
            SourceType: sourceType,
            SourceUrl: { web: sourceUrlWeb, app: sourceUrlApp },
            Action: actionType,
          },
          conversational,
          discoverable,
        } as ActionTool;
        break;
    }
    
    onSave(tool);
    onClose();
    resetForm();
  };

  const renderRAGFields = () => (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Vector Store *</Label>
            <Select value={vectorStore} onValueChange={setVectorStore}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="milvus">Milvus</SelectItem>
                <SelectItem value="neo4j">Neo4j</SelectItem>
                <SelectItem value="pinecone">Pinecone</SelectItem>
                <SelectItem value="qdrant">Qdrant</SelectItem>
                <SelectItem value="weaviate">Weaviate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Database Name *</Label>
            <Input
              value={databaseName}
              onChange={(e) => setDatabaseName(e.target.value)}
              placeholder="e.g., RelianceRetailSubsidiary"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Collection Name *</Label>
            <Input
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="e.g., fttx_1000004382"
            />
          </div>
          <div className="space-y-2">
            <Label>Partition Name</Label>
            <Input
              value={partitionName}
              onChange={(e) => setPartitionName(e.target.value)}
              placeholder="_default"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Columns (comma-separated)</Label>
          <Input
            value={columns}
            onChange={(e) => setColumns(e.target.value)}
            placeholder="id, content, sourcepage, sourcefile, url"
          />
        </div>
        <div className="space-y-2">
          <Label>Embedding Column</Label>
          <Input
            value={embeddingColumn}
            onChange={(e) => setEmbeddingColumn(e.target.value)}
            placeholder="embedding"
          />
        </div>
      </div>
    </>
  );

  const renderAPIFields = () => (
    <>
      <Collapsible open={baseUrlOpen} onOpenChange={setBaseUrlOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between px-0 hover:bg-transparent">
            <span className="font-medium">Base URL Configuration</span>
            {baseUrlOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          <div className="space-y-2">
            <Label>Local *</Label>
            <Input
              value={baseUrlLocal}
              onChange={(e) => setBaseUrlLocal(e.target.value)}
              placeholder="http://localhost:3200"
            />
          </div>
          <div className="space-y-2">
            <Label>Development</Label>
            <Input
              value={baseUrlDev}
              onChange={(e) => setBaseUrlDev(e.target.value)}
              placeholder="http://api-dev.example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Preprod</Label>
            <Input
              value={baseUrlPreprod}
              onChange={(e) => setBaseUrlPreprod(e.target.value)}
              placeholder="http://api-preprod.example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Production *</Label>
            <Input
              value={baseUrlProd}
              onChange={(e) => setBaseUrlProd(e.target.value)}
              placeholder="http://api.example.com"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <div className="grid grid-cols-2 gap-4 pt-4">
        <div className="space-y-2">
          <Label>Endpoint URL *</Label>
          <Input
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="/api/v1/resource"
          />
        </div>
        <div className="space-y-2">
          <Label>Method *</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="get">GET</SelectItem>
              <SelectItem value="post">POST</SelectItem>
              <SelectItem value="put">PUT</SelectItem>
              <SelectItem value="patch">PATCH</SelectItem>
              <SelectItem value="delete">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {renderInputParams()}
    </>
  );

  const renderMCPFields = () => (
    <>
      <Collapsible open={baseUrlOpen} onOpenChange={setBaseUrlOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between px-0 hover:bg-transparent">
            <span className="font-medium">Base URL Configuration</span>
            {baseUrlOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 pt-2">
          <div className="space-y-2">
            <Label>Local *</Label>
            <Input
              value={baseUrlLocal}
              onChange={(e) => setBaseUrlLocal(e.target.value)}
              placeholder="http://localhost:8000/mcp"
            />
          </div>
          <div className="space-y-2">
            <Label>Preprod *</Label>
            <Input
              value={baseUrlPreprod}
              onChange={(e) => setBaseUrlPreprod(e.target.value)}
              placeholder="http://mcp-preprod.example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Production *</Label>
            <Input
              value={baseUrlProd}
              onChange={(e) => setBaseUrlProd(e.target.value)}
              placeholder="http://mcp.example.com"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <div className="space-y-2 pt-4">
        <Label>Server Type *</Label>
        <Select value={serverType} onValueChange={setServerType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sse">SSE</SelectItem>
            <SelectItem value="rest">REST</SelectItem>
            <SelectItem value="websocket">WebSocket</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {renderInputParams()}
    </>
  );

  const renderActionFields = () => (
    <>
      <div className="space-y-2">
        <Label>Variables (comma-separated)</Label>
        <Input
          value={variables}
          onChange={(e) => setVariables(e.target.value)}
          placeholder="e.g., leave_type, start_date, end_date"
        />
      </div>
      
      <div className="pt-4 space-y-4">
        <h4 className="font-medium">Tag Configuration</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Source Name</Label>
            <Input
              value={sourceName}
              onChange={(e) => setSourceName(e.target.value)}
              placeholder="e.g., GetForm16"
            />
          </div>
          <div className="space-y-2">
            <Label>Source Type</Label>
            <Select value={sourceType} onValueChange={setSourceType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Link">Link</SelectItem>
                <SelectItem value="Form">Form</SelectItem>
                <SelectItem value="Download">Download</SelectItem>
                <SelectItem value="Modal">Modal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Web URL</Label>
            <Input
              value={sourceUrlWeb}
              onChange={(e) => setSourceUrlWeb(e.target.value)}
              placeholder="/web/path"
            />
          </div>
          <div className="space-y-2">
            <Label>App URL</Label>
            <Input
              value={sourceUrlApp}
              onChange={(e) => setSourceUrlApp(e.target.value)}
              placeholder="/app/path"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Action Type</Label>
          <Select value={actionType} onValueChange={setActionType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Redirect">Redirect</SelectItem>
              <SelectItem value="OptRedirect">OptRedirect</SelectItem>
              <SelectItem value="OpenForm">OpenForm</SelectItem>
              <SelectItem value="Download">Download</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between pt-2">
          <Label>Conversational</Label>
          <Switch checked={conversational} onCheckedChange={setConversational} />
        </div>
      </div>
    </>
  );

  const renderInputParams = () => (
    <div className="pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Input Parameters</h4>
        <Button type="button" variant="outline" size="sm" onClick={addInputParam}>
          <Plus className="h-4 w-4 mr-1" /> Add Parameter
        </Button>
      </div>
      
      {inputParams.map((param, index) => (
        <div key={index} className="p-4 rounded-lg border border-border/50 bg-background/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Parameter {index + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => removeInputParam(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Name *</Label>
              <Input
                value={param.name}
                onChange={(e) => updateInputParam(index, 'name', e.target.value)}
                placeholder="paramName"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Type *</Label>
              <Select value={param.type} onValueChange={(v) => updateInputParam(index, 'type', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="object">Object</SelectItem>
                  <SelectItem value="array">Array</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Description *</Label>
            <Input
              value={param.description}
              onChange={(e) => updateInputParam(index, 'description', e.target.value)}
              placeholder="Parameter description"
            />
          </div>
        </div>
      ))}
      
      {inputParams.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No parameters added. Click "Add Parameter" to add input fields.
        </p>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditMode ? 'Edit' : 'Add New'} {toolType} Tool
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          {/* Common Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Function Name *</Label>
              <Input
                value={functionName}
                onChange={(e) => setFunctionName(e.target.value)}
                placeholder="e.g., VALIDATE_TASK_REQUEST"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label>Function Description *</Label>
              <Textarea
                value={functionDescription}
                onChange={(e) => setFunctionDescription(e.target.value)}
                placeholder="Describe when and how to use this tool..."
                rows={4}
              />
            </div>
            
            {(toolType === 'RAG' || toolType === 'MCP' || toolType === 'Action') && (
              <div className="flex items-center justify-between">
                <Label>Discoverable</Label>
                <Switch checked={discoverable} onCheckedChange={setDiscoverable} />
              </div>
            )}
          </div>
          
          {/* Type-specific Fields */}
          {toolType === 'RAG' && renderRAGFields()}
          {toolType === 'API' && renderAPIFields()}
          {toolType === 'MCP' && renderMCPFields()}
          {toolType === 'Action' && renderActionFields()}
          
          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              {isEditMode ? 'Update' : 'Create'} Tool
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ToolFormModal;
