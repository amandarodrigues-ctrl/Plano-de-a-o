import React, { useState, useEffect } from 'react';
import {
  UnitType,
  CategoryType,
  UNIT_OPTIONS,
  CATEGORY_OPTIONS,
  ActionPlan
} from '../types/actionPlan';
import {
  Save,
  Sparkles,
  Building2,
  FileText,
  Target,
  HelpCircle,
  User,
  Wrench,
  MapPin,
  Calendar,
  DollarSign,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ActionPlanFormProps {
  initialPlan?: ActionPlan | null;
  onSave: (planData: Omit<ActionPlan, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'status'> & { id?: string }) => void;
  onCancel: () => void;
}

export const ActionPlanForm: React.FC<ActionPlanFormProps> = ({
  initialPlan,
  onSave,
  onCancel
}) => {
  // Form fields
  const [unidade, setUnidade] = useState<UnitType>('Indústria');
  const [categoria, setCategoria] = useState<CategoryType>('Patrulha de qualidade e segurança de alimentos');
  const [referenciaNormativa, setReferenciaNormativa] = useState('');

  // 5W2H
  const [what, setWhat] = useState('');
  const [why, setWhy] = useState('');
  const [who, setWho] = useState('');
  const [how, setHow] = useState('');
  const [where, setWhere] = useState('');
  const [when, setWhen] = useState('');
  const [howMuch, setHowMuch] = useState<string>('0,00');

  // Verificação de Eficácia: Apenas o responsável pela checagem se a ação foi efetiva
  const [efficacyVerifier, setEfficacyVerifier] = useState('');

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (initialPlan) {
      setUnidade(initialPlan.unidade);
      setCategoria(initialPlan.categoria);
      setReferenciaNormativa(initialPlan.referenciaNormativa || '');
      setWhat(initialPlan.what);
      setWhy(initialPlan.why);
      setWho(initialPlan.who);
      setHow(initialPlan.how);
      setWhere(initialPlan.where);
      setWhen(initialPlan.when);
      setHowMuch(
        initialPlan.howMuch.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })
      );
      setEfficacyVerifier(initialPlan.efficacyVerifier);
    } else {
      // Default initial when date (today + 15 days)
      const d = new Date();
      d.setDate(d.getDate() + 15);
      setWhen(d.toISOString().split('T')[0]);
    }
  }, [initialPlan]);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value.replace(/\D/g, '');
    if (!cleanValue) {
      setHowMuch('0,00');
      return;
    }
    const numValue = parseFloat(cleanValue) / 100;
    setHowMuch(
      numValue.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    );
  };

  const parseCurrencyNumber = (val: string): number => {
    const clean = val.replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleFillExample = (type: 'alimentos' | '5s' | 'ambiental' | 'seguranca') => {
    if (type === 'alimentos') {
      setUnidade('Indústria');
      setCategoria('Patrulha de qualidade e segurança de alimentos');
      setReferenciaNormativa('FSSC 22000 - Cláusula 8.2 (Programas de Pré-requisitos)');
      setWhat('Instalação de barreira sanitária com sensor automático e lavador de botas na entrada do envase');
      setWhy('Evitar contaminação cruzada biológica detectada na patrulha de higiene');
      setWho('Carlos Eduardo Mendes (Engenharia de Processos)');
      setHow('Aquisição de equipamento em aço inox 304, tubulação de dosagem de sanitizante e treinamento com os operadores');
      setWhere('Entrada principal da Linha de Envase 2 - Refino');
      const d = new Date();
      d.setDate(d.getDate() + 20);
      setWhen(d.toISOString().split('T')[0]);
      setHowMuch('18.500,00');
      setEfficacyVerifier('Mariana Duarte (Garantia da Qualidade)');
    } else if (type === '5s') {
      setUnidade('Assari');
      setCategoria('Patrulha de 5S');
      setReferenciaNormativa('Procedimento 5S Corporativo - Senso de Ordenação (Seiton)');
      setWhat('Padronização de bancadas, quadro sombra de ferramentas e sinalização de solo na oficina mecânica');
      setWhy('Reduzir desperdício de tempo na localização de ferramentas e evitar acidentes de trabalho');
      setWho('Thiago Valente (Encarregado de Oficina Assari)');
      setHow('Fabricação de quadros de ferramentas com silhuetas pintadas e demarcação viária amarela no piso');
      setWhere('Oficina de Manutenção Automotiva - Unidade Assari');
      const d = new Date();
      d.setDate(d.getDate() + 10);
      setWhen(d.toISOString().split('T')[0]);
      setHowMuch('4.200,00');
      setEfficacyVerifier('Juliana Paes (Comitê 5S Corporativo)');
    } else if (type === 'ambiental') {
      setUnidade('Agrícola');
      setCategoria('Patrulha de Meio Ambiente');
      setReferenciaNormativa('CONAMA 357 & Procedimento Ambiental PA-AMB-014');
      setWhat('Construção de bacia de contenção impermeabilizada no ponto de abastecimento de comboios');
      setWhy('Eliminar risco de vazamento acidental de óleo diesel para o solo e lençol freático');
      setWho('Roberto Albuquerque (Supervisor Agrícola)');
      setHow('Mão de obra de engenharia civil com aplicação de manta PEAD e piso de concreto armado impermeabilizado');
      setWhere('Ponto de Apoio Agrícola - Frente 2');
      const d = new Date();
      d.setDate(d.getDate() + 30);
      setWhen(d.toISOString().split('T')[0]);
      setHowMuch('28.000,00');
      setEfficacyVerifier('Fernanda Silveira (Coordenação de Meio Ambiente)');
    } else {
      setUnidade('Indústria');
      setCategoria('Auditorias');
      setReferenciaNormativa('NR-12 - Segurança no Trabalho em Máquinas e Equipamentos');
      setWhat('Instalação de proteções físicas intertravadas e chave de segurança na esteira de bagaço');
      setWhy('Adequação a apontamento crítico de auditoria de segurança do trabalho');
      setWho('Sérgio Ramos (Coordenação de Segurança do Trabalho)');
      setHow('Confecção de grades de proteção conforme NBR ISO 13857 com instalação elétrica de botão de emergência');
      setWhere('Moenda / Esteira Alimentadora 01');
      const d = new Date();
      d.setDate(d.getDate() + 15);
      setWhen(d.toISOString().split('T')[0]);
      setHowMuch('15.800,00');
      setEfficacyVerifier('Eng. Beatriz Rocha (Auditora Líder SST)');
    }
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Referência normativa é opcional conforme solicitação
    if (!what.trim()) {
      newErrors.what = 'Informe o que vai ser feito.';
    }

    if (!why.trim()) {
      newErrors.why = 'Informe o porquê será feito (justificativa ou causa raiz).';
    }

    if (!who.trim()) {
      newErrors.who = 'Informe quem irá executar a ação.';
    }

    if (!how.trim()) {
      newErrors.how = 'Descreva como será feito o plano.';
    }

    if (!where.trim()) {
      newErrors.where = 'Informe onde será executada a ação (local/setor).';
    }

    if (!when.trim()) {
      newErrors.when = 'Defina a data limite do prazo.';
    }

    if (!efficacyVerifier.trim()) {
      newErrors.efficacyVerifier = 'Defina o responsável pela checagem se a ação foi efetiva.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const numericCost = parseCurrencyNumber(howMuch);

    onSave({
      ...(initialPlan?.id ? { id: initialPlan.id } : {}),
      unidade,
      categoria,
      referenciaNormativa: referenciaNormativa.trim(),
      what: what.trim(),
      why: why.trim(),
      who: who.trim(),
      how: how.trim(),
      where: where.trim(),
      when: when.trim(),
      howMuch: numericCost,
      efficacyVerifier: efficacyVerifier.trim()
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Banner & Breadcrumb */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Planos de Ação</span>
            <span aria-hidden="true">·</span>
            <span>{initialPlan ? 'Edição' : 'Novo Cadastro'}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-emerald-700">Metodologia 5W2H</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {initialPlan ? `Editar Plano de Ação (${initialPlan.code})` : 'Cadastro de Plano de Ação'}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Preencha os dados de identificação, desdobre a metodologia 5W2H e defina o responsável pela verificação de eficácia.
          </p>
        </div>

        {/* Quick Fill presets */}
        {!initialPlan && (
          <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-2 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Preencher exemplo:
            </span>
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => handleFillExample('alimentos')}
                className="text-xs px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded border border-slate-200 cursor-pointer transition-colors"
                title="Patrulha de Alimentos na Indústria"
              >
                Segurança Alimentos
              </button>
              <button
                type="button"
                onClick={() => handleFillExample('5s')}
                className="text-xs px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded border border-slate-200 cursor-pointer transition-colors"
                title="Patrulha de 5S no Assari"
              >
                Patrulha 5S
              </button>
              <button
                type="button"
                onClick={() => handleFillExample('ambiental')}
                className="text-xs px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded border border-slate-200 cursor-pointer transition-colors"
                title="Patrulha de Meio Ambiente no Agrícola"
              >
                Meio Ambiente
              </button>
              <button
                type="button"
                onClick={() => handleFillExample('seguranca')}
                className="text-xs px-2 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded border border-slate-200 cursor-pointer transition-colors"
                title="Auditoria NR-12 na Indústria"
              >
                Auditoria NR-12
              </button>
            </div>
          </div>
        )}
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Plano de ação salvo com sucesso no sistema! Redirecionando...</span>
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-sm flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Por favor, revise os campos destacados abaixo:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs">
              {Object.values(errors).map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Bloco 1: Identificação & Classificação */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 pb-4 mb-5 border-b border-slate-100">
            <Building2 className="w-5 h-5 text-emerald-700" />
            <h2 className="text-base font-semibold text-slate-900">
              1. Classificação e Referência Normativa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Unidade */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                Unidade <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {UNIT_OPTIONS.map((u) => {
                  const isSelected = unidade === u;
                  return (
                    <button
                      type="button"
                      key={u}
                      onClick={() => setUnidade(u)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border text-center transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {u}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Selecione a unidade operacional ou administrativa responsável.
              </p>
            </div>

            {/* Categoria da Ação */}
            <div>
              <label htmlFor="categoria-select" className="block text-sm font-semibold text-slate-800 mb-2">
                Categoria da Ação <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="categoria-select"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as CategoryType)}
                  className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Origem do plano (auditorias, patrulhas temáticas ou reuniões).
              </p>
            </div>

            {/* Referência Normativa (Opcional - Texto Curto) */}
            <div className="md:col-span-2">
              <label htmlFor="ref-normativa" className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
                <span>Referência Normativa</span>
                <span className="text-xs font-normal text-slate-400">Opcional · Texto curto</span>
              </label>
              <div className="relative">
                <input
                  id="ref-normativa"
                  type="text"
                  maxLength={120}
                  value={referenciaNormativa}
                  onChange={(e) => setReferenciaNormativa(e.target.value)}
                  placeholder="Ex: ISO 9001:2015 item 8.5.1, FSSC 22000 cláusula 8.2, NR-12, Procedimento PO-042..."
                  className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                Indique a norma técnica, requisito regulatório, procedimento interno ou ata de auditoria relacionada (se aplicável).
              </p>
            </div>
          </div>
        </div>

        {/* Bloco 2: Metodologia 5W2H */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-semibold text-slate-900">
                2. Estrutura 5W2H (Plano de Execução)
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Metodologia de Planejamento da Ação
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* O que vai ser feito? (What) */}
            <div className="md:col-span-2">
              <label htmlFor="input-what" className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>O que vai ser feito? (What) <span className="text-rose-500">*</span></span>
              </label>
              <textarea
                id="input-what"
                rows={2}
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                placeholder="Descreva de forma clara e objetiva o objetivo e a ação a ser executada..."
                className={`w-full text-sm bg-white border rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 ${
                  errors.what ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                }`}
              />
              {errors.what && <p className="text-xs text-rose-600 mt-1">{errors.what}</p>}
            </div>

            {/* Por quê será feito? (Why) */}
            <div className="md:col-span-2">
              <label htmlFor="input-why" className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>Por quê será feito? (Why) <span className="text-rose-500">*</span></span>
              </label>
              <textarea
                id="input-why"
                rows={2}
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                placeholder="Justificativa, causa-raiz identificada, benefício esperado ou não-conformidade a eliminar..."
                className={`w-full text-sm bg-white border rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 ${
                  errors.why ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                }`}
              />
              {errors.why && <p className="text-xs text-rose-600 mt-1">{errors.why}</p>}
            </div>

            {/* Quem irá fazer? (Who) */}
            <div>
              <label htmlFor="input-who" className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-700" />
                <span>Quem irá fazer? (Who) <span className="text-rose-500">*</span></span>
              </label>
              <input
                id="input-who"
                type="text"
                value={who}
                onChange={(e) => setWho(e.target.value)}
                placeholder="Nome completo do executor e cargo/área"
                className={`w-full text-sm bg-white border rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 ${
                  errors.who ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                }`}
              />
              {errors.who && <p className="text-xs text-rose-600 mt-1">{errors.who}</p>}
              <p className="text-xs text-slate-500 mt-1">Responsável operacional pela realização da ação.</p>
            </div>

            {/* Onde será feito? (Where) */}
            <div>
              <label htmlFor="input-where" className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Onde será feito? (Where) <span className="text-rose-500">*</span></span>
              </label>
              <input
                id="input-where"
                type="text"
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                placeholder="Ex: Setor de Envase Linha 2, Oficina Mecânica Assari, Frente Agrícola 3..."
                className={`w-full text-sm bg-white border rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 ${
                  errors.where ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                }`}
              />
              {errors.where && <p className="text-xs text-rose-600 mt-1">{errors.where}</p>}
              <p className="text-xs text-slate-500 mt-1">Localização física, linha, posto ou departamento.</p>
            </div>

            {/* Como será feito? (How) */}
            <div className="md:col-span-2">
              <label htmlFor="input-how" className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-emerald-700" />
                <span>Como será feito? (How) <span className="text-rose-500">*</span></span>
              </label>
              <textarea
                id="input-how"
                rows={2}
                value={how}
                onChange={(e) => setHow(e.target.value)}
                placeholder="Método operacional, etapas, procedimentos técnicos e recursos necessários..."
                className={`w-full text-sm bg-white border rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-2 ${
                  errors.how ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                }`}
              />
              {errors.how && <p className="text-xs text-rose-600 mt-1">{errors.how}</p>}
            </div>

            {/* Qual o prazo? (Data) (When) */}
            <div>
              <label htmlFor="input-when" className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-700" />
                <span>Qual o prazo? (When) <span className="text-rose-500">*</span></span>
              </label>
              <input
                id="input-when"
                type="date"
                value={when}
                onChange={(e) => setWhen(e.target.value)}
                className={`w-full text-sm bg-white border rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 ${
                  errors.when ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                }`}
              />
              {errors.when && <p className="text-xs text-rose-600 mt-1">{errors.when}</p>}
              <p className="text-xs text-slate-500 mt-1">Data limite prevista para conclusão da execução.</p>
            </div>

            {/* Quanto vai custar? (How much) */}
            <div>
              <label htmlFor="input-howmuch" className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-700" />
                <span>Quanto vai custar? (How much)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-medium text-slate-400 pointer-events-none">
                  R$
                </span>
                <input
                  id="input-howmuch"
                  type="text"
                  value={howMuch}
                  onChange={handleCurrencyChange}
                  className="w-full text-sm bg-white border border-slate-300 rounded-lg pl-10 pr-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 tabular-nums font-mono"
                  placeholder="0,00"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">Custo estimado da ação (deixe 0,00 se sem custo adicional).</p>
            </div>
          </div>
        </div>

        {/* Bloco 3: Verificação de Eficácia */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-700" />
              <h2 className="text-base font-semibold text-slate-900">
                3. Verificação de Eficácia (Fluxo de Aprovação)
              </h2>
            </div>
            <span className="text-xs text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Controle da Qualidade
            </span>
          </div>

          <div>
            {/* Responsável pela checagem se a ação foi efetiva */}
            <label htmlFor="input-verifier" className="block text-sm font-semibold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>Responsável pela checagem se a ação foi efetiva <span className="text-rose-500">*</span></span>
              <span className="text-xs font-normal text-slate-500">Aprovador / Auditor</span>
            </label>
            <input
              id="input-verifier"
              type="text"
              value={efficacyVerifier}
              onChange={(e) => setEfficacyVerifier(e.target.value)}
              placeholder="Ex: Mariana Duarte (Garantia da Qualidade), Fernanda Silveira (Meio Ambiente)..."
              className={`w-full text-sm bg-white border rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 ${
                errors.efficacyVerifier
                  ? 'border-rose-400 focus:ring-rose-400'
                  : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
              }`}
            />
            {errors.efficacyVerifier && (
              <p className="text-xs text-rose-600 mt-1">{errors.efficacyVerifier}</p>
            )}
            <p className="text-xs text-slate-500 mt-1.5">
              Profissional que irá checar e atestar se a ação foi eficaz após a conclusão.
            </p>
          </div>
        </div>

        {/* Barra de Ações do Formulário */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] rounded-lg transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{initialPlan ? 'Salvar Alterações' : 'Cadastrar Plano de Ação'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
