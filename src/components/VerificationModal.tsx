import React, { useState } from 'react';
import { ActionPlan } from '../types/actionPlan';
import { formatDate, formatCurrency } from '../utils/storage';
import {
  X,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Calendar,
  User,
  FileCheck,
  AlertTriangle,
  Building2,
  DollarSign
} from 'lucide-react';

interface VerificationModalProps {
  plan: ActionPlan;
  onClose: () => void;
  onVerify: (
    planId: string,
    result: 'eficaz' | 'ineficaz',
    notes: string,
    score: number,
    verifiedBy: string,
    verifiedDate: string
  ) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  plan,
  onClose,
  onVerify
}) => {
  const [result, setResult] = useState<'eficaz' | 'ineficaz'>('eficaz');
  const [verifiedBy, setVerifiedBy] = useState(plan.efficacyVerifier || '');
  const [verifiedDate, setVerifiedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');
  const [score, setScore] = useState<number>(100);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedBy.trim()) {
      setError('Informe o nome do responsável pela verificação.');
      return;
    }
    if (!notes.trim()) {
      setError('Informe o parecer técnico da verificação (evidências observadas).');
      return;
    }

    onVerify(plan.id, result, notes.trim(), score, verifiedBy.trim(), verifiedDate);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span>{plan.code}</span>
                <span aria-hidden="true">·</span>
                <span>{plan.unidade}</span>
                <span aria-hidden="true">·</span>
                <span>{plan.categoria}</span>
              </div>
              <h2 className="text-base font-bold text-white leading-tight">
                Fluxo de Aprovação: Verificação de Eficácia
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumo da Ação em Avaliação */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-3">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              O que foi planejado (What):
            </span>
            <p className="text-sm font-medium text-slate-900">{plan.what}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-600 border-t border-slate-200/60">
            <div>
              <span className="font-semibold text-slate-700 block">Executor (Who):</span>
              <span className="truncate block">{plan.who}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-700 block">Prazo Concluído:</span>
              <span className="tabular-nums">{formatDate(plan.executionCompletedAt || plan.when)}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-700 block">Custo Investido:</span>
              <span className="tabular-nums font-mono">{formatCurrency(plan.howMuch)}</span>
            </div>
          </div>

          {plan.executionNotes && (
            <div className="pt-2 text-xs text-slate-600 border-t border-slate-200/60 bg-white p-3 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-800 block mb-0.5">
                Relato de Conclusão da Execução:
              </span>
              <p className="italic text-slate-700">{plan.executionNotes}</p>
            </div>
          )}

          {plan.efficacyCriteria && (
            <div className="text-xs bg-amber-50 text-amber-900 p-2.5 rounded-lg border border-amber-200">
              <span className="font-semibold block mb-0.5">Critério de Eficácia Definido no Cadastro:</span>
              <span>{plan.efficacyCriteria}</span>
            </div>
          )}
        </div>

        {/* Formulário de Verificação */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Veredito: Eficaz vs Ineficaz */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Resultado da Verificação de Eficácia <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setResult('eficaz');
                  if (score < 70) setScore(100);
                  setError('');
                }}
                className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  result === 'eficaz'
                    ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className={`w-5 h-5 ${result === 'eficaz' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Ação Eficaz (Aprovada)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setResult('ineficaz');
                  if (score > 60) setScore(40);
                  setError('');
                }}
                className={`flex items-center justify-center gap-2.5 p-3.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                  result === 'ineficaz'
                    ? 'bg-rose-50 border-rose-600 text-rose-900 ring-2 ring-rose-500/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <XCircle className={`w-5 h-5 ${result === 'ineficaz' ? 'text-rose-600' : 'text-slate-400'}`} />
                <span>Ação Ineficaz (Reprovada)</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              {result === 'eficaz'
                ? 'A ação eliminou a causa-raiz e o problema não voltou a ocorrer dentro do período avaliado.'
                : 'A não-conformidade persiste ou a ação não atingiu o resultado esperado. Exigirá novo plano corretivo.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Responsável que realizou a auditoria */}
            <div>
              <label htmlFor="auditor-verifier" className="block text-xs font-semibold text-slate-700 mb-1">
                Responsável pela Checagem <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="auditor-verifier"
                  type="text"
                  value={verifiedBy}
                  onChange={(e) => setVerifiedBy(e.target.value)}
                  placeholder="Nome do Auditor / Checador"
                  className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Definido no cadastro: <span className="text-slate-600">{plan.efficacyVerifier}</span>
              </p>
            </div>

            {/* Data da Verificação */}
            <div>
              <label htmlFor="auditor-date" className="block text-xs font-semibold text-slate-700 mb-1">
                Data da Verificação Realizada <span className="text-rose-500">*</span>
              </label>
              <input
                id="auditor-date"
                type="date"
                value={verifiedDate}
                onChange={(e) => setVerifiedDate(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Grau de Eficácia / Score */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Grau de Atendimento da Meta:</span>
              <span className="font-mono text-emerald-800 text-sm font-bold tabular-nums">
                {score}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={score}
              onChange={(e) => setScore(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0% (Sem efeito)</span>
              <span>50% (Parcial)</span>
              <span>100% (Totalmente Eficaz)</span>
            </div>
          </div>

          {/* Parecer Técnico da Verificação */}
          <div>
            <label htmlFor="auditor-notes" className="block text-xs font-semibold text-slate-700 mb-1">
              Parecer Técnico e Evidências da Verificação <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="auditor-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva o que foi constatado in loco, resultados de testes, laudos ou checklists analisados..."
              className="w-full text-sm bg-white border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Registre os dados comprobatórios que justificam a aprovação ou reprovação da eficácia.
            </p>
          </div>

          {/* Footer Actions */}
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
              className={`inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-lg transition-all cursor-pointer ${
                result === 'eficaz'
                  ? 'bg-emerald-700 hover:bg-emerald-800'
                  : 'bg-rose-700 hover:bg-rose-800'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Concluir Verificação ({result === 'eficaz' ? 'Aprovar' : 'Reprovar'})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
