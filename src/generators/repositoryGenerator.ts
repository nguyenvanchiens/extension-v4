import { EntityConfig, GeneratedFile } from '../types';

export function generateRepository(config: EntityConfig): GeneratedFile {
  const { moduleName, entityName } = config;

  const content = `using Fastlink.${moduleName}.Business.Infrastructure.Entities;

namespace Fastlink.${moduleName}.Business.Infrastructure.Repos;

public class ${entityName}Repository : Base${moduleName}Repository<${entityName}Entity>
{
    public ${entityName}Repository(${moduleName}DbContext dbContext) : base(dbContext)
    {
    }
}
`;

  return {
    path: `Fastlink.${moduleName}.Business/Infrastructure/Repos`,
    fileName: `${entityName}Repository.cs`,
    content: content.trim(),
    category: 'Repository',
  };
}
