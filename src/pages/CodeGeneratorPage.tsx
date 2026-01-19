import { useState, useMemo } from 'react';
import { Download, Wand2, RotateCcw, Copy, Check, PanelLeftClose, PanelLeft } from 'lucide-react';
import { PropertyEditor } from '../components/PropertyEditor';
import { CodePreview } from '../components/CodePreview';
import { FileTree } from '../components/FileTree';
import { generateAll } from '../generators';
import { downloadAsZip, copyAllToClipboard } from '../utils/zipGenerator';
import {
  EntityConfig,
  PropertyDefinition,
  EndpointType,
  GeneratedFile,
  ENDPOINT_TYPES,
  IdType,
} from '../types';

const ID_TYPES: { value: IdType; label: string }[] = [
  { value: 'long', label: 'long' },
  { value: 'string', label: 'string' },
  { value: 'Guid', label: 'Guid' },
];

const defaultConfig: EntityConfig = {
  moduleName: 'Portal',
  entityName: '',
  properties: [],
  idType: 'long',
  hasActivityLog: true,
  hasCanUpdated: true,
  hasSoftDelete: true,
  generateEndpoints: ['Create', 'Update', 'Delete', 'GetById', 'GetList'],
};

export function CodeGeneratorPage() {
  const [config, setConfig] = useState<EntityConfig>(defaultConfig);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [configCollapsed, setConfigCollapsed] = useState(false);

  const isValid = useMemo(() => {
    return (
      config.moduleName.trim() !== '' &&
      config.entityName.trim() !== '' &&
      config.properties.length > 0 &&
      config.properties.every((p) => p.name.trim() !== '') &&
      config.generateEndpoints.length > 0
    );
  }, [config]);

  const handleGenerate = () => {
    if (!isValid) return;

    const result = generateAll(config);
    setGeneratedFiles(result.files);
    setSelectedFile(result.files[0] || null);
  };

  const handleReset = () => {
    setConfig(defaultConfig);
    setGeneratedFiles([]);
    setSelectedFile(null);
  };

  const handleDownloadZip = async () => {
    await downloadAsZip(generatedFiles, config.entityName);
  };

  const handleCopyAll = async () => {
    await copyAllToClipboard(generatedFiles);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const toggleEndpoint = (endpoint: EndpointType) => {
    setConfig((prev) => ({
      ...prev,
      generateEndpoints: prev.generateEndpoints.includes(endpoint)
        ? prev.generateEndpoints.filter((e) => e !== endpoint)
        : [...prev.generateEndpoints, endpoint],
    }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 h-[84px] flex items-center">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl font-bold text-white">Code Generator V4</h1>
            <p className="text-gray-400 text-sm">
              Generate Entity, Repository, Service, Endpoints cho PortalApi V4
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              onClick={handleGenerate}
              disabled={!isValid}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm font-medium"
            >
              <Wand2 size={16} />
              Generate Code
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Left Panel - Configuration */}
          <div
            className="transition-all duration-300 ease-in-out flex-shrink-0 overflow-hidden"
            style={{
              width: configCollapsed ? '48px' : '41.666667%',
            }}
          >
            <div className="relative h-full" style={{ minWidth: '400px' }}>
              {/* Toggle Button - Always visible when collapsed */}
              <button
                onClick={() => setConfigCollapsed(false)}
                className={`absolute top-0 left-0 w-12 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300 z-10 ${
                  configCollapsed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                title="Mở rộng"
              >
                <PanelLeft size={20} />
              </button>

              {/* Content wrapper with clip and fade */}
              <div
                className={`transition-opacity duration-300 ease-in-out ${
                  configCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="bg-gray-800 rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-200">
                        Basic Information
                      </span>
                      <button
                        onClick={() => setConfigCollapsed(true)}
                        className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                        title="Thu gọn"
                      >
                        <PanelLeftClose size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Module Name
                        </label>
                        <input
                          type="text"
                          value={config.moduleName}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              moduleName: e.target.value,
                            }))
                          }
                          placeholder="Portal"
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Entity Name
                        </label>
                        <input
                          type="text"
                          value={config.entityName}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              entityName: e.target.value,
                            }))
                          }
                          placeholder="Article"
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Id Type
                        </label>
                        <select
                          value={config.idType}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              idType: e.target.value as IdType,
                            }))
                          }
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        >
                          {ID_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          checked={config.hasCanUpdated}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              hasCanUpdated: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                        />
                        ICanUpdated
                      </label>

                      <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          checked={config.hasSoftDelete}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              hasSoftDelete: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                        />
                        ICanDeleted
                      </label>

                      <label className="flex items-center gap-2 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          checked={config.hasActivityLog}
                          onChange={(e) =>
                            setConfig((prev) => ({
                              ...prev,
                              hasActivityLog: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                        />
                        Activity Log
                      </label>
                    </div>
                  </div>

                  {/* Endpoints Selection */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-200 mb-3">
                      Endpoints to Generate
                    </h2>
                    <div className="grid grid-cols-2 gap-2">
                      {ENDPOINT_TYPES.map((ep) => (
                        <label
                          key={ep.value}
                          className="flex items-center gap-2 p-2 rounded bg-gray-700 hover:bg-gray-600 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={config.generateEndpoints.includes(ep.value)}
                            onChange={() => toggleEndpoint(ep.value)}
                            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500"
                          />
                          <div>
                            <div className="text-sm text-gray-200">{ep.label}</div>
                            <div className="text-xs text-gray-500">
                              {ep.description}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Properties Editor */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <PropertyEditor
                      properties={config.properties}
                      onChange={(properties: PropertyDefinition[]) =>
                        setConfig((prev) => ({ ...prev, properties }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Generated Code */}
          <div className="flex-1 space-y-4 transition-all duration-300 min-w-0">
            {generatedFiles.length > 0 ? (
              <>
                {/* Action buttons */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-200">
                    Generated Files
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyAll}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                    >
                      {copiedAll ? (
                        <>
                          <Check size={16} className="text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Copy All
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDownloadZip}
                      className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded text-sm"
                    >
                      <Download size={16} />
                      Download ZIP
                    </button>
                  </div>
                </div>

                {/* File Tree & Preview */}
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-2">
                    <FileTree
                      files={generatedFiles}
                      selectedFile={selectedFile}
                      onSelectFile={setSelectedFile}
                    />
                  </div>
                  <div className="col-span-3">
                    {selectedFile && (
                      <CodePreview
                        code={selectedFile.content}
                        fileName={selectedFile.fileName}
                      />
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-96 bg-gray-800 rounded-lg">
                <Wand2 size={48} className="text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg">
                  Điền thông tin và nhấn "Generate Code"
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Code sẽ được tạo theo pattern của PortalApi module
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
