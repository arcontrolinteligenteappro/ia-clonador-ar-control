
import React from 'react';

interface EditorViewProps {
  code: string;
}

const EditorView: React.FC<EditorViewProps> = ({ code }) => {
  return (
    <div className="h-full bg-[#0d1117] overflow-auto p-4 font-mono text-sm">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
          <span className="text-slate-500">ClonedWebsite.tsx</span>
          <button 
            onClick={() => {
                navigator.clipboard.writeText(code);
                alert('Code copied to clipboard!');
            }}
            className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-slate-300 transition-colors"
          >
            Copy Code
          </button>
        </div>
        <pre className="text-blue-300">
          <code dangerouslySetInnerHTML={{ 
            __html: code
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;')
              .replace(/import/g, '<span class="text-pink-400">import</span>')
              .replace(/const/g, '<span class="text-blue-400">const</span>')
              .replace(/export/g, '<span class="text-pink-400">export</span>')
              .replace(/return/g, '<span class="text-pink-400">return</span>')
              .replace(/className=/g, '<span class="text-yellow-200">className=</span>')
          }} />
        </pre>
      </div>
    </div>
  );
};

export default EditorView;
