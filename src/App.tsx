import { useState } from 'react';
import { Sidebar, ToolType } from './components/Sidebar';
import { CodeGeneratorPage } from './pages/CodeGeneratorPage';
import { JsonFormatterPage } from './pages/JsonFormatterPage';
import { SqlGeneratorPage } from './pages/SqlGeneratorPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  const [activeTool, setActiveTool] = useState<ToolType>('code-generator');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (activeTool) {
      case 'code-generator':
        return <CodeGeneratorPage />;
      case 'json-formatter':
        return <JsonFormatterPage />;
      case 'sql-generator':
        return <SqlGeneratorPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <CodeGeneratorPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 overflow-hidden">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
