import { EntityConfig, GeneratedFile } from '../types';

export function generateApiClient(config: EntityConfig): GeneratedFile {
  const { moduleName, entityName, generateEndpoints } = config;

  const methods: string[] = [];

  if (generateEndpoints.includes('GetAll')) {
    methods.push(`
        public async Task<BusinessResult<List<${entityName}Model>>> GetAll${entityName}sAsync()
        {
            return await GetAsync<List<${entityName}Model>>(${entityName}Const.GetAll${entityName}s);
        }`);
  }

  if (generateEndpoints.includes('GetList')) {
    methods.push(`
        public async Task<BusinessResult<PagedList<${entityName}Model>>> GetList${entityName}sAsync(GetList${entityName}sRequest req)
        {
            return await PostAsync<PagedList<${entityName}Model>>(${entityName}Const.GetList${entityName}s, req);
        }`);
  }

  if (generateEndpoints.includes('GetById')) {
    methods.push(`
        public async Task<BusinessResult<${entityName}Model>> Get${entityName}ByIdAsync(Get${entityName}ByIdRequest req)
        {
            return await PostAsync<${entityName}Model>(${entityName}Const.Get${entityName}ById, req);
        }`);
  }

  if (generateEndpoints.includes('Create')) {
    methods.push(`
        public async Task<BusinessResult> Create${entityName}Async(Create${entityName}Request req)
        {
            return await PostAsync(${entityName}Const.Create${entityName}, req);
        }`);
  }

  if (generateEndpoints.includes('Update')) {
    methods.push(`
        public async Task<BusinessResult> Update${entityName}Async(Update${entityName}Request req)
        {
            return await PostAsync(${entityName}Const.Update${entityName}, req);
        }`);
  }

  if (generateEndpoints.includes('Delete')) {
    methods.push(`
        public async Task<BusinessResult> Delete${entityName}Async(Delete${entityName}Request req)
        {
            return await PostAsync(${entityName}Const.Delete${entityName}, req);
        }`);
  }

  const content = `using Fastlink.${moduleName}.Shared.Models;
using Fastlink.${moduleName}.Shared.Requests;
using Framework.Common;

namespace Fastlink.${moduleName}.ApiClient;

public class ${entityName}ApiClient : Base${moduleName}ApiClient
{
    public ${entityName}ApiClient(IHttpClientFactory httpClientFactory, IServiceProvider serviceProvider, IOpenIdConnectTokenProvider tokenProvider)
        : base(httpClientFactory, serviceProvider, tokenProvider)
    {
    }
${methods.join('\n')}
}
`;

  return {
    path: `Fastlink.${moduleName}.ApiClient`,
    fileName: `${entityName}ApiClient.cs`,
    content: content.trim(),
    category: 'ApiClient',
  };
}
