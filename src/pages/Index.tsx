import { useState, useMemo } from 'react';
import { Plus, Database, Zap, Server, Play } from 'lucide-react';
import Header from '@/components/layout/Header';
import StatsCards from '@/components/tools/StatsCards';
import ToolsTable from '@/components/tools/ToolsTable';
import ToolFormModal from '@/components/tools/ToolFormModal';
import ViewToolModal from '@/components/tools/ViewToolModal';
import DeleteConfirmDialog from '@/components/tools/DeleteConfirmDialog';
import ToolsFilter from '@/components/tools/ToolsFilter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ToolType, Tool, RAGTool, APITool, MCPTool, ActionTool } from '@/types/tools';
import { sampleRAGTools, sampleAPITools, sampleMCPTools, sampleActionTools } from '@/data/sampleTools';

const Index = () => {
  const { toast } = useToast();
  
  // Tool states
  const [ragTools, setRagTools] = useState<RAGTool[]>(sampleRAGTools);
  const [apiTools, setApiTools] = useState<APITool[]>(sampleAPITools);
  const [mcpTools, setMcpTools] = useState<MCPTool[]>(sampleMCPTools);
  const [actionTools, setActionTools] = useState<ActionTool[]>(sampleActionTools);
  
  // UI states
  const [activeTab, setActiveTab] = useState<ToolType>('RAG');
  const [searchQuery, setSearchQuery] = useState('');
  const [discoverableFilter, setDiscoverableFilter] = useState('all');
  
  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [toolToDelete, setToolToDelete] = useState<{ id: string; name: string } | null>(null);

  const getToolsForType = (type: ToolType): Tool[] => {
    switch (type) {
      case 'RAG': return ragTools;
      case 'API': return apiTools;
      case 'MCP': return mcpTools;
      case 'Action': return actionTools;
    }
  };

  const filterTools = (tools: Tool[]): Tool[] => {
    let filtered = [...tools];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.FunctionName.toLowerCase().includes(query) ||
          t.FunctionDescription.toLowerCase().includes(query)
      );
    }
    
    // Discoverable filter
    if (discoverableFilter !== 'all') {
      const isDiscoverable = discoverableFilter === 'discoverable';
      filtered = filtered.filter((t) => {
        if ('discoverable' in t) {
          return t.discoverable === isDiscoverable;
        }
        return true;
      });
    }
    
    return filtered;
  };

  const getFilteredToolsForType = (type: ToolType): Tool[] => {
    return filterTools(getToolsForType(type));
  };

  const handleAddNew = () => {
    setSelectedTool(null);
    setFormModalOpen(true);
  };

  const handleEdit = (tool: Tool) => {
    setSelectedTool(tool);
    setFormModalOpen(true);
  };

  const handleView = (tool: Tool) => {
    setSelectedTool(tool);
    setViewModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const tools = getToolsForType(activeTab);
    const tool = tools.find((t) => t.id === id);
    if (tool) {
      setToolToDelete({ id, name: tool.FunctionName });
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (!toolToDelete) return;
    
    switch (activeTab) {
      case 'RAG':
        setRagTools((prev) => prev.filter((t) => t.id !== toolToDelete.id));
        break;
      case 'API':
        setApiTools((prev) => prev.filter((t) => t.id !== toolToDelete.id));
        break;
      case 'MCP':
        setMcpTools((prev) => prev.filter((t) => t.id !== toolToDelete.id));
        break;
      case 'Action':
        setActionTools((prev) => prev.filter((t) => t.id !== toolToDelete.id));
        break;
    }
    
    toast({
      title: 'Tool deleted',
      description: `${toolToDelete.name} has been removed successfully.`,
    });
    
    setDeleteDialogOpen(false);
    setToolToDelete(null);
  };

  const handleSave = (tool: Tool) => {
    const isEdit = selectedTool !== null;
    
    switch (activeTab) {
      case 'RAG':
        if (isEdit) {
          setRagTools((prev) => prev.map((t) => (t.id === tool.id ? (tool as RAGTool) : t)));
        } else {
          setRagTools((prev) => [...prev, tool as RAGTool]);
        }
        break;
      case 'API':
        if (isEdit) {
          setApiTools((prev) => prev.map((t) => (t.id === tool.id ? (tool as APITool) : t)));
        } else {
          setApiTools((prev) => [...prev, tool as APITool]);
        }
        break;
      case 'MCP':
        if (isEdit) {
          setMcpTools((prev) => prev.map((t) => (t.id === tool.id ? (tool as MCPTool) : t)));
        } else {
          setMcpTools((prev) => [...prev, tool as MCPTool]);
        }
        break;
      case 'Action':
        if (isEdit) {
          setActionTools((prev) => prev.map((t) => (t.id === tool.id ? (tool as ActionTool) : t)));
        } else {
          setActionTools((prev) => [...prev, tool as ActionTool]);
        }
        break;
    }
    
    toast({
      title: isEdit ? 'Tool updated' : 'Tool created',
      description: `${tool.FunctionName} has been ${isEdit ? 'updated' : 'created'} successfully.`,
    });
  };

  const tabConfig = [
    { value: 'RAG' as ToolType, label: 'RAG', icon: Database, count: ragTools.length },
    { value: 'API' as ToolType, label: 'API', icon: Zap, count: apiTools.length },
    { value: 'MCP' as ToolType, label: 'MCP', icon: Server, count: mcpTools.length },
    { value: 'Action' as ToolType, label: 'Actions', icon: Play, count: actionTools.length },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Tools Configuration
          </h1>
          <p className="mt-2 text-muted-foreground">
            Configure and manage RAG, API, MCP, and Action tools for your agents
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards
            ragCount={ragTools.length}
            apiCount={apiTools.length}
            mcpCount={mcpTools.length}
            actionCount={actionTools.length}
          />
        </div>
        
        {/* Tools Management */}
        <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ToolType)}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <TabsList className="bg-secondary/50 p-1">
                {tabConfig.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-background/50 text-xs font-medium">
                      {tab.count}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add New {activeTab} Tool
              </Button>
            </div>
            
            {/* Filters */}
            <div className="mb-6">
              <ToolsFilter
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                discoverableFilter={discoverableFilter}
                onDiscoverableChange={setDiscoverableFilter}
              />
            </div>
            
            {/* Tables */}
            {tabConfig.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-0">
                <ToolsTable
                  tools={getFilteredToolsForType(tab.value)}
                  toolType={tab.value}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onView={handleView}
                />
                <div className="mt-4 text-sm text-muted-foreground">
                  Showing {getFilteredToolsForType(tab.value).length} of {getToolsForType(tab.value).length} tools
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      {/* Modals */}
      <ToolFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setSelectedTool(null);
        }}
        onSave={handleSave}
        toolType={activeTab}
        editTool={selectedTool}
      />
      
      <ViewToolModal
        open={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedTool(null);
        }}
        tool={selectedTool}
        toolType={activeTab}
      />
      
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setToolToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        toolName={toolToDelete?.name || ''}
      />
    </div>
  );
};

export default Index;
