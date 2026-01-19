import { RAGTool, APITool, MCPTool, ActionTool } from '@/types/tools';

export const sampleRAGTools: RAGTool[] = [
  {
    id: 'rag-1',
    FunctionName: 'structural_adaptability',
    FunctionDescription: 'The document examines themes of structural organization, adaptability, and progression across various contexts, emphasizing the need for balance and flexibility to achieve stability.',
    discoverable: true,
    params: {
      vector_store: 'milvus',
      database_name: 'RelianceRetailSubsidiary',
      collection_name: 'fttx_1000004382',
      partition_name: '_default',
    },
    columns: ['id', 'content', 'sourcepage', 'sourcefile', 'url'],
    embedding_column: ['embedding'],
  },
  {
    id: 'rag-2',
    FunctionName: 'fttx_network_elements',
    FunctionDescription: 'Use this tool to answer questions about FTTx network elements and equipment from the FTTx Execution Pocket Diary. This tool covers: network elements such as OLT, S1/S2 optical splitters, ODCs, JC, FDC, FAT, OTB, FDP, MH, HH.',
    discoverable: true,
    params: {
      vector_store: 'neo4j',
      database_name: 'RelianceRetailSubsidiary',
      collection_name: 'fttx_1000004381',
      partition_name: '_default',
    },
    columns: ['id', 'content', 'sourcepage', 'sourcefile', 'url'],
    embedding_column: ['embedding'],
  },
  {
    id: 'rag-3',
    FunctionName: 'hr_policies_knowledge',
    FunctionDescription: 'Use this tool to answer questions about HR policies, leave management, attendance rules, and employee benefits.',
    discoverable: true,
    params: {
      vector_store: 'pinecone',
      database_name: 'HRKnowledgeBase',
      collection_name: 'hr_policies_v2',
      partition_name: '_default',
    },
    columns: ['id', 'content', 'category', 'sourcefile'],
    embedding_column: ['embedding'],
  },
];

export const sampleAPITools: APITool[] = [
  {
    id: 'api-1',
    FunctionName: 'AskPaySummaryInDepthDetail',
    FunctionDescription: 'Useful when the user wants to know about their yearly/annual salary or individual components of their CTC. This includes Basic Pay, Choice Pay, Current LTA amount, Mandatory Debits, Retiral Costs, and Other Payments.',
    base_url: {
      local: 'http://localhost:3200',
      development: 'http://hr-nj-wrapper.ril-pfcb.svc.cluster.local:3200',
      preprod: 'http://hr-nj-wrapper.ril-pfcb.svc.cluster.local:3200',
      production: 'http://hr-nj-wrapper.ril-pfcb.svc.cluster.local:3200',
    },
    url: '/pfcb/wrapper/payroll/pay-summary-detail',
    method: 'post',
    input: {
      body: [
        {
          name: 'date',
          type: 'string',
          description: 'The effective date for which the user is asking the question. Default value should be current date in MM/DD/YYYY format.',
        },
      ],
      path: [],
      query: [],
    },
    postprocess: [],
    Tag: {
      SourceName: 'AskPaySummaryInDepthDetail',
      SourceType: 'Link',
      SourceUrl: { web: '/payroll/root', app: '/payroll' },
      Action: 'OptRedirect',
    },
  },
  {
    id: 'api-2',
    FunctionName: 'GetEmployeeDirectory',
    FunctionDescription: 'Search and retrieve employee information from the corporate directory including name, department, contact details, and reporting structure.',
    base_url: {
      local: 'http://localhost:3200',
      development: 'http://hr-directory.ril-pfcb.svc.cluster.local:3200',
      preprod: 'http://hr-directory.ril-pfcb.svc.cluster.local:3200',
      production: 'http://hr-directory.ril-pfcb.svc.cluster.local:3200',
    },
    url: '/pfcb/wrapper/directory/search',
    method: 'get',
    input: {
      body: [],
      path: [],
      query: [
        { name: 'search', type: 'string', description: 'Search query for employee name or ID' },
        { name: 'department', type: 'string', description: 'Filter by department name' },
      ],
    },
    postprocess: [],
  },
];

export const sampleMCPTools: MCPTool[] = [
  {
    id: 'mcp-1',
    FunctionName: 'VALIDATE_TASK_REQUEST',
    FunctionDescription: 'Use this tool when Consumption Booking data is missing for an FTTx task. Always ask for required parameter Taskid from user if not provided in the query before calling this tool.',
    base_url: {
      local: 'http://localhost:8000/fttx/mcp',
      preprod: 'http://mcp-partnerit.ril-copilot.svc.cluster.local:8000/fttx/mcp',
      prod: 'http://mcp-partnerit.ril-copilot.svc.cluster.local:8000/fttx/mcp',
    },
    server_type: 'sse',
    input: {
      Taskid: {
        type: 'string',
        description: 'The FTTx Task ID to validate.',
      },
    },
    discoverable: true,
  },
  {
    id: 'mcp-2',
    FunctionName: 'VERIFY_POLE_OFFER_CODE',
    FunctionDescription: 'Verify the offer code associated with a pole installation task. Validates against the current offer catalog.',
    base_url: {
      local: 'http://localhost:8000/fttx/mcp',
      preprod: 'http://mcp-partnerit.ril-copilot.svc.cluster.local:8000/fttx/mcp',
      prod: 'http://mcp-partnerit.ril-copilot.svc.cluster.local:8000/fttx/mcp',
    },
    server_type: 'sse',
    input: {
      offer_code: {
        type: 'string',
        description: 'The offer code to validate.',
      },
      task_id: {
        type: 'string',
        description: 'Associated task identifier.',
      },
    },
    discoverable: true,
  },
  {
    id: 'mcp-3',
    FunctionName: 'VERIFY_AUGMENTATION_STATUS',
    FunctionDescription: 'Check the augmentation status for network capacity planning. Returns current utilization and recommendations.',
    base_url: {
      local: 'http://localhost:8000/network/mcp',
      preprod: 'http://mcp-network.ril-copilot.svc.cluster.local:8000/network/mcp',
      prod: 'http://mcp-network.ril-copilot.svc.cluster.local:8000/network/mcp',
    },
    server_type: 'rest',
    input: {
      zone_id: {
        type: 'string',
        description: 'Network zone identifier.',
      },
    },
    discoverable: false,
  },
];

export const sampleActionTools: ActionTool[] = [
  {
    id: 'action-1',
    FunctionName: 'GetDigitalForm16',
    FunctionDescription: 'Useful when the user wants to view/get their Form 16 for Income Tax Return (ITR) filing.',
    Variables: [],
    Tag: {
      SourceName: 'GetForm16',
      SourceType: 'Link',
      SourceUrl: { app: '/payroll/digital-form-16', web: '/payroll/digital-form-16' },
      Action: 'Redirect',
    },
    conversational: false,
    discoverable: true,
  },
  {
    id: 'action-2',
    FunctionName: 'OpenLeaveApplication',
    FunctionDescription: 'Opens the leave application form for the user to submit a new leave request.',
    Variables: ['leave_type', 'start_date', 'end_date'],
    Tag: {
      SourceName: 'LeaveApplication',
      SourceType: 'Form',
      SourceUrl: { app: '/leave/apply', web: '/leave/apply' },
      Action: 'OpenForm',
    },
    conversational: true,
    discoverable: true,
  },
  {
    id: 'action-3',
    FunctionName: 'DownloadPayslip',
    FunctionDescription: 'Download the payslip for a specific month. User needs to provide month and year.',
    Variables: ['month', 'year'],
    Tag: {
      SourceName: 'PayslipDownload',
      SourceType: 'Download',
      SourceUrl: { app: '/payroll/payslip', web: '/payroll/payslip' },
      Action: 'Download',
    },
    conversational: false,
    discoverable: true,
  },
];
