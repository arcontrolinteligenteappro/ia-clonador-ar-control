
import React from 'react';
import { CloneProject } from '../types';

interface SidebarProps {
  projects: CloneProject[];
  activeId?: string;
  onSelect: (p: CloneProject) => void;
  onDelete: (id: string) => void;
  onNew: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ projects, activeId, onSelect, onDelete, onNew }) => {
  return (
    <aside className="w-72 border-r border-slate-800 bg-slate-900 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic">C</div>
          <span className="text-xl font-outfit font-bold tracking-tight text-white">CloneAI</span>
        </div>
        
        <button 
          onClick={onNew}
          className="w-full flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl border border-slate-700 transition-all active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          <span className="font-medium">New Clone</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recent Projects</h3>
        {projects.length === 0 ? (
          <div className="px-3 py-4 text-sm text-slate-500 italic">No projects yet.</div>
        ) : (
          projects.map((project) => (
            <div 
              key={project.id}
              className={`group relative flex items-center px-3 py-2.5 rounded-lg cursor-pointer transition-all ${activeId === project.id ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'hover:bg-slate-800/50 text-slate-400'}`}
              onClick={() => onSelect(project)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{project.name}</p>
                <p className="text-[10px] opacity-60">
                  {new Date(project.timestamp).toLocaleDateString()}
                </p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-800 mt-auto">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-slate-800/30">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-xs">JD</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Guest Designer</p>
            <p className="text-xs text-slate-500">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
