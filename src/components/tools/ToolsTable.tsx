import { useState } from 'react';
import { Edit2, Trash2, Eye, MoreHorizontal, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ToolType, RAGTool, APITool, MCPTool, ActionTool, Tool } from '@/types/tools';
import { cn } from '@/lib/utils';

interface ToolsTableProps {
  tools: Tool[];
  toolType: ToolType;
  onEdit: (tool: Tool) => void;
  onDelete: (id: string) => void;
  onView: (tool: Tool) => void;
}

const ToolsTable = ({ tools, toolType, onEdit, onDelete, onView }: ToolsTableProps) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const getToolColumns = () => {
    switch (toolType) {
      case 'RAG':
        return ['Function Name', 'Description', 'Vector Store', 'Collection', 'Discoverable', 'Actions'];
      case 'API':
        return ['Function Name', 'Description', 'Method', 'Endpoint', 'Actions'];
      case 'MCP':
        return ['Function Name', 'Description', 'Server Type', 'Parameters', 'Discoverable', 'Actions'];
      case 'Action':
        return ['Function Name', 'Description', 'Action Type', 'Variables', 'Discoverable', 'Actions'];
    }
  };

  const renderToolRow = (tool: Tool) => {
    const isHovered = hoveredRow === tool.id;

    switch (toolType) {
      case 'RAG': {
        const ragTool = tool as RAGTool;
        return (
          <>
            <TableCell className="font-mono text-sm text-primary">{ragTool.FunctionName}</TableCell>
            <TableCell className="max-w-xs truncate text-muted-foreground">{ragTool.FunctionDescription}</TableCell>
            <TableCell>
              <Badge variant="secondary" className="font-mono text-xs">
                {ragTool.params.vector_store}
              </Badge>
            </TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">{ragTool.params.collection_name}</TableCell>
            <TableCell>
              {ragTool.discoverable ? (
                <Badge className="bg-success/20 text-success border-success/30">
                  <Check className="mr-1 h-3 w-3" /> Yes
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-muted-foreground">
                  <X className="mr-1 h-3 w-3" /> No
                </Badge>
              )}
            </TableCell>
          </>
        );
      }
      case 'API': {
        const apiTool = tool as APITool;
        return (
          <>
            <TableCell className="font-mono text-sm text-primary">{apiTool.FunctionName}</TableCell>
            <TableCell className="max-w-xs truncate text-muted-foreground">{apiTool.FunctionDescription}</TableCell>
            <TableCell>
              <Badge 
                className={cn(
                  'uppercase font-mono text-xs',
                  apiTool.method === 'get' && 'bg-success/20 text-success border-success/30',
                  apiTool.method === 'post' && 'bg-primary/20 text-primary border-primary/30',
                  apiTool.method === 'put' && 'bg-warning/20 text-warning border-warning/30',
                  apiTool.method === 'delete' && 'bg-destructive/20 text-destructive border-destructive/30'
                )}
              >
                {apiTool.method}
              </Badge>
            </TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">{apiTool.url}</TableCell>
          </>
        );
      }
      case 'MCP': {
        const mcpTool = tool as MCPTool;
        const paramCount = Object.keys(mcpTool.input).length;
        return (
          <>
            <TableCell className="font-mono text-sm text-primary">{mcpTool.FunctionName}</TableCell>
            <TableCell className="max-w-xs truncate text-muted-foreground">{mcpTool.FunctionDescription}</TableCell>
            <TableCell>
              <Badge variant="secondary" className="uppercase font-mono text-xs">
                {mcpTool.server_type}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="text-xs">
                {paramCount} param{paramCount !== 1 ? 's' : ''}
              </Badge>
            </TableCell>
            <TableCell>
              {mcpTool.discoverable ? (
                <Badge className="bg-success/20 text-success border-success/30">
                  <Check className="mr-1 h-3 w-3" /> Yes
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-muted-foreground">
                  <X className="mr-1 h-3 w-3" /> No
                </Badge>
              )}
            </TableCell>
          </>
        );
      }
      case 'Action': {
        const actionTool = tool as ActionTool;
        return (
          <>
            <TableCell className="font-mono text-sm text-primary">{actionTool.FunctionName}</TableCell>
            <TableCell className="max-w-xs truncate text-muted-foreground">{actionTool.FunctionDescription}</TableCell>
            <TableCell>
              <Badge variant="secondary" className="text-xs">
                {actionTool.Tag?.Action || 'Unknown'}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant="outline" className="text-xs">
                {actionTool.Variables.length} var{actionTool.Variables.length !== 1 ? 's' : ''}
              </Badge>
            </TableCell>
            <TableCell>
              {actionTool.discoverable ? (
                <Badge className="bg-success/20 text-success border-success/30">
                  <Check className="mr-1 h-3 w-3" /> Yes
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-muted-foreground">
                  <X className="mr-1 h-3 w-3" /> No
                </Badge>
              )}
            </TableCell>
          </>
        );
      }
    }
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-transparent">
            {getToolColumns().map((column) => (
              <TableHead key={column} className="text-muted-foreground font-medium">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tools.map((tool) => (
            <TableRow
              key={tool.id}
              className={cn(
                'border-border/30 transition-colors',
                hoveredRow === tool.id && 'bg-secondary/30'
              )}
              onMouseEnter={() => setHoveredRow(tool.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {renderToolRow(tool)}
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => onView(tool)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                    onClick={() => onEdit(tool)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(tool.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {tools.length === 0 && (
            <TableRow>
              <TableCell colSpan={getToolColumns().length} className="h-32 text-center text-muted-foreground">
                No {toolType} tools configured yet. Click "Add New" to create one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ToolsTable;
