import React, { useState, useMemo } from 'react';
import {
  ActionPlan,
  UNIT_OPTIONS,
  CATEGORY_OPTIONS
} from '../types/actionPlan';
import {
  getTodayString,
  isActionOverdue,
  isActionDueWithin30Days,
  isActionCompleted,
  resetToDefaults
} from '../utils/storage';
import { ActionPlanTable } from './ActionPlanTable';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  ListTodo,
  RotateCcw,
  Building2,
  Layers,
  UserCheck2,
  PieChart,
  BarChart3,
  Calendar,
  Sparkles
} from 'lucide-react';

interface DashboardStatsProps {
  plans: ActionPlan[];
  onResetDefaults: () => void;
  onNewPlan: () => void;
  onViewDetail: (plan: ActionPlan) => void;
  onEdit: (plan: ActionPlan) => void;
  onDelete: (id: string) => void;
  onOpenExecution: (plan: ActionPlan) => void;
  onOpenVerification: (plan: ActionPlan) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  plans,
  onResetDefaults,
  onNewPlan,
  onViewDetail,
  onEdit,
  onDelete,
  onOpenExecution,
  onOpenVerification
}) => {
  const today = getTodayString();

  // Active filter to pass down to the integrated table
  const [tableDeadlineFilter, setTableDeadlineFilter] = useState<'all' | 'atrasado' | 'proximo_30d'>('all');
  const [tableUnitFilter, setTableUnitFilter] = useState<string>('all');
  const [tableCategoryFilter, setTableCategoryFilter] = useState<string>('all');
  const [tableStatusFilter, setTableStatusFilter] = useState<string>('all');

  // 1. Calculate KPI counts
  const totalPlans = plans.length;

  const overduePlans = useMemo(
    () => plans.filter((p) => isActionOverdue(p, today)),
    [plans, today]
  );

  const dueSoon30Plans = useMemo(
    () => plans.filter((p) => isActionDueWithin30Days(p, today)),
    [plans, today]
  );

  const completedPlans = useMemo(
    () => plans.filter((p) => isActionCompleted(p)),
    [plans]
  );

  const inProgressOnTimePlans = useMemo(
    () =>
      plans.filter(
        (p) =>
          !isActionCompleted(p) &&
          !isActionOverdue(p, today) &&
          !isActionDueWithin30Days(p, today)
      ),
    [plans, today]
  );

  // 2. Gráfico de Status: Concluído, Em Andamento, Atrasado (com zero se não houver, ordenado maior -> menor)
  const statusChartData = useMemo(() => {
    // Concluído: todas finalizadas / verificadas / aguardando
    const countConcluido = plans.filter((p) => isActionCompleted(p)).length;
    // Atrasado: não concluídas com prazo anterior a hoje
    const countAtrasado = plans.filter((p) => isActionOverdue(p, today)).length;
    // Em Andamento: não concluídas e com prazo >= hoje
    const countEmAndamento = plans.filter(
      (p) => !isActionCompleted(p) && !isActionOverdue(p, today)
    ).length;

    const items = [
      {
        label: 'Concluído',
        count: countConcluido,
        colorClass: 'bg-emerald-600',
        textColor: 'text-emerald-700',
        bgLight: 'bg-emerald-50',
        filterStatus: 'eficaz' // or trigger clear filter
      },
      {
        label: 'Em Andamento',
        count: countEmAndamento,
        colorClass: 'bg-blue-600',
        textColor: 'text-blue-700',
        bgLight: 'bg-blue-50',
        filterStatus: 'em_andamento'
      },
      {
        label: 'Atrasado',
        count: countAtrasado,
        colorClass: 'bg-rose-600',
        textColor: 'text-rose-700',
        bgLight: 'bg-rose-50',
        filterDeadline: 'atrasado'
      }
    ];

    // Ordenar estritamente do maior para o menor!
    return items.sort((a, b) => b.count - a.count);
  }, [plans, today]);

  // 3. Gráfico de Planos por Unidade (ordenado maior -> menor)
  const unitChartData = useMemo(() => {
    const items = UNIT_OPTIONS.map((unit) => {
      const count = plans.filter((p) => p.unidade === unit).length;
      return {
        unit,
        count
      };
    });

    // Ordenar estritamente do maior para o menor!
    return items.sort((a, b) => b.count - a.count);
  }, [plans]);

  // 4. Gráfico de Planos por Origem / Categoria (ordenado maior -> menor)
  const categoryChartData = useMemo(() => {
    const items = CATEGORY_OPTIONS.map((cat) => {
      const count = plans.filter((p) => p.categoria === cat).length;
      return {
        category: cat,
        count
      };
    });

    // Ordenar estritamente do maior para o menor!
    return items.sort((a, b) => b.count - a.count);
  }, [plans]);

  // 5. Gráfico de Responsáveis: SOMENTE ações em andamento e atrasadas (ordenado maior -> menor)
  const responsaveisChartData = useMemo(() => {
    // Filtrar apenas ações que NÃO estão concluídas (ou seja, em andamento ou atrasadas)
    const activePlans = plans.filter((p) => !isActionCompleted(p));

    // Agrupar por responsável
    const countMap: Record<string, { total: number; atrasadas: number; emAndamento: number }> = {};

    activePlans.forEach((plan) => {
      const resp = plan.who.trim();
      if (!countMap[resp]) {
        countMap[resp] = { total: 0, atrasadas: 0, emAndamento: 0 };
      }
      countMap[resp].total += 1;
      if (isActionOverdue(plan, today)) {
        countMap[resp].atrasadas += 1;
      } else {
        countMap[resp].emAndamento += 1;
      }
    });

    const items = Object.entries(countMap).map(([responsavel, stats]) => ({
      responsavel,
      count: stats.total,
      atrasadas: stats.atrasadas,
      emAndamento: stats.emAndamento
    }));

    // Ordenar estritamente do maior para o menor!
    return items.sort((a, b) => b.count - a.count);
  }, [plans, today]);

  // Maximum values for relative percentage bars
  const maxStatusCount = Math.max(...statusChartData.map((d) => d.count), 1);
  const maxUnitCount = Math.max(...unitChartData.map((d) => d.count), 1);
  const maxCategoryCount = Math.max(...categoryChartData.map((d) => d.count), 1);
  const maxResponsavelCount = Math.max(
    ...responsaveisChartData.map((d) => d.count),
    1
  );

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions Strip */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Visão Gerencial</span>
            <span aria-hidden="true">·</span>
            <span>Painel de Desempenho 5W2H</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Indicadores e Gestão de Planos de Ação
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Acompanhe em tempo real o status de execução, prazos críticos de vencimento, distribuição por unidade, origem e responsáveis.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (window.confirm('Deseja restaurar os planos de ação de demonstração padrão?')) {
                onResetDefaults();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            title="Restaurar dados de exemplo originais"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Dados Demo</span>
          </button>

          <button
            onClick={onNewPlan}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <span>+ Novo Plano</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Indicativos de Prazos e Status Geral */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total de Planos */}
        <div
          onClick={() => {
            setTableDeadlineFilter('all');
            setTableStatusFilter('all');
            setTableUnitFilter('all');
            setTableCategoryFilter('all');
          }}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-slate-400 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Total de Planos Cadastrados
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono tabular-nums text-slate-900 mt-2">
            {totalPlans}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Clique para ver todos na lista abaixo
          </p>
        </div>

        {/* Card 2: Ações Atrasadas (Indicativo Crítico em Vermelho) */}
        <div
          onClick={() => {
            setTableDeadlineFilter('atrasado');
            setTableStatusFilter('all');
          }}
          className={`p-5 rounded-xl border shadow-xs cursor-pointer transition-all group ${
            overduePlans.length > 0
              ? 'bg-rose-50/70 border-rose-300 hover:border-rose-500 hover:bg-rose-50'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Ações Atrasadas
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 font-mono">
              Prazo Expirado
            </span>
          </div>
          <div className="text-3xl font-bold font-mono tabular-nums text-rose-700 mt-2">
            {overduePlans.length}
          </div>
          <p className="text-[11px] text-rose-800 font-medium mt-1">
            {overduePlans.length > 0
              ? 'Requer atenção imediata dos responsáveis'
              : 'Nenhuma ação atrasada no momento!'}
          </p>
        </div>

        {/* Card 3: Vencem em até 30 dias (Indicativo Preventivo em Âmbar) */}
        <div
          onClick={() => {
            setTableDeadlineFilter('proximo_30d');
            setTableStatusFilter('all');
          }}
          className={`p-5 rounded-xl border shadow-xs cursor-pointer transition-all group ${
            dueSoon30Plans.length > 0
              ? 'bg-amber-50/70 border-amber-300 hover:border-amber-500 hover:bg-amber-50'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-600" />
              Vencem em até 30 dias
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-mono">
              Atenção
            </span>
          </div>
          <div className="text-3xl font-bold font-mono tabular-nums text-amber-800 mt-2">
            {dueSoon30Plans.length}
          </div>
          <p className="text-[11px] text-amber-900 font-medium mt-1">
            Ações com prazo de término no próximo mês
          </p>
        </div>

        {/* Card 4: Ações Concluídas */}
        <div
          onClick={() => {
            setTableStatusFilter('eficaz');
            setTableDeadlineFilter('all');
          }}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-emerald-400 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Ações Concluídas
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-mono tabular-nums text-emerald-700 mt-2">
            {completedPlans.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Verificadas ou aguardando checagem
          </p>
        </div>
      </div>

      {/* Grid com os 4 Gráficos (Dispostos do maior para o menor) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRÁFICO 1: Status das Ações (Concluído, Em Andamento, Atrasado) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Gráfico de Status das Ações
              </h3>
            </div>

            <div className="space-y-4">
              {statusChartData.map((item) => {
                const percent = totalPlans > 0 ? Math.round((item.count / totalPlans) * 100) : 0;
                const relativeWidth = maxStatusCount > 0 ? (item.count / maxStatusCount) * 100 : 0;

                return (
                  <div
                    key={item.label}
                    onClick={() => {
                      if (item.label === 'Atrasado') {
                        setTableDeadlineFilter('atrasado');
                        setTableStatusFilter('all');
                      } else if (item.label === 'Em Andamento') {
                        setTableStatusFilter('em_andamento');
                        setTableDeadlineFilter('all');
                      } else {
                        setTableStatusFilter('eficaz');
                        setTableDeadlineFilter('all');
                      }
                    }}
                    className="group cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${item.colorClass}`}
                        />
                        <span className="text-slate-900">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-400 tabular-nums text-[11px]">
                          {percent}% do total
                        </span>
                        <span
                          className={`font-mono font-bold text-sm tabular-nums ${item.textColor}`}
                        >
                          {item.count}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.colorClass} rounded-full transition-all duration-500`}
                        style={{ width: `${relativeWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Total avaliado: <strong>{totalPlans}</strong> planos</span>
            <span className="text-slate-400">Clique na barra para filtrar a lista</span>
          </div>
        </div>

        {/* GRÁFICO 2: Planos por Unidade */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Gráfico de Planos por Unidade
              </h3>
            </div>

            <div className="space-y-3.5">
              {unitChartData.map((item) => {
                const percent = totalPlans > 0 ? Math.round((item.count / totalPlans) * 100) : 0;
                const relativeWidth = maxUnitCount > 0 ? (item.count / maxUnitCount) * 100 : 0;

                return (
                  <div
                    key={item.unit}
                    onClick={() => setTableUnitFilter(item.unit)}
                    className="group cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-800">{item.unit}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-400 tabular-nums text-[11px]">
                          {percent}%
                        </span>
                        <span className="font-mono font-bold text-slate-900 tabular-nums">
                          {item.count}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-700 rounded-full transition-all duration-500"
                        style={{ width: `${relativeWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>4 Unidades cadastradas</span>
            <span className="text-slate-400">Clique na unidade para filtrar a lista</span>
          </div>
        </div>

        {/* GRÁFICO 3: Planos por Origem (Categoria) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Gráfico de Planos por Origem (Categoria)
              </h3>
            </div>

            <div className="space-y-3">
              {categoryChartData.map((item) => {
                const percent = totalPlans > 0 ? Math.round((item.count / totalPlans) * 100) : 0;
                const relativeWidth = maxCategoryCount > 0 ? (item.count / maxCategoryCount) * 100 : 0;

                return (
                  <div
                    key={item.category}
                    onClick={() => setTableCategoryFilter(item.category)}
                    className="group cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-800 truncate max-w-[240px]" title={item.category}>
                        {item.category}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-slate-400 tabular-nums text-[11px]">
                          {percent}%
                        </span>
                        <span className="font-mono font-bold text-slate-900 tabular-nums">
                          {item.count}
                        </span>
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-800 rounded-full transition-all duration-500"
                        style={{ width: `${relativeWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>6 Categorias corporativas</span>
            <span className="text-slate-400">Clique na categoria para filtrar a lista</span>
          </div>
        </div>

        {/* GRÁFICO 4: Responsáveis das Ações (Apenas Em Andamento e Atrasado) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <UserCheck2 className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Gráfico de Responsáveis (Ativas & Atrasadas)
              </h3>
            </div>

            {responsaveisChartData.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Nenhum responsável com ações pendentes ou atrasadas no momento.
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {responsaveisChartData.map((item) => {
                  const relativeWidth =
                    maxResponsavelCount > 0 ? (item.count / maxResponsavelCount) * 100 : 0;

                  return (
                    <div
                      key={item.responsavel}
                      className="group p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-800 truncate max-w-[220px]" title={item.responsavel}>
                          {item.responsavel}
                        </span>
                        <div className="flex items-center gap-2">
                          {item.atrasadas > 0 && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-rose-100 text-rose-800 rounded font-bold">
                              {item.atrasadas} atrasada{item.atrasadas > 1 ? 's' : ''}
                            </span>
                          )}
                          <span className="font-mono font-bold text-slate-900 tabular-nums">
                            {item.count} {item.count > 1 ? 'ações' : 'ação'}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                        {/* Portion of overdue in red */}
                        {item.atrasadas > 0 && (
                          <div
                            className="h-full bg-rose-600 transition-all duration-500"
                            style={{
                              width: `${(item.atrasadas / maxResponsavelCount) * 100}%`
                            }}
                            title={`${item.atrasadas} atrasadas`}
                          />
                        )}
                        {/* Portion of on time in blue */}
                        {item.emAndamento > 0 && (
                          <div
                            className="h-full bg-blue-600 transition-all duration-500"
                            style={{
                              width: `${(item.emAndamento / maxResponsavelCount) * 100}%`
                            }}
                            title={`${item.emAndamento} em andamento no prazo`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              <strong>{responsaveisChartData.length}</strong> responsáveis com planos ativos
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-rose-600" />
              <span>Atrasadas</span>
              <span className="inline-block w-2 h-2 rounded-full bg-blue-600 ml-2" />
              <span>No prazo</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO DA LISTA DE PLANOS DENTRO DE INDICADORES */}
      <div className="pt-4 border-t border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900">
              Lista Integrada de Planos de Ação 5W2H
            </h2>
            <p className="text-xs text-slate-500">
              Consulte, filtre e gerencie todos os planos cadastrados diretamente pelo painel de indicadores.
            </p>
          </div>
        </div>

        {/* ActionPlanTable Component Embedded */}
        <ActionPlanTable
          plans={plans}
          onViewDetail={onViewDetail}
          onEdit={onEdit}
          onDelete={onDelete}
          onOpenExecution={onOpenExecution}
          onOpenVerification={onOpenVerification}
          onNewPlan={onNewPlan}
          initialDeadlineFilter={tableDeadlineFilter}
          initialUnitFilter={tableUnitFilter}
          initialCategoryFilter={tableCategoryFilter}
          initialStatusFilter={tableStatusFilter}
        />
      </div>
    </div>
  );
};
