import React from 'react';
import { Plus, CheckSquare } from 'lucide-react';

interface HeaderProps {
  currentView: 'indicadores' | 'cadastro' | 'verificacao';
  onViewChange: (view: 'indicadores' | 'cadastro' | 'verificacao') => void;
  onNewPlan: () => void;
  pendingVerificationCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  onNewPlan,
  pendingVerificationCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand title wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block leading-tight">
                Plano de Ação 5W2H
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Gestão & Verificação de Eficácia
              </span>
            </div>
          </div>

          {/* Zone 2: 3 nav tabs in required order: Indicadores -> Cadastro -> Verificação de Eficácia */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button
              onClick={() => onViewChange('indicadores')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
                currentView === 'indicadores'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : 'hover:text-slate-900'
              }`}
            >
              Indicadores
            </button>

            <button
              onClick={() => onViewChange('cadastro')}
              className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
                currentView === 'cadastro'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : 'hover:text-slate-900'
              }`}
            >
              Cadastro
            </button>

            <button
              onClick={() => onViewChange('verificacao')}
              className={`whitespace-nowrap transition-colors py-1 flex items-center gap-2 cursor-pointer ${
                currentView === 'verificacao'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : 'hover:text-slate-900'
              }`}
            >
              <span>Verificação de Eficácia</span>
              {pendingVerificationCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full tabular-nums">
                  {pendingVerificationCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNewPlan}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 active:scale-[0.99] transition-all shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Plano</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav strip */}
      <div className="md:hidden flex overflow-x-auto border-t border-slate-200 px-4 py-2 gap-2 bg-slate-50">
        <button
          onClick={() => onViewChange('indicadores')}
          className={`px-3 py-1.5 text-xs rounded-md font-medium whitespace-nowrap ${
            currentView === 'indicadores' ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'text-slate-600'
          }`}
        >
          Indicadores & Planos
        </button>
        <button
          onClick={() => onViewChange('cadastro')}
          className={`px-3 py-1.5 text-xs rounded-md font-medium whitespace-nowrap ${
            currentView === 'cadastro' ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'text-slate-600'
          }`}
        >
          Cadastro
        </button>
        <button
          onClick={() => onViewChange('verificacao')}
          className={`px-3 py-1.5 text-xs rounded-md font-medium whitespace-nowrap ${
            currentView === 'verificacao' ? 'bg-white shadow-xs text-emerald-800 font-bold' : 'text-slate-600'
          }`}
        >
          Verificação ({pendingVerificationCount})
        </button>
      </div>
    </header>
  );
};
