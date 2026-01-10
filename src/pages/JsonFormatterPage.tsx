import { useState } from 'react';
import { Copy, Check, Trash2, FileJson } from 'lucide-react';

export function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 h-[84px] flex items-center">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-xl font-bold text-white">JSON Formatter</h1>
            <p className="text-gray-400 text-sm">
              Format, validate và minify JSON
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
            >
              <Trash2 size={16} />
              Clear
            </button>
            <button
              onClick={minifyJson}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm"
            >
              Minify
            </button>
            <button
              onClick={formatJson}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
            >
              <FileJson size={16} />
              Format
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto px-6 py-6">
        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Input */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-400 mb-2">Input JSON</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{"key": "value"}'
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm font-mono text-gray-200 focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Output */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-gray-400">Output</label>
              {output && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>
            {error ? (
              <div className="flex-1 bg-red-900/20 border border-red-700 rounded-lg p-4">
                <p className="text-red-400 text-sm font-mono">{error}</p>
              </div>
            ) : (
              <pre className="flex-1 bg-gray-800 border border-gray-700 rounded-lg p-4 text-sm font-mono text-green-400 overflow-auto">
                {output || 'Output sẽ hiển thị ở đây...'}
              </pre>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
