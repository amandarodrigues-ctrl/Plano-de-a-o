import React from 'react';
import { ActionPlan, STATUS_CONFIG } from '../types/actionPlan';
import { formatDate, formatCurrency } from '../utils/storage';
import {
  X,
  Printer,
  Edit,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Tag,
  FileText,
  DollarSign,
  User,
  MapPin,
  Calendar,
  Wrench,
  HelpCircle,
  Target,
  UserCheck
} from 'lucide-react';

interface ActionPlanDetailModalProps {
  plan: ActionPlan;
  onClose: () => void;
  onEdit: (plan: ActionPlan) => void;
  onOpenExecution: (plan: ActionPlan) => void;
  onOpenVerification: (plan: ActionPlan) => void;
}

export const ActionPlanDetailModal: React.FC<ActionPlanDetailModalProps> = ({
  plan,
  onClose,
  onEdit,
  onOpenExecution,
  onOpenVerification
}) => {
  const statusInfo = STATUS_CONFIG[plan.status];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 print:m-0 print:border-none print:shadow-none">
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>{plan.unidade}</span>
              <span aria-hidden="true">·</span>
              <span>{plan.categoria}</span>
              <span aria-hidden="true">·</span>
              <span>Cadastrado em {formatDate(plan.createdAt)}</span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white tracking-tight">{plan.code}</h2>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
              >
                {statusInfo.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Imprimir Ficha 5W2H"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={() => onEdit(plan)}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Editar"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Identificação Geral */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Unidade
              </span>
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-4 h-4 text-emerald-700" />
                {plan.unidade}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Categoria da Ação
              </span>
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <Tag className="w-4 h-4 text-emerald-700" />
                {plan.categoria}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Referência Normativa
              </span>
              <span className="text-sm font-semibold text-slate-900 flex items-center gap-1.5 mt-0.5">
                <FileText className="w-4 h-4 text-emerald-700" />
                {plan.referenciaNormativa || 'Não especificada'}
              </span>
            </div>
          </div>

          {/* Matriz 5W2H Visual Grid */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-700" />
              Matriz 5W2H
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* WHAT */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
                  <span className="px-2 py-0.5 bg-emerald-100 rounded text-emerald-900 font-mono">
                    WHAT
                  </span>
                  <span>O que vai ser feito?</span>
                </div>
                <p className="text-sm text-slate-800 font-medium leading-relaxed mt-2">
                  {plan.what}
                </p>
              </div>

              {/* WHY */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
                  <span className="px-2 py-0.5 bg-emerald-100 rounded text-emerald-900 font-mono">
                    WHY
                  </span>
                  <span>Por quê será feito?</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed mt-2">{plan.why}</p>
              </div>

              {/* WHO */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
                  <span className="px-2 py-0.5 bg-emerald-100 rounded text-emerald-900 font-mono">
                    WHO
                  </span>
                  <span>Quem irá fazer?</span>
                </div>
                <p className="text-sm text-slate-900 font-semibold mt-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-500" />
                  {plan.who}
                </p>
              </div>

              {/* WHERE */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
                  <span className="px-2 py-0.5 bg-emerald-100 rounded text-emerald-900 font-mono">
                    WHERE
                  </span>
                  <span>Onde será feito?</span>
                </div>
                <p className="text-sm text-slate-800 font-medium mt-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  {plan.where}
                </p>
              </div>

              {/* HOW */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white md:col-span-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
                  <span className="px-2 py-0.5 bg-emerald-100 rounded text-emerald-900 font-mono">
                    HOW
                  </span>
                  <span>Como será feito? (Método)</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed mt-2">{plan.how}</p>
              </div>

              {/* WHEN */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
                  <span className="px-2 py-0.5 bg-emerald-100 rounded text-emerald-900 font-mono">
                    WHEN
                  </span>
                  <span>Qual o prazo? (Data)</span>
                </div>
                <p className="text-sm text-slate-900 font-bold tabular-nums mt-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  {formatDate(plan.when)}
                </p>
              </div>

              {/* HOW MUCH */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 mb-1">
                  <span className="px-2 py-0.5 bg-emerald-100 rounded text-emerald-900 font-mono">
                    HOW MUCH
                  </span>
                  <span>Quanto vai custar?</span>
                </div>
                <p className="text-base text-slate-900 font-bold tabular-nums font-mono mt-2">
                  {formatCurrency(plan.howMuch)}
                </p>
              </div>
            </div>
          </div>

          {/* Relato de Execução */}
          {plan.executionNotes && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-700" />
                  Evidência de Execução Operacional
                </span>
                <span className="text-xs text-blue-700 tabular-nums">
                  Concluído em: {formatDate(plan.executionCompletedAt)}
                </span>
              </div>
              <p className="text-sm text-blue-900 leading-relaxed">{plan.executionNotes}</p>
            </div>
          )}

          {/* Verificação de Eficácia Section */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-700" />
                <h4 className="text-sm font-bold text-slate-900">
                  Verificação de Eficácia (Fluxo de Aprovação)
                </h4>
              </div>

              {plan.verificationResult ? (
                <span
                  className={`px-3 py-1 text-xs font-bold rounded-full flex items-center gap-1.5 ${
                    plan.verificationResult === 'eficaz'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-rose-100 text-rose-900'
                  }`}
                >
                  {plan.verificationResult === 'eficaz' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Eficaz ({plan.verificationScore ?? 100}%)
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      Ineficaz ({plan.verificationScore ?? 0}%)
                    </>
                  )}
                </span>
              ) : (
                <span className="text-xs text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full font-semibold">
                  Aguardando Checagem
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
              <div>
                <span className="font-semibold text-slate-500 block mb-0.5">
                  Responsável pela Checagem se a Ação foi Efetiva:
                </span>
                <span className="text-sm font-bold text-slate-900 block">
                  {plan.efficacyVerifier}
                </span>
              </div>

              {plan.efficacyTargetDate && (
                <div>
                  <span className="font-semibold text-slate-500 block mb-0.5">
                    Data Prevista de Checagem:
                  </span>
                  <span className="text-sm font-semibold text-slate-900 tabular-nums block">
                    {formatDate(plan.efficacyTargetDate)}
                  </span>
                </div>
              )}

              {plan.efficacyCriteria && (
                <div className="sm:col-span-2">
                  <span className="font-semibold text-slate-500 block mb-0.5">
                    Critério de Aceite / Evidência:
                  </span>
                  <span className="text-xs font-medium text-slate-800 block">
                    {plan.efficacyCriteria}
                  </span>
                </div>
              )}
            </div>

            {/* Resultado da verificação se já feita */}
            {plan.verifiedAt && (
              <div className="pt-3 border-t border-slate-200 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-600">
                  <span>
                    Auditado por: <strong>{plan.verifiedBy}</strong>
                  </span>
                  <span className="tabular-nums">
                    Data da Auditoria: <strong>{formatDate(plan.verifiedAt)}</strong>
                  </span>
                </div>
                {plan.verificationNotes && (
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-800 text-sm">
                    <span className="text-xs font-bold text-slate-500 block mb-1">
                      Parecer Técnico da Verificação:
                    </span>
                    <p className="leading-relaxed">{plan.verificationNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Fechar
          </button>

          <div className="flex items-center gap-2">
            {(plan.status === 'planejado' || plan.status === 'em_andamento') && (
              <button
                onClick={() => {
                  onClose();
                  onOpenExecution(plan);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer"
              >
                Concluir Execução
              </button>
            )}

            {plan.status === 'aguardando_verificacao' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenVerification(plan);
                }}
                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verificar Eficácia Agora</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
