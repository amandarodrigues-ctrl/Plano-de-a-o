import React, { useState, useEffect } from 'react';
import { ActionPlan, ActionStatus } from './types/actionPlan';
import {
  getActionPlans,
  saveActionPlans,
  resetToDefaults,
  generateNextCode
} from './utils/storage';
import { Header } from './components/Header';
import { ActionPlanForm } from './components/ActionPlanForm';
import { VerificationQueue } from './components/VerificationQueue';
import { DashboardStats } from './components/DashboardStats';
import { VerificationModal } from './components/VerificationModal';
import { ExecutionModal } from './components/ExecutionModal';
import { ActionPlanDetailModal } from './components/ActionPlanDetailModal';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  // Ordem das telas: 1ª Indicadores (padrão), depois Cadastro e por último Verificação de Eficácia
  const [currentView, setCurrentView] = useState<'indicadores' | 'cadastro' | 'verificacao'>('indicadores');

  // Modals state
  const [detailPlan, setDetailPlan] = useState<ActionPlan | null>(null);
  const [editingPlan, setEditingPlan] = useState<ActionPlan | null>(null);
  const [executingPlan, setExecutingPlan] = useState<ActionPlan | null>(null);
  const [verifyingPlan, setVerifyingPlan] = useState<ActionPlan | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const loaded = getActionPlans();
    setPlans(loaded);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSavePlan = (
    planData: Omit<ActionPlan, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'status'> & { id?: string }
  ) => {
    const today = new Date().toISOString().split('T')[0];

    if (planData.id) {
      // Editing existing plan
      const updated = plans.map((p) => {
        if (p.id === planData.id) {
          return {
            ...p,
            ...planData,
            updatedAt: today
          };
        }
        return p;
      });
      setPlans(updated);
      saveActionPlans(updated);
      showToast('Plano de ação atualizado com sucesso!');
      setEditingPlan(null);
      setCurrentView('indicadores');
    } else {
      // Creating new plan
      const newCode = generateNextCode(plans);
      const newPlan: ActionPlan = {
        id: `plan-${Date.now()}`,
        code: newCode,
        createdAt: today,
        updatedAt: today,
        status: 'planejado',
        ...planData
      };

      const updated = [newPlan, ...plans];
      setPlans(updated);
      saveActionPlans(updated);
      showToast(`Plano de ação ${newCode} cadastrado com sucesso!`);
      setCurrentView('indicadores');
    }
  };

  const handleDeletePlan = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este plano de ação?')) {
      const updated = plans.filter((p) => p.id !== id);
      setPlans(updated);
      saveActionPlans(updated);
      showToast('Plano de ação excluído.');
    }
  };

  const handleCompleteExecution = (planId: string, notes: string, completedDate: string) => {
    const updated = plans.map((p) => {
      if (p.id === planId) {
        return {
          ...p,
          status: 'aguardando_verificacao' as ActionStatus,
          executionNotes: notes,
          executionCompletedAt: completedDate,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    });
    setPlans(updated);
    saveActionPlans(updated);
    setExecutingPlan(null);
    showToast('Execução concluída! Plano encaminhado para Verificação de Eficácia.');
  };

  const handleVerifyEfficacy = (
    planId: string,
    result: 'eficaz' | 'ineficaz',
    notes: string,
    score: number,
    verifiedBy: string,
    verifiedDate: string
  ) => {
    const updated = plans.map((p) => {
      if (p.id === planId) {
        return {
          ...p,
          status: result as ActionStatus,
          verifiedAt: verifiedDate,
          verifiedBy: verifiedBy,
          verificationResult: result,
          verificationNotes: notes,
          verificationScore: score,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return p;
    });
    setPlans(updated);
    saveActionPlans(updated);
    setVerifyingPlan(null);
    showToast(
      result === 'eficaz'
        ? 'Verificação concluída: Ação atestada como EFICAZ!'
        : 'Verificação concluída: Ação reprovada como INEFICAZ.'
    );
  };

  const handleResetDefaults = () => {
    const defaults = resetToDefaults();
    setPlans(defaults);
    showToast('Dados de exemplo restaurados.');
  };

  const pendingVerificationCount = plans.filter(
    (p) => p.status === 'aguardando_verificacao'
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header - Ordem das abas: Indicadores, Cadastro, Verificação de Eficácia */}
      <Header
        currentView={currentView}
        onViewChange={(view) => {
          if (view === 'cadastro') {
            setEditingPlan(null);
          }
          setCurrentView(view);
        }}
        onNewPlan={() => {
          setEditingPlan(null);
          setCurrentView('cadastro');
        }}
        pendingVerificationCount={pendingVerificationCount}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 text-sm flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 1ª Aba: Indicadores (com Lista de Planos integrada) */}
        {currentView === 'indicadores' && (
          <DashboardStats
            plans={plans}
            onResetDefaults={handleResetDefaults}
            onNewPlan={() => {
              setEditingPlan(null);
              setCurrentView('cadastro');
            }}
            onViewDetail={(p) => setDetailPlan(p)}
            onEdit={(p) => {
              setEditingPlan(p);
              setCurrentView('cadastro');
            }}
            onDelete={handleDeletePlan}
            onOpenExecution={(p) => setExecutingPlan(p)}
            onOpenVerification={(p) => setVerifyingPlan(p)}
          />
        )}

        {/* 2ª Aba: Cadastro */}
        {currentView === 'cadastro' && (
          <ActionPlanForm
            initialPlan={editingPlan}
            onSave={handleSavePlan}
            onCancel={() => {
              setEditingPlan(null);
              setCurrentView('indicadores');
            }}
          />
        )}

        {/* 3ª Aba: Verificação de Eficácia */}
        {currentView === 'verificacao' && (
          <VerificationQueue
            plans={plans}
            onOpenVerification={(p) => setVerifyingPlan(p)}
            onViewDetail={(p) => setDetailPlan(p)}
          />
        )}
      </main>

      {/* Verification Modal (Fluxo de Aprovação / Eficácia) */}
      {verifyingPlan && (
        <VerificationModal
          plan={verifyingPlan}
          onClose={() => setVerifyingPlan(null)}
          onVerify={handleVerifyEfficacy}
        />
      )}

      {/* Execution Modal */}
      {executingPlan && (
        <ExecutionModal
          plan={executingPlan}
          onClose={() => setExecutingPlan(null)}
          onCompleteExecution={handleCompleteExecution}
        />
      )}

      {/* Detail Modal (Ficha 5W2H) */}
      {detailPlan && (
        <ActionPlanDetailModal
          plan={detailPlan}
          onClose={() => setDetailPlan(null)}
          onEdit={(p) => {
            setDetailPlan(null);
            setEditingPlan(p);
            setCurrentView('cadastro');
          }}
          onOpenExecution={(p) => {
            setDetailPlan(null);
            setExecutingPlan(p);
          }}
          onOpenVerification={(p) => {
            setDetailPlan(null);
            setVerifyingPlan(p);
          }}
        />
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Sistema Integrado de Gestão · Planos de Ação 5W2H & Auditorias</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Agrícola · Indústria · Assari · Administrativo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
