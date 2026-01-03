import { EntityConfig, GeneratedFile, GeneratorResult } from '../types';
import { generateEntity } from './entityGenerator';
import { generateRepository } from './repositoryGenerator';
import { generateService } from './serviceGenerator';
import { generateEndpoints } from './endpointGenerator';
import { generateModels } from './modelGenerator';
import { generateMappingProfile } from './mappingGenerator';
import { generateApiClient } from './apiClientGenerator';

export function generateAll(config: EntityConfig): GeneratorResult {
  const files: GeneratedFile[] = [];

  // 1. Generate ApiClient
  files.push(generateApiClient(config));

  // 2. Generate Entity
  files.push(generateEntity(config));

  // 3. Generate Repository
  files.push(generateRepository(config));

  // 4. Generate Service
  files.push(generateService(config));

  // 5. Generate Models (Request/Response)
  files.push(...generateModels(config));

  // 6. Generate Endpoints
  files.push(...generateEndpoints(config));

  // 7. Generate Mapping Profile hint
  files.push(generateMappingProfile(config));

  // Calculate summary
  const byCategory: Record<string, number> = {};
  for (const file of files) {
    byCategory[file.category] = (byCategory[file.category] || 0) + 1;
  }

  return {
    files,
    summary: {
      totalFiles: files.length,
      byCategory,
    },
  };
}

export * from './entityGenerator';
export * from './repositoryGenerator';
export * from './serviceGenerator';
export * from './endpointGenerator';
export * from './modelGenerator';
export * from './mappingGenerator';
export * from './apiClientGenerator';
