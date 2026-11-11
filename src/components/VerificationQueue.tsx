import React, { useState } from 'react';
import { ActionPlan } from '../types/actionPlan';
import { formatDate, formatCurrency } from '../utils/storage';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  User,
  Building2,
  FileText,
  AlertCircle,
  Eye
} from 'lucide-react';

interface VerificationQueueProps {
  plans: ActionPlan[];
  onOpenVerification: (plan: ActionPlan) => void;
  onViewDetail: (plan: ActionPlan) => void;
}

export const VerificationQueue: React.FC<VerificationQueueProps> = ({
  plans,
  onOpenVerification,
  onViewDetail
}) => {
  const [filterMode, setFilterMode] = useState<'pending' | 'verified' | 'all'>('pending');

  const pendingList = plans.filter((p) => p.status === 'aguardando_verificacao');
  const verifiedList = plans.filter((p) => p.status === 'eficaz' || p.status === 'ineficaz');

  const displayedList =
    filterMode === 'pending'
      ? pendingList
      : filterMode === 'verified'
      ? verifiedList
      : [...pendingList, ...verifiedList];

  return (
    <div className="space-y-6">
      {/* Top Banner & Context */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Gestão da Qualidade</span>
            <span aria-hidden="true">·</span>
            <span>Auditoria & Eficácia</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Fila de Verificação de Eficácia & Aprovações
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Ambiente exclusivo para os responsáveis pela checagem se as ações implementadas foram verdadeiramente eficazes na eliminação da causa-raiz.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'pending'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Pendentes de Checagem</span>
            <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 rounded-full text-[10px] tabular-nums font-bold">
              {pendingList.length}
            </span>
          </button>
          <button
            onClick={() => setFilterMode('verified')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'verified'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Já Verificadas</span>
            <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded-full text-[10px] tabular-nums font-bold">
              {verifiedList.length}
            </span>
          </button>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({pendingList.length + verifiedList.length})
          </button>
        </div>
      </div>

      {/* Grid of Cards */}
      {displayedList.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            {filterMode === 'pending'
              ? 'Nenhuma ação aguardando verificação no momento!'
              : 'Nenhuma ação verificada encontrada.'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {filterMode === 'pending'
              ? 'Quando os executores concluírem os planos 5W2H, as ações aparecerão aqui para checagem de eficácia.'
              : 'Verifique as ações pendentes para preencher este histórico.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedList.map((plan) => {
            const isPending = plan.status === 'aguardando_verificacao';

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-xl border transition-all p-5 flex flex-col justify-between ${
                  isPending
                    ? 'border-amber-200 shadow-xs hover:border-amber-400'
                    : plan.status === 'eficaz'
                    ? 'border-emerald-200'
                    : 'border-rose-200'
                }`}
              >
                <div>
                  {/* Top line metadata */}
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{plan.code}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="font-semibold text-slate-700">{plan.unidade}</span>
                    </div>

                    {isPending ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700" />
                        Aguardando Checagem
                      </span>
                    ) : plan.status === 'eficaz' ? (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                        Eficaz ({plan.verificationScore ?? 100}%)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-200 flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-700" />
                        Ineficaz ({plan.verificationScore ?? 0}%)
                      </span>
                    )}
                  </div>

                  {/* Category and Norma */}
                  <div className="text-[11px] text-slate-500 mb-2">
                    <span>{plan.categoria}</span>
                    {plan.referenciaNormativa && (
                      <>
                        <span aria-hidden="true" className="mx-1">/</span>
                        <span className="font-mono">{plan.referenciaNormativa}</span>
                      </>
                    )}
                  </div>

                  {/* What */}
                  <h3 className="text-sm font-bold text-slate-900 leading-snug mb-3">
                    {plan.what}
                  </h3>

                  {/* Evidence of Execution */}
                  {plan.executionNotes && (
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 mb-3 space-y-1">
                      <div className="flex items-center justify-between text-slate-500 text-[10px]">
                        <span>Relato de Execução ({plan.who}):</span>
                        <span className="tabular-nums font-mono">
                          Concluído: {formatDate(plan.executionCompletedAt)}
                        </span>
                      </div>
                      <p className="italic">{plan.executionNotes}</p>
                    </div>
                  )}

                  {/* Verifier & Criteria */}
                  <div className="space-y-1.5 text-xs text-slate-600 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Responsável Designado:</span>
                      <span className="font-semibold text-slate-900">{plan.efficacyVerifier}</span>
                    </div>
                    {plan.efficacyTargetDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Data Prevista de Checagem:</span>
                        <span className="font-mono tabular-nums font-semibold text-slate-800">
                          {formatDate(plan.efficacyTargetDate)}
                        </span>
                      </div>
                    )}
                    {plan.efficacyCriteria && (
                      <div className="pt-1 border-t border-emerald-100 text-[11px]">
                        <span className="text-slate-500 block mb-0.5">Critério de Aceite:</span>
                        <span className="text-emerald-950 font-medium">{plan.efficacyCriteria}</span>
                      </div>
                    )}
                  </div>

                  {/* Already Verified details if available */}
                  {plan.verifiedAt && (
                    <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 mb-4">
                      <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                        <span>Verificado por {plan.verifiedBy}</span>
                        <span className="tabular-nums font-mono">{formatDate(plan.verifiedAt)}</span>
                      </div>
                      <p className="text-slate-800 italic">{plan.verificationNotes}</p>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => onViewDetail(plan)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver Ficha 5W2H</span>
                  </button>

                  {isPending ? (
                    <button
                      onClick={() => onOpenVerification(plan)}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Auditar / Verificar Eficácia</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenVerification(plan)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Reavaliar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
