import { Code, Wrench, FileJson, Database, Settings, LucideIcon, Menu } from 'lucide-react';

export type ToolType = 'code-generator' | 'json-formatter' | 'sql-generator' | 'settings';

interface SidebarProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface ToolItem {
  id: ToolType;
  label: string;
  icon: LucideIcon;
}

const tools: ToolItem[] = [
  {
    id: 'code-generator',
    label: 'Code Generator V4',
    icon: Code,
  },
  {
    id: 'json-formatter',
    label: 'JSON Formatter',
    icon: FileJson,
  },
  {
    id: 'sql-generator',
    label: 'SQL Generator',
    icon: Database,
  },
];

export function Sidebar({ activeTool, onSelectTool, isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <div
      className={`bg-gray-900 border-r border-gray-700 flex flex-col h-screen transition-all duration-300 overflow-hidden ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo - same height as page header */}
      <div className={`px-4 border-b border-gray-700 bg-gray-800 flex items-center h-[84px] ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className={`flex items-center gap-2 whitespace-nowrap overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'} transition-all duration-300`}>
          <Wrench className="text-blue-500 flex-shrink-0" size={24} />
          <span className="text-lg font-bold text-white">HNC Tools</span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors flex-shrink-0"
          title={isCollapsed ? 'Mở rộng' : 'Thu gọn'}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Tools List */}
      <nav className="flex-1 p-3 space-y-1 overflow-hidden">
        <div className={`text-xs text-gray-500 uppercase tracking-wider px-3 py-2 whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 py-0' : 'opacity-100'}`}>
          Tools
        </div>
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              title={isCollapsed ? tool.label : undefined}
              className={`w-full flex items-center py-2.5 rounded-lg text-left transition-colors whitespace-nowrap overflow-hidden ${
                isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
              } ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className={`text-sm font-medium transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                {tool.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-gray-700 overflow-hidden">
        <button
          onClick={() => onSelectTool('settings')}
          title={isCollapsed ? 'Settings' : undefined}
          className={`w-full flex items-center py-2.5 rounded-lg text-left transition-colors whitespace-nowrap overflow-hidden ${
            isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
          } ${
            activeTool === 'settings'
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <Settings size={20} className="flex-shrink-0" />
          <span className={`text-sm font-medium transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
            Settings
          </span>
        </button>
      </div>
    </div>
  );
}
