// Types for RAG Tools Configuration

export type ToolType = 'RAG' | 'API' | 'MCP' | 'Action';

export interface BaseUrl {
  local: string;
  development?: string;
  preprod?: string;
  production?: string;
  prod?: string;
}

export interface InputParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
}

export interface Tag {
  SourceName: string;
  SourceType: string;
  SourceUrl: {
    web?: string;
    app?: string;
  };
  Action: string;
}

// RAG Tool
export interface RAGTool {
  id: string;
  FunctionName: string;
  FunctionDescription: string;
  discoverable: boolean;
  params: {
    vector_store: string;
    database_name: string;
    collection_name: string;
    partition_name: string;
  };
  columns: string[];
  embedding_column: string[];
}

// API Tool
export interface APITool {
  id: string;
  FunctionName: string;
  FunctionDescription: string;
  base_url: BaseUrl;
  url: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  input: {
    body: InputParameter[];
    path: InputParameter[];
    query: InputParameter[];
  };
  postprocess: string[];
  Tag?: Tag;
}

// MCP Tool
export interface MCPTool {
  id: string;
  FunctionName: string;
  FunctionDescription: string;
  base_url: BaseUrl;
  server_type: 'sse' | 'rest' | 'websocket';
  input: Record<string, {
    type: string;
    description: string;
  }>;
  discoverable: boolean;
}

// Action Tool
export interface ActionTool {
  id: string;
  FunctionName: string;
  FunctionDescription: string;
  Variables: string[];
  Tag?: Tag;
  conversational: boolean;
  discoverable: boolean;
}

export type Tool = RAGTool | APITool | MCPTool | ActionTool;

// Form state types
export interface RAGToolFormData {
  FunctionName: string;
  FunctionDescription: string;
  discoverable: boolean;
  vector_store: string;
  database_name: string;
  collection_name: string;
  partition_name: string;
  columns: string;
  embedding_column: string;
}

export interface APIToolFormData {
  FunctionName: string;
  FunctionDescription: string;
  base_url_local: string;
  base_url_development: string;
  base_url_preprod: string;
  base_url_production: string;
  url: string;
  method: string;
  body_params: InputParameter[];
  path_params: InputParameter[];
  query_params: InputParameter[];
}

export interface MCPToolFormData {
  FunctionName: string;
  FunctionDescription: string;
  base_url_local: string;
  base_url_preprod: string;
  base_url_prod: string;
  server_type: string;
  input_params: { name: string; type: string; description: string }[];
  discoverable: boolean;
}

export interface ActionToolFormData {
  FunctionName: string;
  FunctionDescription: string;
  Variables: string;
  SourceName: string;
  SourceType: string;
  SourceUrl_web: string;
  SourceUrl_app: string;
  Action: string;
  conversational: boolean;
  discoverable: boolean;
}
