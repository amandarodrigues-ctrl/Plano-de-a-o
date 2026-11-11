import React, { useState } from 'react';
import { ActionPlan } from '../types/actionPlan';
import { X, CheckCircle, Calendar, FileText, ArrowRight } from 'lucide-react';

interface ExecutionModalProps {
  plan: ActionPlan;
  onClose: () => void;
  onCompleteExecution: (planId: string, notes: string, completedDate: string) => void;
}

export const ExecutionModal: React.FC<ExecutionModalProps> = ({
  plan,
  onClose,
  onCompleteExecution
}) => {
  const [completedDate, setCompletedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError('Por favor, informe um breve relato das ações realizadas e evidências de conclusão.');
      return;
    }
    onCompleteExecution(plan.id, notes.trim(), completedDate);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-emerald-800 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-200">{plan.code} · Conclusão Operacional</div>
            <h2 className="text-base font-bold text-white">
              Concluir Execução do Plano de Ação
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
            <span className="font-semibold text-slate-900 block">{plan.what}</span>
            <div className="flex gap-4 text-slate-500 pt-1">
              <span>Executor: <strong>{plan.who}</strong></span>
              <span>Onde: <strong>{plan.where}</strong></span>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-700 text-xs">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="exec-date" className="block text-xs font-semibold text-slate-700 mb-1">
              Data Efetiva de Término da Execução <span className="text-rose-500">*</span>
            </label>
            <input
              id="exec-date"
              type="date"
              value={completedDate}
              onChange={(e) => setCompletedDate(e.target.value)}
              className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label htmlFor="exec-notes" className="block text-xs font-semibold text-slate-700 mb-1">
              Relato da Execução / Evidências de Conclusão <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="exec-notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva as medidas implementadas, números de ordem de serviço, testes efetuados ou certificados gerados..."
              className="w-full text-sm bg-white border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <ArrowRight className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Próxima Etapa: Verificação de Eficácia</p>
              <p className="mt-0.5">
                Ao concluir, a ação mudará de status para <strong>Aguardando Verificação</strong>. O responsável designado (<strong>{plan.efficacyVerifier}</strong>) será notificado para checagem da eficácia.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-all cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Concluir Execução</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
