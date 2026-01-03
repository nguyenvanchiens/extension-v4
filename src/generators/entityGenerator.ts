import { EntityConfig, GeneratedFile, PropertyDefinition } from '../types';

// Audit fields that are auto-generated based on interface flags
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

export function generateEntity(config: EntityConfig): GeneratedFile {
  const { moduleName, entityName, properties, hasCanUpdated, hasSoftDelete } = config;

  // Filter out audit fields to avoid duplicates
  const filteredProps = filterAuditFields(properties);

  const propertiesCode = filteredProps
    .map(prop => {
      return `    public ${prop.type} ${prop.name} { get; set; }${prop.type === 'string' ? ' = string.Empty;' : ''}`;
    })
    .join('\n\n');

  // Build interfaces list
  const interfaces: string[] = [];
  if (hasCanUpdated) {
    interfaces.push('ICanUpdated');
  }
  if (hasSoftDelete) {
    interfaces.push('ICanDeleted');
  }

  const baseClass = interfaces.length > 0
    ? `BaseEntity, ${interfaces.join(', ')}`
    : 'BaseEntity';

  // Build audit properties
  const auditProps: string[] = [];

  if (hasCanUpdated) {
    auditProps.push(`
    public DateTime? UpdatedTime { get; set; }

    public string? UpdatedUser { get; set; }`);
  }

  if (hasSoftDelete) {
    auditProps.push(`
    public bool IsDeleted { get; set; }

    public DateTime? DeletedTime { get; set; }

    public string? DeletedUser { get; set; }`);
  }

  const content = `using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Framework.Data;

namespace Fastlink.${moduleName}.Business.Infrastructure.Entities;

[Table("${entityName}")]
public class ${entityName}Entity : ${baseClass}
{
${propertiesCode}
${auditProps.join('\n')}
}
`;

  return {
    path: `Fastlink.${moduleName}.Business/Infrastructure/Entities`,
    fileName: `${entityName}Entity.cs`,
    content: content.trim(),
    category: 'Entity',
  };
}
