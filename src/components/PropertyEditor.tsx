import { useState } from 'react';
import { Plus, Trash2, FileText } from 'lucide-react';
import { PropertyDefinition, CSHARP_TYPES, CSharpType } from '../types';

interface Props {
  properties: PropertyDefinition[];
  onChange: (properties: PropertyDefinition[]) => void;
}

// Map SQL types to C# types
function sqlTypeToCSharp(sqlType: string, isNullable: boolean): CSharpType {
  const type = sqlType.toLowerCase();

  if (type.includes('varchar') || type.includes('text') || type.includes('char')) {
    return isNullable ? 'string?' : 'string';
  }
  if (type === 'int' || type === 'integer') {
    return isNullable ? 'int?' : 'int';
  }
  if (type === 'bigint' || type === 'long') {
    return isNullable ? 'long?' : 'long';
  }
  if (type === 'decimal' || type === 'numeric' || type === 'money') {
    return isNullable ? 'decimal?' : 'decimal';
  }
  if (type === 'float' || type === 'double' || type === 'real') {
    return isNullable ? 'double?' : 'double';
  }
  if (type === 'bit' || type === 'boolean' || type === 'bool') {
    return isNullable ? 'bool?' : 'bool';
  }
  if (type === 'datetime' || type === 'datetime2' || type === 'date' || type === 'timestamp') {
    return isNullable ? 'DateTime?' : 'DateTime';
  }
  if (type === 'uniqueidentifier' || type === 'guid' || type === 'uuid') {
    return isNullable ? 'Guid?' : 'Guid';
  }

  return isNullable ? 'string?' : 'string';
}

// Parse database schema text
function parseDbSchema(text: string): PropertyDefinition[] {
  const lines = text.trim().split('\n').filter(line => line.trim());
  const properties: PropertyDefinition[] = [];

  for (const line of lines) {
    // Skip header line
    if (line.toLowerCase().includes('name') && line.toLowerCase().includes('type')) {
      continue;
    }

    // Split by tab or multiple spaces
    const parts = line.split(/\t+|\s{2,}/).map(p => p.trim()).filter(p => p);

    if (parts.length >= 2) {
      const name = parts[0];
      const sqlType = parts[1];
      // Check if "Not null" column exists and is true, or check for 0/1 pattern
      const isNotNull = parts.length > 3 ? parts[4] === '1' || parts[4]?.toLowerCase() === 'true' : false;
      const isNullable = !isNotNull;

      properties.push({
        name,
        type: sqlTypeToCSharp(sqlType, isNullable),
        isRequired: !isNullable,
      });
    }
  }

  return properties;
}

export function PropertyEditor({ properties, onChange }: Props) {
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');

  const addProperty = () => {
    onChange([
      ...properties,
      {
        name: '',
        type: 'string',
        isRequired: true,
      },
    ]);
  };

  const updateProperty = (index: number, updates: Partial<PropertyDefinition>) => {
    const newProps = [...properties];
    newProps[index] = { ...newProps[index], ...updates };
    onChange(newProps);
  };

  const removeProperty = (index: number) => {
    onChange(properties.filter((_, i) => i !== index));
  };

  const handleImport = () => {
    const parsed = parseDbSchema(importText);
    if (parsed.length > 0) {
      onChange(parsed);
      setImportText('');
      setShowImport(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-200">Properties</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImport(!showImport)}
            className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 rounded text-sm"
          >
            <FileText size={16} />
            Import from DB
          </button>
          <button
            onClick={addProperty}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm"
          >
            <Plus size={16} />
            Add Property
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImport && (
        <div className="bg-gray-700 rounded-lg p-4 space-y-3">
          <div className="text-sm text-gray-300">
            Paste database schema (tab-separated: Name, Type, Length, Decimals, Not null):
          </div>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder={`Id\tvarchar\t64\t0\nCode\tvarchar\t32\t0\nStatus\tint\t0\t0\nCreatedTime\tdatetime\t0\t0`}
            className="w-full h-40 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm font-mono focus:border-purple-500 focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium"
            >
              Parse & Import
            </button>
            <button
              onClick={() => {
                setShowImport(false);
                setImportText('');
              }}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm"
            >
              Cancel
            </button>
            <span className="text-xs text-gray-400 ml-2">
              This will replace existing properties
            </span>
          </div>
        </div>
      )}

      {properties.length === 0 ? (
        <p className="text-gray-500 text-sm italic">No properties added yet</p>
      ) : (
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 font-medium px-1">
            <div className="col-span-5">Name</div>
            <div className="col-span-4">Type</div>
            <div className="col-span-2">Required</div>
            <div className="col-span-1"></div>
          </div>

          {properties.map((prop, index) => (
            <div
              key={index}
              className="grid grid-cols-12 gap-2 items-center bg-gray-800 p-2 rounded"
            >
              <input
                type="text"
                value={prop.name}
                onChange={(e) => updateProperty(index, { name: e.target.value })}
                placeholder="PropertyName"
                className="col-span-5 bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              />

              <select
                value={prop.type}
                onChange={(e) => updateProperty(index, { type: e.target.value as CSharpType })}
                className="col-span-4 bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
              >
                {CSHARP_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>

              <div className="col-span-2 flex items-center">
                <input
                  type="checkbox"
                  checked={prop.isRequired}
                  onChange={(e) => updateProperty(index, { isRequired: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={() => removeProperty(index)}
                className="col-span-1 p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
