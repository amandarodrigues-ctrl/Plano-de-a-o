import React, { useState, useMemo, useEffect } from 'react';
import {
  ActionPlan,
  UNIT_OPTIONS,
  CATEGORY_OPTIONS,
  STATUS_CONFIG
} from '../types/actionPlan';
import {
  formatDate,
  formatCurrency,
  isActionOverdue,
  isActionDueWithin30Days,
  getTodayString
} from '../utils/storage';
import {
  Search,
  Download,
  Eye,
  Edit,
  ShieldCheck,
  CheckCircle,
  Trash2,
  Calendar,
  AlertTriangle,
  Clock,
  ArrowUpDown
} from 'lucide-react';

interface ActionPlanTableProps {
  plans: ActionPlan[];
  onViewDetail: (plan: ActionPlan) => void;
  onEdit: (plan: ActionPlan) => void;
  onDelete: (id: string) => void;
  onOpenExecution: (plan: ActionPlan) => void;
  onOpenVerification: (plan: ActionPlan) => void;
  onNewPlan: () => void;
  initialDeadlineFilter?: 'all' | 'atrasado' | 'proximo_30d';
  initialUnitFilter?: string;
  initialCategoryFilter?: string;
  initialStatusFilter?: string;
}

export const ActionPlanTable: React.FC<ActionPlanTableProps> = ({
  plans,
  onViewDetail,
  onEdit,
  onDelete,
  onOpenExecution,
  onOpenVerification,
  onNewPlan,
  initialDeadlineFilter = 'all',
  initialUnitFilter = 'all',
  initialCategoryFilter = 'all',
  initialStatusFilter = 'all'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>(initialUnitFilter);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryFilter);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatusFilter);
  const [deadlineFilter, setDeadlineFilter] = useState<'all' | 'atrasado' | 'proximo_30d'>(initialDeadlineFilter);
  const [sortField, setSortField] = useState<'code' | 'when' | 'howMuch' | 'unidade'>('when');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Sync if external props change
  useEffect(() => {
    if (initialDeadlineFilter) setDeadlineFilter(initialDeadlineFilter);
  }, [initialDeadlineFilter]);

  useEffect(() => {
    if (initialUnitFilter) setSelectedUnit(initialUnitFilter);
  }, [initialUnitFilter]);

  useEffect(() => {
    if (initialCategoryFilter) setSelectedCategory(initialCategoryFilter);
  }, [initialCategoryFilter]);

  useEffect(() => {
    if (initialStatusFilter) setSelectedStatus(initialStatusFilter);
  }, [initialStatusFilter]);

  const today = getTodayString();

  // Filtered & Sorted
  const filteredPlans = useMemo(() => {
    return plans
      .filter((plan) => {
        const matchSearch =
          plan.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.what.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.who.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.efficacyVerifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.referenciaNormativa.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plan.where.toLowerCase().includes(searchTerm.toLowerCase());

        const matchUnit = selectedUnit === 'all' || plan.unidade === selectedUnit;
        const matchCat = selectedCategory === 'all' || plan.categoria === selectedCategory;
        const matchStatus = selectedStatus === 'all' || plan.status === selectedStatus;

        let matchDeadline = true;
        if (deadlineFilter === 'atrasado') {
          matchDeadline = isActionOverdue(plan, today);
        } else if (deadlineFilter === 'proximo_30d') {
          matchDeadline = isActionDueWithin30Days(plan, today);
        }

        return matchSearch && matchUnit && matchCat && matchStatus && matchDeadline;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];
        if (typeof valA === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [
    plans,
    searchTerm,
    selectedUnit,
    selectedCategory,
    selectedStatus,
    deadlineFilter,
    sortField,
    sortAsc,
    today
  ]);

  const toggleSort = (field: 'code' | 'when' | 'howMuch' | 'unidade') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Código',
      'Unidade',
      'Categoria',
      'Referência Normativa',
      'O Que (What)',
      'Por Quê (Why)',
      'Quem (Who)',
      'Como (How)',
      'Onde (Where)',
      'Quando (When)',
      'Custo Estimado (R$)',
      'Responsável Verificação',
      'Status',
      'Situação do Prazo'
    ];

    const rows = filteredPlans.map((p) => {
      const isOverdue = isActionOverdue(p, today);
      const isDueSoon = isActionDueWithin30Days(p, today);
      const prazoStatus = isOverdue
        ? 'Atrasado'
        : isDueSoon
        ? 'Vence em até 30 dias'
        : 'No Prazo';

      return [
        `"${p.code}"`,
        `"${p.unidade}"`,
        `"${p.categoria}"`,
        `"${p.referenciaNormativa.replace(/"/g, '""')}"`,
        `"${p.what.replace(/"/g, '""')}"`,
        `"${p.why.replace(/"/g, '""')}"`,
        `"${p.who.replace(/"/g, '""')}"`,
        `"${p.how.replace(/"/g, '""')}"`,
        `"${p.where.replace(/"/g, '""')}"`,
        `"${p.when}"`,
        p.howMuch,
        `"${p.efficacyVerifier}"`,
        `"${p.status}"`,
        `"${prazoStatus}"`
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `planos_de_acao_5w2h_${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por código, ação, executor, auditor ou norma..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              title="Exportar dados para planilha Excel / CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={onNewPlan}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              <span>+ Novo Plano</span>
            </button>
          </div>
        </div>

        {/* Dropdowns / Segmented Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
          {/* Prazo Alert Filter */}
          <div>
            <label htmlFor="filter-prazo" className="block font-semibold text-slate-700 mb-1">
              Filtro de Prazo:
            </label>
            <select
              id="filter-prazo"
              value={deadlineFilter}
              onChange={(e) => setDeadlineFilter(e.target.value as any)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Todos os Prazos</option>
              <option value="atrasado">⚠️ Somente Ações Atrasadas</option>
              <option value="proximo_30d">⏳ Vencem em até 30 dias</option>
            </select>
          </div>

          {/* Unidade */}
          <div>
            <label htmlFor="filter-unidade" className="block font-semibold text-slate-700 mb-1">
              Unidade:
            </label>
            <select
              id="filter-unidade"
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Todas as Unidades</option>
              {UNIT_OPTIONS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Categoria */}
          <div>
            <label htmlFor="filter-categoria" className="block font-semibold text-slate-700 mb-1">
              Categoria da Ação:
            </label>
            <select
              id="filter-categoria"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Todas as Categorias</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="filter-status" className="block font-semibold text-slate-700 mb-1">
              Status do Fluxo:
            </label>
            <select
              id="filter-status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Todos os Status</option>
              <option value="planejado">Planejado</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="aguardando_verificacao">Aguardando Verificação</option>
              <option value="eficaz">Eficaz (Aprovado)</option>
              <option value="ineficaz">Ineficaz (Reprovado)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips indicator */}
        {(deadlineFilter !== 'all' || selectedUnit !== 'all' || selectedCategory !== 'all' || selectedStatus !== 'all' || searchTerm) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-slate-500">
            <span>Filtros ativos:</span>
            {deadlineFilter === 'atrasado' && (
              <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                Atrasadas
                <button onClick={() => setDeadlineFilter('all')} className="hover:text-rose-950 font-bold ml-1">×</button>
              </span>
            )}
            {deadlineFilter === 'proximo_30d' && (
              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                Vencem em até 30 dias
                <button onClick={() => setDeadlineFilter('all')} className="hover:text-amber-950 font-bold ml-1">×</button>
              </span>
            )}
            {selectedUnit !== 'all' && (
              <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                Unidade: {selectedUnit}
                <button onClick={() => setSelectedUnit('all')} className="hover:text-slate-950 font-bold ml-1">×</button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                Categoria: {selectedCategory}
                <button onClick={() => setSelectedCategory('all')} className="hover:text-slate-950 font-bold ml-1">×</button>
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                Status: {selectedStatus}
                <button onClick={() => setSelectedStatus('all')} className="hover:text-slate-950 font-bold ml-1">×</button>
              </span>
            )}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedUnit('all');
                setSelectedCategory('all');
                setSelectedStatus('all');
                setDeadlineFilter('all');
              }}
              className="text-emerald-700 hover:underline font-semibold ml-auto cursor-pointer"
            >
              Limpar todos
            </button>
          </div>
        )}
      </div>

      {/* High-density Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th
                  onClick={() => toggleSort('code')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Código</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('unidade')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Unidade & Categoria</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 min-w-[280px]">
                  <span>Plano 5W2H (O que / Quem / Onde)</span>
                </th>
                <th
                  onClick={() => toggleSort('when')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Prazo (When)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 whitespace-nowrap">
                  <span>Verificação de Eficácia</span>
                </th>
                <th className="py-3 px-4 whitespace-nowrap">
                  <span>Status</span>
                </th>
                <th className="py-3 px-4 text-right whitespace-nowrap">
                  <span>Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <p className="text-sm font-medium">Nenhum plano de ação encontrado com os filtros selecionados.</p>
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedUnit('all');
                        setSelectedCategory('all');
                        setSelectedStatus('all');
                        setDeadlineFilter('all');
                      }}
                      className="mt-2 text-xs text-emerald-700 hover:underline font-semibold cursor-pointer"
                    >
                      Limpar todos os filtros
                    </button>
                  </td>
                </tr>
              ) : (
                filteredPlans.map((plan) => {
                  const statusInfo = STATUS_CONFIG[plan.status];
                  const isAwaitingVerification = plan.status === 'aguardando_verificacao';
                  const isOverdue = isActionOverdue(plan, today);
                  const isDueSoon = isActionDueWithin30Days(plan, today);

                  return (
                    <tr
                      key={plan.id}
                      className={`hover:bg-slate-50/80 transition-colors group cursor-pointer ${
                        isOverdue ? 'bg-rose-50/30' : ''
                      }`}
                      onClick={() => onViewDetail(plan)}
                    >
                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {isOverdue && (
                            <span title="Ação atrasada!">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            </span>
                          )}
                          <span>{plan.code}</span>
                        </div>
                      </td>

                      {/* Unidade & Categoria */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{plan.unidade}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                          {plan.categoria}
                        </div>
                        {plan.referenciaNormativa ? (
                          <div className="text-[10px] text-slate-400 font-mono truncate max-w-[180px]">
                            Ref: {plan.referenciaNormativa}
                          </div>
                        ) : null}
                      </td>

                      {/* 5W2H What & Who */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900 line-clamp-2 leading-relaxed">
                          {plan.what}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                          <span className="font-semibold text-slate-700">{plan.who}</span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate max-w-[150px]">{plan.where}</span>
                        </div>
                      </td>

                      {/* Prazo */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono tabular-nums font-semibold text-slate-800">
                          {formatDate(plan.when)}
                        </div>
                        {isOverdue ? (
                          <div className="text-[10px] text-rose-700 font-bold flex items-center gap-1 mt-0.5">
                            <span>Atrasado</span>
                          </div>
                        ) : isDueSoon ? (
                          <div className="text-[10px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>Vence em breve</span>
                          </div>
                        ) : null}
                      </td>

                      {/* Verificação de Eficácia */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-900 font-medium truncate max-w-[170px]">
                          {plan.efficacyVerifier}
                        </div>
                        {plan.verifiedAt ? (
                          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                            <span>{plan.verificationResult === 'eficaz' ? 'Eficaz' : 'Ineficaz'}</span>
                            <span className="font-mono tabular-nums">({plan.verificationScore ?? 100}%)</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400">
                            Checador designado
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 text-[11px] rounded font-semibold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Ações */}
                      <td
                        className="py-3.5 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          {/* Botão de Verificação direta se estiver aguardando */}
                          {isAwaitingVerification && (
                            <button
                              onClick={() => onOpenVerification(plan)}
                              className="px-2 py-1 text-[11px] font-bold text-white bg-amber-600 hover:bg-amber-700 rounded transition-colors flex items-center gap-1 cursor-pointer"
                              title="Realizar Verificação de Eficácia"
                            >
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>Verificar</span>
                            </button>
                          )}

                          {/* Se planejado ou em andamento, botão de concluir execução */}
                          {(plan.status === 'planejado' || plan.status === 'em_andamento') && (
                            <button
                              onClick={() => onOpenExecution(plan)}
                              className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                              title="Marcar Execução como Concluída"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => onViewDetail(plan)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                            title="Visualizar Detalhes 5W2H"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onEdit(plan)}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                            title="Editar Plano"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onDelete(plan.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                            title="Excluir Plano"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Exibindo <strong>{filteredPlans.length}</strong> de <strong>{plans.length}</strong> planos de ação
          </span>
          <span className="font-mono tabular-nums">
            {plans.filter((p) => isActionOverdue(p, today)).length} atrasadas ·{' '}
            {plans.filter((p) => isActionDueWithin30Days(p, today)).length} vencem em 30d
          </span>
        </div>
      </div>
    </div>
  );
};
