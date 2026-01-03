import { EntityConfig, GeneratedFile } from '../types';

export function generateMappingProfile(config: EntityConfig): GeneratedFile {
  const { moduleName, entityName, generateEndpoints } = config;

  const mappings: string[] = [];

  // Entity to Model
  mappings.push(`        CreateMap<${entityName}Entity, ${entityName}Model>();`);

  // Create request to Entity
  if (generateEndpoints.includes('Create')) {
    mappings.push(`        CreateMap<Create${entityName}Request, ${entityName}Entity>();`);
  }

  // Update request to Entity
  if (generateEndpoints.includes('Update')) {
    mappings.push(`        CreateMap<Update${entityName}Request, ${entityName}Entity>();`);
  }

  const content = `// Add this to your ${moduleName}MappingProfile.cs

using Fastlink.${moduleName}.Business.Infrastructure.Entities;
using Fastlink.${moduleName}.Shared.Models;
using Fastlink.${moduleName}.Shared.Requests;

// Inside CreateMap() method, add:
${mappings.join('\n')}
`;

  return {
    path: `Fastlink.${moduleName}.Business`,
    fileName: `${entityName}MappingProfile.cs.txt`,
    content: content.trim(),
    category: 'Mapping',
  };
}
