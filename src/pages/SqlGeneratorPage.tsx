import { Database } from 'lucide-react';

export function SqlGeneratorPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 h-[84px] flex items-center">
        <div>
          <h1 className="text-xl font-bold text-white">SQL Generator</h1>
          <p className="text-gray-400 text-sm">
            Generate SQL scripts từ schema
          </p>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Database size={64} className="text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl text-gray-400 mb-2">Coming Soon</h2>
          <p className="text-gray-500">
            Tính năng này đang được phát triển...
          </p>
        </div>
      </main>
    </div>
  );
}
