import { EntityConfig, GeneratedFile, PropertyDefinition } from '../types';

// Audit fields that should be excluded from requests
const AUDIT_FIELDS = [
  'Id',
  'CreatedTime',
  'CreatedUser',
  'UpdatedTime',
  'UpdatedUser',
  'DeletedTime',
  'DeletedUser',
  'IsDeleted',
];

function isAuditField(name: string): boolean {
  return AUDIT_FIELDS.some(f => f.toLowerCase() === name.toLowerCase());
}

function filterAuditFields(properties: PropertyDefinition[]): PropertyDefinition[] {
  return properties.filter(p => !isAuditField(p.name));
}

export function generateModels(config: EntityConfig): GeneratedFile[] {
  const { moduleName, entityName, properties, generateEndpoints } = config;
  const files: GeneratedFile[] = [];

  // Generate main model
  files.push(generateMainModel(config));

  // Generate request models based on endpoints
  if (generateEndpoints.includes('Create')) {
    files.push(generateCreateRequest(config));
  }

  if (generateEndpoints.includes('Update')) {
    files.push(generateUpdateRequest(config));
  }

  if (generateEndpoints.includes('Delete')) {
    files.push(generateDeleteRequest(config));
  }

  if (generateEndpoints.includes('GetById')) {
    files.push(generateGetByIdRequest(config));
  }

  if (generateEndpoints.includes('GetList')) {
    files.push(generateGetListRequest(config));
  }

  return files;
}

function generateMainModel(config: EntityConfig): GeneratedFile {
  const { moduleName, entityName, properties, idType, hasCanUpdated, hasSoftDelete } = config;

  // Filter out audit fields to avoid duplicates
  const filteredProps = filterAuditFields(properties);

  const propsCode = filteredProps
    .map(prop => `    public ${prop.type} ${prop.name} { get; set; }${prop.type === 'string' ? ' = string.Empty;' : ''}`)
    .join('\n');

  // Build audit properties based on flags
  const auditProps: string[] = [
    '    public DateTime CreatedTime { get; set; }',
    '    public string? CreatedUser { get; set; }',
  ];

  if (hasCanUpdated) {
    auditProps.push('    public DateTime? UpdatedTime { get; set; }');
    auditProps.push('    public string? UpdatedUser { get; set; }');
  }

  if (hasSoftDelete) {
    auditProps.push('    public bool IsDeleted { get; set; }');
    auditProps.push('    public DateTime? DeletedTime { get; set; }');
    auditProps.push('    public string? DeletedUser { get; set; }');
  }

  const idDefault = idType === 'string' ? ' = string.Empty;' : '';
  const content = `namespace Fastlink.${moduleName}.Shared.Models;

public class ${entityName}Model
{
    public ${idType} Id { get; set; }${idDefault}
${propsCode}
${auditProps.join('\n')}
}
`;

  return {
    path: `Fastlink.${moduleName}.Shared/Models`,
    fileName: `${entityName}Model.cs`,
    content: content.trim(),
    category: 'Model',
  };
}

function generateCreateRequest(config: EntityConfig): GeneratedFile {
  const { moduleName, entityName, properties } = config;

  // Filter out audit fields from Create request
  const filteredProps = filterAuditFields(properties);

  const propsCode = filteredProps
    .map(prop => `    public ${prop.type} ${prop.name} { get; set; }${prop.type === 'string' ? ' = string.Empty;' : ''}`)
    .join('\n');

  const content = `namespace Fastlink.${moduleName}.Shared.Requests;

public class Create${entityName}Request
{
${propsCode}
}
`;

  return {
    path: `Fastlink.${moduleName}.Shared/Requests`,
    fileName: `Create${entityName}Request.cs`,
    content: content.trim(),
    category: 'Model',
  };
}

function generateUpdateRequest(config: EntityConfig): GeneratedFile {
  const { moduleName, entityName, properties, idType } = config;

  // Filter out audit fields from Update request
  const filteredProps = filterAuditFields(properties);

  const propsCode = filteredProps
    .map(prop => `    public ${prop.type} ${prop.name} { get; set; }${prop.type === 'string' ? ' = string.Empty;' : ''}`)
    .join('\n');

  const idDefault = idType === 'string' ? ' = string.Empty;' : '';
  const content = `namespace Fastlink.${moduleName}.Shared.Requests;

public class Update${entityName}Request
{
    public ${idType} Id { get; set; }${idDefault}
${propsCode}
}
`;

  return {
    path: `Fastlink.${moduleName}.Shared/Requests`,
    fileName: `Update${entityName}Request.cs`,
    content: content.trim(),
    category: 'Model',
  };
}

function generateDeleteRequest(config: EntityConfig): GeneratedFile {
  const { moduleName, entityName, idType } = config;

  const idDefault = idType === 'string' ? ' = string.Empty;' : '';
  const content = `namespace Fastlink.${moduleName}.Shared.Requests;

public class Delete${entityName}Request
{
    public ${idType} Id { get; set; }${idDefault}
}
`;

  return {
    path: `Fastlink.${moduleName}.Shared/Requests`,
    fileName: `Delete${entityName}Request.cs`,
    content: content.trim(),
    category: 'Model',
  };
}

function generateGetByIdRequest(config: EntityConfig): GeneratedFile {
  const { moduleName, entityName, idType } = config;

  const idDefault = idType === 'string' ? ' = string.Empty;' : '';
  const content = `namespace Fastlink.${moduleName}.Shared.Requests;

public class Get${entityName}ByIdRequest
{
    public ${idType} Id { get; set; }${idDefault}
}
`;

  return {
    path: `Fastlink.${moduleName}.Shared/Requests`,
    fileName: `Get${entityName}ByIdRequest.cs`,
    content: content.trim(),
    category: 'Model',
  };
}

function generateGetListRequest(config: EntityConfig): GeneratedFile {
  const { moduleName, entityName } = config;

  const content = `namespace Fastlink.${moduleName}.Shared.Requests;

public class GetList${entityName}sRequest
{
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? Keyword { get; set; }
}
`;

  return {
    path: `Fastlink.${moduleName}.Shared/Requests`,
    fileName: `GetList${entityName}sRequest.cs`,
    content: content.trim(),
    category: 'Model',
  };
}
