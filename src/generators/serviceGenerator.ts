import { EntityConfig, GeneratedFile } from '../types';

export function generateService(config: EntityConfig): GeneratedFile {
  const { moduleName, entityName, properties, idType, hasSoftDelete, generateEndpoints } = config;

  const entityNameLower = entityName.charAt(0).toLowerCase() + entityName.slice(1);

  // Generate method based on endpoints
  const methods: string[] = [];

  if (generateEndpoints.includes('Create')) {
    methods.push(`
    public async Task<BusinessResult<${idType}>> Create${entityName}Async(Create${entityName}Request request, string createdUser)
    {
        string msg;
        try
        {
            var entity = _mapper.Map<${entityName}Entity>(request);
            entity.CreatedUser = createdUser;
            entity.CreatedTime = DateTime.Now;

            await _${entityNameLower}Repository.AddAsync(entity);
            await _${entityNameLower}Repository.SaveChangesAsync();

            _logger.LogInformation("Created ${entityName} with Id: {Id}", entity.Id);

            return BusinessResult<${idType}>.Success(entity.Id);
        }
        catch (Exception ex)
        {
            msg = $"Unhandled exception: {nameof(Create${entityName}Async)}";
            _logger.LogError(ex, msg);
            return BusinessResult<${idType}>.Error(msg);
        }
    }`);
  }

  if (generateEndpoints.includes('Update')) {
    methods.push(`
    public async Task<BusinessResult> Update${entityName}Async(${idType} id, Update${entityName}Request request, string updatedUser)
    {
        string msg;
        try
        {
            var entity = await _${entityNameLower}Repository.GetByIdAsync(id);
            if (entity == null)
                return BusinessResult.NotFound("${entityName} not found");

            _mapper.Map(request, entity);
            entity.UpdatedUser = updatedUser;
            entity.UpdatedTime = DateTime.Now;

            _${entityNameLower}Repository.Update(entity);
            await _${entityNameLower}Repository.SaveChangesAsync();

            _logger.LogInformation("Updated ${entityName} with Id: {Id}", id);

            return BusinessResult.Success();
        }
        catch (Exception ex)
        {
            msg = $"Unhandled exception: {nameof(Update${entityName}Async)}";
            _logger.LogError(ex, msg);
            return BusinessResult.Error(msg);
        }
    }`);
  }

  if (generateEndpoints.includes('Delete')) {
    const deleteLogic = hasSoftDelete
      ? `entity.IsDeleted = true;
            entity.DeletedUser = deletedUser;
            entity.DeletedTime = DateTime.Now;

            _${entityNameLower}Repository.Update(entity);`
      : `_${entityNameLower}Repository.Delete(entity);`;

    methods.push(`
    public async Task<BusinessResult> Delete${entityName}Async(${idType} id, string deletedUser)
    {
        string msg;
        try
        {
            var entity = await _${entityNameLower}Repository.GetByIdAsync(id);
            if (entity == null)
                return BusinessResult.NotFound("${entityName} not found");

            ${deleteLogic}
            await _${entityNameLower}Repository.SaveChangesAsync();

            _logger.LogInformation("Deleted ${entityName} with Id: {Id}", id);

            return BusinessResult.Success();
        }
        catch (Exception ex)
        {
            msg = $"Unhandled exception: {nameof(Delete${entityName}Async)}";
            _logger.LogError(ex, msg);
            return BusinessResult.Error(msg);
        }
    }`);
  }

  if (generateEndpoints.includes('GetById')) {
    methods.push(`
    public async Task<BusinessResult<${entityName}Model>> Get${entityName}ByIdAsync(${idType} id)
    {
        string msg;
        try
        {
            var entity = await _${entityNameLower}Repository.GetByIdAsync(id);
            if (entity == null)
                return BusinessResult<${entityName}Model>.NotFound("${entityName} not found");

            var model = _mapper.Map<${entityName}Model>(entity);
            return BusinessResult<${entityName}Model>.Success(model);
        }
        catch (Exception ex)
        {
            msg = $"Unhandled exception: {nameof(Get${entityName}ByIdAsync)}";
            _logger.LogError(ex, msg);
            return BusinessResult<${entityName}Model>.Error(msg);
        }
    }`);
  }

  if (generateEndpoints.includes('GetList')) {
    methods.push(`
    public async Task<BusinessResult<PagedResult<${entityName}Model>>> GetList${entityName}sAsync(GetList${entityName}sRequest request)
    {
        string msg;
        try
        {
            var query = _${entityNameLower}Repository.GetQueryable();

            // Apply filters here if needed
            // if (!string.IsNullOrEmpty(request.Keyword))
            //     query = query.Where(x => x.Name.Contains(request.Keyword));

            var totalCount = await query.CountAsync();

            var entities = await query
                .OrderByDescending(x => x.CreatedTime)
                .Skip((request.PageIndex - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            var models = _mapper.Map<List<${entityName}Model>>(entities);

            var result = new PagedResult<${entityName}Model>
            {
                Items = models,
                TotalCount = totalCount,
                PageIndex = request.PageIndex,
                PageSize = request.PageSize
            };

            return BusinessResult<PagedResult<${entityName}Model>>.Success(result);
        }
        catch (Exception ex)
        {
            msg = $"Unhandled exception: {nameof(GetList${entityName}sAsync)}";
            _logger.LogError(ex, msg);
            return BusinessResult<PagedResult<${entityName}Model>>.Error(msg);
        }
    }`);
  }

  if (generateEndpoints.includes('GetAll')) {
    methods.push(`
    public async Task<BusinessResult<List<${entityName}Model>>> GetAll${entityName}sAsync()
    {
        string msg;
        try
        {
            var entities = await _${entityNameLower}Repository
                .GetQueryable()
                .OrderByDescending(x => x.CreatedTime)
                .ToListAsync();

            var models = _mapper.Map<List<${entityName}Model>>(entities);
            return BusinessResult<List<${entityName}Model>>.Success(models);
        }
        catch (Exception ex)
        {
            msg = $"Unhandled exception: {nameof(GetAll${entityName}sAsync)}";
            _logger.LogError(ex, msg);
            return BusinessResult<List<${entityName}Model>>.Error(msg);
        }
    }`);
  }

  const content = `using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Framework.Common.Results;
using Fastlink.${moduleName}.Business.Infrastructure.Entities;
using Fastlink.${moduleName}.Business.Infrastructure.Repos;
using Fastlink.${moduleName}.Shared.Models;
using Fastlink.${moduleName}.Shared.Requests;

namespace Fastlink.${moduleName}.Business.Services;

public class ${entityName}Service
{
    private readonly ${entityName}Repository _${entityNameLower}Repository;
    private readonly IMapper _mapper;
    private readonly ILogger<${entityName}Service> _logger;

    public ${entityName}Service(
        ${entityName}Repository ${entityNameLower}Repository,
        IMapper mapper,
        ILogger<${entityName}Service> logger)
    {
        _${entityNameLower}Repository = ${entityNameLower}Repository;
        _mapper = mapper;
        _logger = logger;
    }
${methods.join('\n')}
}
`;

  return {
    path: `Fastlink.${moduleName}.Business/Services`,
    fileName: `${entityName}Service.cs`,
    content: content.trim(),
    category: 'Service',
  };
}
