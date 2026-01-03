import { useState, useMemo } from 'react';
import { Download, Wand2, RotateCcw, Copy, Check } from 'lucide-react';
import { PropertyEditor } from './components/PropertyEditor';
import { CodePreview } from './components/CodePreview';
import { FileTree } from './components/FileTree';
import { generateAll } from './generators';
import { downloadAsZip, copyAllToClipboard } from './utils/zipGenerator';
import {
  EntityConfig,
  PropertyDefinition,
  EndpointType,
  GeneratedFile,
  ENDPOINT_TYPES,
} from './types';

const defaultConfig: EntityConfig = {
  moduleName: 'Portal',
  entityName: '',
  properties: [],
  hasActivityLog: true,
  hasCanUpdated: true,
  hasSoftDelete: true,
  generateEndpoints: ['Create', 'Update', 'Delete', 'GetById', 'GetList'],
};

function App() {
  const [config, setConfig] = useState<EntityConfig>(defaultConfig);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<GeneratedFile | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              HNC Code Generator
            </h1>
            <p className="text-gray-400 text-sm">
              Generate Entity, Repository, Service, Endpoints cho PortalApi
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

      <main className="w-full px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Configuration */}
          <div className="col-span-5 space-y-6">
            {/* Basic Info */}
            <div className="bg-gray-800 rounded-lg p-4 space-y-4">
              <h2 className="text-lg font-semibold text-gray-200">
                Basic Information
              </h2>

              <div className="grid grid-cols-2 gap-4">
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

          {/* Right Panel - Generated Code */}
          <div className="col-span-7 space-y-4">
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

export default App;
