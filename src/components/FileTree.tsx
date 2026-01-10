import { File, FolderOpen } from 'lucide-react';
import { GeneratedFile } from '../types';
import clsx from 'clsx';

interface Props {
  files: GeneratedFile[];
  selectedFile: GeneratedFile | null;
  onSelectFile: (file: GeneratedFile) => void;
}

interface GroupedFiles {
  [category: string]: GeneratedFile[];
}

const categoryColors: Record<string, string> = {
  Entity: 'text-purple-400',
  Repository: 'text-blue-400',
  Service: 'text-green-400',
  Endpoint: 'text-yellow-400',
  Model: 'text-orange-400',
  Mapping: 'text-pink-400',
};

const categoryIcons: Record<string, string> = {
  Entity: '🗃️',
  Repository: '📦',
  Service: '⚙️',
  Endpoint: '🔌',
  Model: '📋',
  Mapping: '🔗',
};

export function FileTree({ files, selectedFile, onSelectFile }: Props) {
  // Group files by category
  const grouped = files.reduce<GroupedFiles>((acc, file) => {
    if (!acc[file.category]) {
      acc[file.category] = [];
    }
    acc[file.category].push(file);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-700 border-b border-gray-600">
        <h3 className="text-sm font-semibold text-gray-200">
          Generated Files ({files.length})
        </h3>
      </div>

      <div className="p-2 max-h-[calc(100vh-300px)] overflow-auto">
        {categories.map((category) => (
          <div key={category} className="mb-3">
            <div className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-gray-400">
              <FolderOpen size={14} className={categoryColors[category]} />
              <span>{categoryIcons[category]} {category}</span>
              <span className="text-xs text-gray-500">
                ({grouped[category].length})
              </span>
            </div>

            <div className="ml-4 space-y-0.5">
              {grouped[category].map((file, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectFile(file)}
                  className={clsx(
                    'w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm rounded transition-colors',
                    selectedFile === file
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  )}
                >
                  <File size={14} />
                  <span className="truncate">{file.fileName}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
