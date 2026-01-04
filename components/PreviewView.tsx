
import React, { useMemo } from 'react';

interface PreviewViewProps {
  code: string;
}

const PreviewView: React.FC<PreviewViewProps> = ({ code }) => {
  // We use an iframe to isolate the styles and rendering of the generated code
  // This is a simplified version; a production app would use a more robust sandbox
  const srcDoc = useMemo(() => {
    // Extract everything between return ( ... ) or just the main content
    // For this demo, we assume the code provided is a valid React component structure.
    // We'll wrap it in a basic React+Tailwind environment.
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://cdn.tailwindcss.com"></script>
          <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
          </style>
        </head>
        <body>
          <div id="preview-root"></div>
          <script type="text/babel">
            const { useState, useEffect, useMemo, useCallback } = React;
            
            // The generated code is injected here
            ${code.replace('export default ClonedWebsite;', '').replace('export const ClonedWebsite', 'const ClonedWebsite')}

            const Root = () => {
                try {
                    return <ClonedWebsite />;
                } catch (e) {
                    return <div className="p-8 text-red-500">Error rendering: {e.message}</div>;
                }
            };

            const root = ReactDOM.createRoot(document.getElementById('preview-root'));
            root.render(<Root />);
          </script>
        </body>
      </html>
    `;
  }, [code]);

  return (
    <div className="h-full bg-white relative">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur border border-slate-200 shadow-lg px-4 py-1.5 rounded-full flex items-center space-x-4 text-xs font-medium text-slate-500">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Preview</span>
        </div>
        <div className="w-px h-3 bg-slate-300"></div>
        <div className="flex items-center space-x-3">
          <button className="hover:text-blue-600">Mobile</button>
          <button className="hover:text-blue-600">Tablet</button>
          <button className="text-blue-600">Desktop</button>
        </div>
      </div>
      <iframe 
        title="preview"
        srcDoc={srcDoc}
        className="w-full h-full border-none"
        sandbox="allow-scripts"
      />
    </div>
  );
};

export default PreviewView;
