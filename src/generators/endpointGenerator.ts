import { EntityConfig, EndpointType, GeneratedFile, IdType, PropertyDefinition } from '../types';

// Audit fields that should be excluded from validation
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

// Helper: Convert PascalCase to kebab-case
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function generateEndpoint(
  config: EntityConfig,
  endpointType: EndpointType
): GeneratedFile[] {
  const { moduleName, entityName } = config;
  const files: GeneratedFile[] = [];

  const basePath = `Fastlink.${moduleName}.Endpoints/Endpoints/${entityName}`;

  switch (endpointType) {
    case 'Create':
      files.push({
        path: basePath,
        fileName: `AdminCreate${entityName}Endpoint.cs`,
        content: generateCreateEndpoint(moduleName, entityName),
        category: 'Endpoint',
      });
      files.push({
        path: basePath,
        fileName: `AdminCreate${entityName}RequestValidator.cs`,
        content: generateCreateValidator(moduleName, entityName, filterAuditFields(config.properties)),
        category: 'Endpoint',
      });
      break;

    case 'Update':
      files.push({
        path: basePath,
        fileName: `AdminUpdate${entityName}Endpoint.cs`,
        content: generateUpdateEndpoint(moduleName, entityName),
        category: 'Endpoint',
      });
      files.push({
        path: basePath,
        fileName: `AdminUpdate${entityName}RequestValidator.cs`,
        content: generateUpdateValidator(moduleName, entityName, config.idType, filterAuditFields(config.properties)),
        category: 'Endpoint',
      });
      break;

    case 'Delete':
      files.push({
        path: basePath,
        fileName: `AdminDelete${entityName}Endpoint.cs`,
        content: generateDeleteEndpoint(moduleName, entityName),
        category: 'Endpoint',
      });
      files.push({
        path: basePath,
        fileName: `AdminDelete${entityName}RequestValidator.cs`,
        content: generateDeleteValidator(moduleName, entityName, config.idType),
        category: 'Endpoint',
      });
      break;

    case 'GetById':
      files.push({
        path: basePath,
        fileName: `AdminGet${entityName}ByIdEndpoint.cs`,
        content: generateGetByIdEndpoint(moduleName, entityName),
        category: 'Endpoint',
      });
      files.push({
        path: basePath,
        fileName: `AdminGet${entityName}ByIdRequestValidator.cs`,
        content: generateGetByIdValidator(moduleName, entityName, config.idType),
        category: 'Endpoint',
      });
      break;

    case 'GetList':
      files.push({
        path: basePath,
        fileName: `AdminGetList${entityName}sEndpoint.cs`,
        content: generateGetListEndpoint(moduleName, entityName),
        category: 'Endpoint',
      });
      files.push({
        path: basePath,
        fileName: `AdminGetList${entityName}sRequestValidator.cs`,
        content: generateGetListValidator(moduleName, entityName),
        category: 'Endpoint',
      });
      break;

    case 'GetAll':
      files.push({
        path: basePath,
        fileName: `AdminGetAll${entityName}sEndpoint.cs`,
        content: generateGetAllEndpoint(moduleName, entityName),
        category: 'Endpoint',
      });
      break;
  }

  return files;
}

// ============ ENDPOINT GENERATORS ============

function generateCreateEndpoint(moduleName: string, entityName: string): string {
  const serviceVar = entityName.charAt(0).toLowerCase() + entityName.slice(1) + 'Service';
  return `using FastEndpoints;
using Framework.Common.Results;
using Framework.Endpoints;
using Fastlink.${moduleName}.Business.Services;
using Fastlink.${moduleName}.Shared.Models;
using Fastlink.${moduleName}.Shared.Requests;

namespace Fastlink.${moduleName}.Endpoints.Endpoints.${entityName};

public class AdminCreate${entityName}Endpoint : BasePostEndpoint<Create${entityName}Request, BusinessResult>
{
    public override string Group => ${entityName}Const.GroupKey;
    public override string Path => ${entityName}Const.Create${entityName};

    private readonly ${entityName}Service _${serviceVar};

    public AdminCreate${entityName}Endpoint(${entityName}Service ${serviceVar})
    {
        _${serviceVar} = ${serviceVar};
    }

    public override async Task HandleAsync(Create${entityName}Request req, CancellationToken ct)
    {
        var createdUser = this.GetUserName();
        var result = await _${serviceVar}.Create${entityName}Async(req, createdUser);
        await Send.OkAsync(result);
    }
}
`;
}

function generateUpdateEndpoint(moduleName: string, entityName: string): string {
  const serviceVar = entityName.charAt(0).toLowerCase() + entityName.slice(1) + 'Service';
  return `using FastEndpoints;
using Framework.Common.Results;
using Framework.Endpoints;
using Fastlink.${moduleName}.Business.Services;
using Fastlink.${moduleName}.Shared.Models;
using Fastlink.${moduleName}.Shared.Requests;

namespace Fastlink.${moduleName}.Endpoints.Endpoints.${entityName};

public class AdminUpdate${entityName}Endpoint : BasePutEndpoint<Update${entityName}Request, BusinessResult>
{
    public override string Group => ${entityName}Const.GroupKey;
    public override string Path => ${entityName}Const.Update${entityName};

    private readonly ${entityName}Service _${serviceVar};

    public AdminUpdate${entityName}Endpoint(${entityName}Service ${serviceVar})
    {
        _${serviceVar} = ${serviceVar};
    }

    public override async Task HandleAsync(Update${entityName}Request req, CancellationToken ct)
    {
        var updatedUser = this.GetUserName();
        var result = await _${serviceVar}.Update${entityName}Async(req.Id, req, updatedUser);
        await Send.OkAsync(result);
    }
}
`;
}

function generateDeleteEndpoint(moduleName: string, entityName: string): string {
  const serviceVar = entityName.charAt(0).toLowerCase() + entityName.slice(1) + 'Service';
  return `using FastEndpoints;
using Framework.Common.Results;
using Framework.Endpoints;
using Fastlink.${moduleName}.Business.Services;
using Fastlink.${moduleName}.Shared.Models;
using Fastlink.${moduleName}.Shared.Requests;

namespace Fastlink.${moduleName}.Endpoints.Endpoints.${entityName};

public class AdminDelete${entityName}Endpoint : BaseDeleteEndpoint<Delete${entityName}Request, BusinessResult>
{
    public override string Group => ${entityName}Const.GroupKey;
    public override string Path => ${entityName}Const.Delete${entityName};

    private readonly ${entityName}Service _${serviceVar};

    public AdminDelete${entityName}Endpoint(${entityName}Service ${serviceVar})
    {
        _${serviceVar} = ${serviceVar};
    }

    public override async Task HandleAsync(Delete${entityName}Request req, CancellationToken ct)
    {
        var deletedUser = this.GetUserName();
        var result = await _${serviceVar}.Delete${entityName}Async(req.Id, deletedUser);
        await Send.OkAsync(result);
    }
}
`;
}

function generateGetByIdEndpoint(moduleName: string, entityName: string): string {
  const serviceVar = entityName.charAt(0).toLowerCase() + entityName.slice(1) + 'Service';
  return `using FastEndpoints;
using Framework.Common.Results;
using Framework.Endpoints;
using Fastlink.${moduleName}.Business.Services;
using Fastlink.${moduleName}.Shared.Models;
using Fastlink.${moduleName}.Shared.Requests;

namespace Fastlink.${moduleName}.Endpoints.Endpoints.${entityName};

public class AdminGet${entityName}ByIdEndpoint : BaseGetEndpoint<Get${entityName}ByIdRequest, BusinessResult<${entityName}Model>>
{
    public override string Group => ${entityName}Const.GroupKey;
    public override string Path => ${entityName}Const.Get${entityName}ById;

    private readonly ${entityName}Service _${serviceVar};

    public AdminGet${entityName}ByIdEndpoint(${entityName}Service ${serviceVar})
    {
        _${serviceVar} = ${serviceVar};
    }

    public override async Task HandleAsync(Get${entityName}ByIdRequest req, CancellationToken ct)
    {
        var result = await _${serviceVar}.Get${entityName}ByIdAsync(req.Id);
        await Send.OkAsync(result);
    }
}
`;
}

function generateGetListEndpoint(moduleName: string, entityName: string): string {
  const serviceVar = entityName.charAt(0).toLowerCase() + entityName.slice(1) + 'Service';
  return `using FastEndpoints;
using Framework.Common.Results;
using Framework.Endpoints;
using Fastlink.${moduleName}.Business.Services;
using Fastlink.${moduleName}.Shared.Models;
using Fastlink.${moduleName}.Shared.Requests;

namespace Fastlink.${moduleName}.Endpoints.Endpoints.${entityName};

public class AdminGetList${entityName}sEndpoint : BaseGetEndpoint<GetList${entityName}sRequest, BusinessResult<PagedResult<${entityName}Model>>>
{
    public override string Group => ${entityName}Const.GroupKey;
    public override string Path => ${entityName}Const.GetList${entityName}s;

    private readonly ${entityName}Service _${serviceVar};

    public AdminGetList${entityName}sEndpoint(${entityName}Service ${serviceVar})
    {
        _${serviceVar} = ${serviceVar};
    }

    public override async Task HandleAsync(GetList${entityName}sRequest req, CancellationToken ct)
    {
        var result = await _${serviceVar}.GetList${entityName}sAsync(req);
        await Send.OkAsync(result);
    }
}
`;
}

function generateGetAllEndpoint(moduleName: string, entityName: string): string {
  const serviceVar = entityName.charAt(0).toLowerCase() + entityName.slice(1) + 'Service';
  return `using FastEndpoints;
using Framework.Common.Results;
using Framework.Endpoints;
using Fastlink.${moduleName}.Business.Services;
using Fastlink.${moduleName}.Shared.Models;

namespace Fastlink.${moduleName}.Endpoints.Endpoints.${entityName};

public class AdminGetAll${entityName}sEndpoint : BaseGetEndpoint<EmptyRequest, BusinessResult<List<${entityName}Model>>>
{
    public override string Group => ${entityName}Const.GroupKey;
    public override string Path => ${entityName}Const.GetAll${entityName}s;

    private readonly ${entityName}Service _${serviceVar};

    public AdminGetAll${entityName}sEndpoint(${entityName}Service ${serviceVar})
    {
        _${serviceVar} = ${serviceVar};
    }

    public override async Task HandleAsync(EmptyRequest req, CancellationToken ct)
    {
        var result = await _${serviceVar}.GetAll${entityName}sAsync();
        await Send.OkAsync(result);
    }
}
`;
}

// ============ VALIDATOR GENERATORS ============

interface PropertyDef {
  name: string;
  type: string;
  isRequired: boolean;
  maxLength?: number;
}

function generateCreateValidator(moduleName: string, entityName: string, properties: PropertyDef[]): string {
  const rules = properties
    .filter(p => p.isRequired || p.maxLength)
    .map(p => {
      const ruleLines: string[] = [];
      if (p.isRequired) {
        if (p.type === 'string' || p.type === 'string?') {
          ruleLines.push(`        RuleFor(x => x.${p.name}).NotEmpty().WithMessage("${p.name} is required.");`);
        } else {
          ruleLines.push(`        RuleFor(x => x.${p.name}).NotNull().WithMessage("${p.name} is required.");`);
        }
      }
      if (p.maxLength && (p.type === 'string' || p.type === 'string?')) {
        ruleLines.push(`        RuleFor(x => x.${p.name}).MaximumLength(${p.maxLength}).WithMessage("${p.name} must not exceed ${p.maxLength} characters.");`);
      }
      return ruleLines.join('\n');
    })
    .filter(r => r)
    .join('\n');

  return `using FastEndpoints;
using Fastlink.${moduleName}.Shared.Requests;
using FluentValidation;

namespace Fastlink.${moduleName}.Endpoints.Endpoints.${entityName};

public class AdminCreate${entityName}RequestValidator : Validator<Create${entityName}Request>
{
    public AdminCreate${entityName}RequestValidator()
    {
${rules || '        // Add validation rules here'}
    }
}
`;
}

function getIdValidationRule(idType: IdType): string {
  switch (idType) {
    case 'long':
      return 'RuleFor(x => x.Id).GreaterThan(0).WithMessage("Id is required.");';
    case 'string':
      return 'RuleFor(x => x.Id).NotEmpty().WithMessage("Id is required.");';
    case 'Guid':
      return 'RuleFor(x => x.Id).NotEmpty().WithMessage("Id is required.");';
  }
}

function generateUpdateValidator(moduleName: string, entityName: string, idType: IdType, properties: PropertyDef[]): string {
  const rules = properties
    .filter(p => p.isRequired || p.maxLength)
    .map(p => {
      const ruleLines: string[] = [];
      if (p.isRequired) {
        if (p.type === 'string' || p.type === 'string?') {
          ruleLines.push(`        RuleFor(x => x.${p.name}).NotEmpty().WithMessage("${p.name} is required.");`);
        } else {
          ruleLines.push(`        RuleFor(x => x.${p.name}).NotNull().WithMessage("${p.name} is required.");`);
        }
      }
      if (p.maxLength && (p.type === 'string' || p.type === 'string?')) {
        ruleLines.push(`        RuleFor(x => x.${p.name}).MaximumLength(${p.maxLength}).WithMessage("${p.name} must not exceed ${p.maxLength} characters.");`);
      }
      return ruleLines.join('\n');
    })
    .filter(r => r)
    .join('\n');

  return `using FastEndpoints;
using Fastlink.${moduleName}.Shared.Requests;
using FluentValidation;

namespace Fastlink.${moduleName}.Endpoints.Endpoints.${entityName};

public class AdminUpdate${entityName}RequestValidator : Validator<Update${entityName}Request>
{
    public AdminUpdate${entityName}RequestValidator()
    {
        ${getIdValidationRule(idType)}
${rules ? '\n' + rules : ''}
    }
}
`;
}

function generateDeleteValidator(moduleName: string, entityName: string, idType: IdType): string {
  return `using FastEndpoints;
using Fastlink.${moduleName}.Shared.Requests;
using FluentValidation;

namespace Fastlink.${moduleName}.Endpoints.Endpoints.${entityName};

public class AdminDelete${entityName}RequestValidator : Validator<Delete${entityName}Request>
{
    public AdminDelete${entityName}RequestValidator()
    {
        ${getIdValidationRule(idType)}
    }
}
`;
}

function generateGetByIdValidator(moduleName: string, entityName: string, idType: IdType): string {
  return `using FastEndpoints;
using Fastlink.${moduleName}.Shared.Requests;
using FluentValidation;

namespace Fastlink.${moduleName}.Endpoints.Endpoints.${entityName};

public class AdminGet${entityName}ByIdRequestValidator : Validator<Get${entityName}ByIdRequest>
{
    public AdminGet${entityName}ByIdRequestValidator()
    {
        ${getIdValidationRule(idType)}
    }
}
`;
}

function generateGetListValidator(moduleName: string, entityName: string): string {
  return `using FastEndpoints;
using Fastlink.${moduleName}.Shared.Requests;
using FluentValidation;

namespace Fastlink.${moduleName}.Endpoints.Endpoints.${entityName};

public class AdminGetList${entityName}sRequestValidator : Validator<GetList${entityName}sRequest>
{
    public AdminGetList${entityName}sRequestValidator()
    {
        RuleFor(x => x.PageIndex).GreaterThan(0).WithMessage("PageIndex must be greater than 0.");
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100).WithMessage("PageSize must be between 1 and 100.");
    }
}
`;
}

// ============ EXPORTS ============

export function generateEndpoints(config: EntityConfig): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  // Generate Const file (in Shared/Models)
  files.push(generateConstFile(config));

  // Generate endpoints based on selected types
  for (const endpointType of config.generateEndpoints) {
    files.push(...generateEndpoint(config, endpointType));
  }

  return files;
}

function generateConstFile(config: EntityConfig): GeneratedFile {
  const { moduleName, entityName, generateEndpoints: endpoints } = config;
  const kebabName = toKebabCase(entityName);

  const paths: string[] = [];

  if (endpoints.includes('GetList')) {
    paths.push(`    public const string GetList${entityName}s = $"{BaseRoute}/get-list-${kebabName}s";`);
  }
  if (endpoints.includes('GetById')) {
    paths.push(`    public const string Get${entityName}ById = $"{BaseRoute}/get-${kebabName}-by-id";`);
  }
  if (endpoints.includes('GetAll')) {
    paths.push(`    public const string GetAll${entityName}s = $"{BaseRoute}/get-all-${kebabName}s";`);
  }
  if (endpoints.includes('Create')) {
    paths.push(`    public const string Create${entityName} = $"{BaseRoute}/create-${kebabName}";`);
  }
  if (endpoints.includes('Update')) {
    paths.push(`    public const string Update${entityName} = $"{BaseRoute}/update-${kebabName}";`);
  }
  if (endpoints.includes('Delete')) {
    paths.push(`    public const string Delete${entityName} = $"{BaseRoute}/delete-${kebabName}";`);
  }

  const content = `namespace Fastlink.${moduleName}.Shared.Models;

public class ${entityName}Const
{
    public const string BaseRoute = "/api/v1/${kebabName}";

    public const string GroupKey = "${entityName}";

${paths.join('\n')}
}
`;

  return {
    path: `Fastlink.${moduleName}.Shared/Models/${entityName}`,
    fileName: `${entityName}Const.cs`,
    content: content.trim(),
    category: 'Model',
  };
}
