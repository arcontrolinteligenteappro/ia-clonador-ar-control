
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, CloneProject } from './types';
import { cloneWebsite } from './services/gemini';
import Sidebar from './components/Sidebar';
import EditorView from './components/EditorView';
import PreviewView from './components/PreviewView';
import LandingView from './components/LandingView';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [projects, setProjects] = useState<CloneProject[]>([]);
  const [activeProject, setActiveProject] = useState<CloneProject | null>(null);
  const [view, setView] = useState<'editor' | 'preview'>('editor');
  const [error, setError] = useState<string | null>(null);

  // Load projects from local storage
  useEffect(() => {
    const saved = localStorage.getItem('cloneai_projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  const saveProjects = (updated: CloneProject[]) => {
    setProjects(updated);
    localStorage.setItem('cloneai_projects', JSON.stringify(updated));
  };

  const handleClone = async (description: string, imageUrl?: string, url?: string) => {
    setState(AppState.ANALYZING);
    setError(null);
    
    try {
      const result = await cloneWebsite(description + (url ? ` URL: ${url}` : ''), imageUrl);
      
      const newProject: CloneProject = {
        id: Math.random().toString(36).substring(7),
        name: url || description.slice(0, 20) || 'New Clone',
        description,
        imageUrl,
        url,
        code: result.code,
        timestamp: Date.now()
      };

      const updatedProjects = [newProject, ...projects];
      saveProjects(updatedProjects);
      setActiveProject(newProject);
      setState(AppState.SUCCESS);
      setView('preview');
    } catch (err) {
      console.error(err);
      setError("Failed to clone the website. Please check your API configuration and try again.");
      setState(AppState.ERROR);
    }
  };

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    saveProjects(updated);
    if (activeProject?.id === id) setActiveProject(null);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Navigation Sidebar */}
      <Sidebar 
        projects={projects} 
        activeId={activeProject?.id} 
        onSelect={setActiveProject} 
        onDelete={deleteProject}
        onNew={() => {
            setActiveProject(null);
            setState(AppState.IDLE);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        {activeProject ? (
          <>
            {/* Header / Tabs */}
            <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md">
              <div className="flex items-center space-x-4">
                <h1 className="text-lg font-semibold truncate max-w-xs">{activeProject.name}</h1>
                <div className="flex bg-slate-800 rounded-lg p-1">
                  <button 
                    onClick={() => setView('editor')}
                    className={`px-4 py-1.5 rounded-md text-sm transition-all ${view === 'editor' ? 'bg-blue-600 text-white shadow-lg' : 'hover:text-white'}`}
                  >
                    Code
                  </button>
                  <button 
                    onClick={() => setView('preview')}
                    className={`px-4 py-1.5 rounded-md text-sm transition-all ${view === 'preview' ? 'bg-blue-600 text-white shadow-lg' : 'hover:text-white'}`}
                  >
                    Preview
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                   onClick={() => window.print()}
                   className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                </button>
                <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Export React
                </button>
              </div>
            </header>

            {/* Viewport */}
            <div className="flex-1 overflow-hidden">
              {view === 'editor' ? (
                <EditorView code={activeProject.code} />
              ) : (
                <PreviewView code={activeProject.code} />
              )}
            </div>
          </>
        ) : (
          <LandingView 
            onSubmit={handleClone} 
            isAnalyzing={state === AppState.ANALYZING} 
            error={error}
          />
        )}
      </main>
    </div>
  );
};

export default App;
