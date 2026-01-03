// Property types for C#
export type CSharpType =
  | 'string'
  | 'int'
  | 'long'
  | 'decimal'
  | 'double'
  | 'bool'
  | 'DateTime'
  | 'Guid'
  | 'string?'
  | 'int?'
  | 'long?'
  | 'decimal?'
  | 'double?'
  | 'bool?'
  | 'DateTime?'
  | 'Guid?';

export interface PropertyDefinition {
  name: string;
  type: CSharpType;
  isRequired: boolean;
  maxLength?: number;
  description?: string;
}

export interface EntityConfig {
  moduleName: string;        // e.g., "Portal"
  entityName: string;        // e.g., "Article"
  properties: PropertyDefinition[];
  hasActivityLog: boolean;
  hasCanUpdated: boolean;    // ICanUpdated - UpdatedTime, UpdatedUser
  hasSoftDelete: boolean;    // ICanDeleted - IsDeleted, DeletedTime, DeletedUser
  generateEndpoints: EndpointType[];
}

export type EndpointType =
  | 'Create'
  | 'Update'
  | 'Delete'
  | 'GetById'
  | 'GetList'
  | 'GetAll';

export interface GeneratedFile {
  path: string;
  fileName: string;
  content: string;
  category: 'Entity' | 'Repository' | 'Service' | 'Endpoint' | 'Model' | 'Mapping' | 'ApiClient';
}

export interface GeneratorResult {
  files: GeneratedFile[];
  summary: {
    totalFiles: number;
    byCategory: Record<string, number>;
  };
}

// Default C# types với display names
export const CSHARP_TYPES: { value: CSharpType; label: string }[] = [
  { value: 'string', label: 'string' },
  { value: 'string?', label: 'string? (nullable)' },
  { value: 'int', label: 'int' },
  { value: 'int?', label: 'int? (nullable)' },
  { value: 'long', label: 'long' },
  { value: 'long?', label: 'long? (nullable)' },
  { value: 'decimal', label: 'decimal' },
  { value: 'decimal?', label: 'decimal? (nullable)' },
  { value: 'double', label: 'double' },
  { value: 'double?', label: 'double? (nullable)' },
  { value: 'bool', label: 'bool' },
  { value: 'bool?', label: 'bool? (nullable)' },
  { value: 'DateTime', label: 'DateTime' },
  { value: 'DateTime?', label: 'DateTime? (nullable)' },
  { value: 'Guid', label: 'Guid' },
  { value: 'Guid?', label: 'Guid? (nullable)' },
];

export const ENDPOINT_TYPES: { value: EndpointType; label: string; description: string }[] = [
  { value: 'Create', label: 'Create', description: 'POST - Tạo mới' },
  { value: 'Update', label: 'Update', description: 'PUT - Cập nhật' },
  { value: 'Delete', label: 'Delete', description: 'DELETE - Xóa' },
  { value: 'GetById', label: 'Get By Id', description: 'GET - Lấy theo ID' },
  { value: 'GetList', label: 'Get List', description: 'GET - Lấy danh sách có phân trang' },
  { value: 'GetAll', label: 'Get All', description: 'GET - Lấy tất cả' },
];
