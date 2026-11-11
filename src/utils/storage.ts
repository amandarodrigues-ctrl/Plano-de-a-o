import { ActionPlan } from '../types/actionPlan';

const STORAGE_KEY = 'uisa_action_plans_v2';

export const INITIAL_ACTION_PLANS: ActionPlan[] = [
  {
    id: 'plan-001',
    code: 'PA-2026-001',
    createdAt: '2026-10-15',
    updatedAt: '2026-11-02',
    unidade: 'Indústria',
    categoria: 'Patrulha de qualidade e segurança de alimentos',
    referenciaNormativa: 'FSSC 22000 - Cláusula 8.2 (Programas de Pré-requisitos)',
    what: 'Instalação de barreira sanitária com sensor automático e lavador de botas na entrada do setor de envase',
    why: 'Mitigar risco de contaminação cruzada biológica detectado na patrulha microbiológica',
    who: 'Carlos Eduardo Mendes (Engenharia de Processos)',
    how: 'Contratação de empresa especializada em inox 304, interligação hidráulica com sabonete bactericida e treinamento da equipe de operadores',
    where: 'Setor de Envase e Refino - Linha 2',
    when: '2026-11-05',
    howMuch: 18500.00,
    efficacyVerifier: 'Mariana Duarte (Garantia da Qualidade)',
    efficacyTargetDate: '2026-11-20',
    efficacyCriteria: '100% dos operadores utilizando o lavador; zero registro de não-conformidade microbiológica em 15 swabs pós-instalação',
    status: 'aguardando_verificacao',
    executionCompletedAt: '2026-11-04',
    executionNotes: 'Instalação física concluída no dia 03/11. Teste de acionamento dos sensores e abastecimento dos dosadores realizado com êxito. Equipe treinada com lista de presença assinada.'
  },
  {
    id: 'plan-002',
    code: 'PA-2026-002',
    createdAt: '2026-10-20',
    updatedAt: '2026-11-08',
    unidade: 'Agrícola',
    categoria: 'Patrulha de Meio Ambiente',
    referenciaNormativa: 'CONAMA 357 & Procedimento Ambiental PA-AMB-014',
    what: 'Impermeabilização e reforma da bacia de contenção do tanque de óleo diesel da frota de colhedoras',
    why: 'Evitar infiltração residual de hidrocarbonetos no solo durante as operações de abastecimento de safra',
    who: 'Roberto Albuquerque (Supervisor Agrícola)',
    how: 'Aplicação de geomembrana PEAD e camada de concreto armado impermeabilizado com dreno coletor estanque',
    where: 'Ponto de Apoio Agrícola Frente 3 - Fazenda União',
    when: '2026-11-25',
    howMuch: 32000.00,
    efficacyVerifier: 'Fernanda Silveira (Coordenação de Meio Ambiente)',
    efficacyTargetDate: '2026-12-10',
    efficacyCriteria: 'Teste de estanqueidade de 24h sem vazamento e laudo de conformidade ambiental emitido',
    status: 'em_andamento'
  },
  {
    id: 'plan-003',
    code: 'PA-2026-003',
    createdAt: '2026-09-10',
    updatedAt: '2026-10-25',
    unidade: 'Assari',
    categoria: 'Patrulha de 5S',
    referenciaNormativa: 'Manual Corporativo de 5S - Critério Seiton (Ordenação)',
    what: 'Demarcação de solo epóxi, identificação de ferramentas (quadro sombra) e eliminação de sucatas na oficina mecânica',
    why: 'Otimizar o tempo de busca de chaves e peças e eliminar riscos de tropeços e acidentes com maquinário pesado',
    who: 'Thiago Valente (Encarregado de Oficina Assari)',
    how: 'Pintura de faixas amarelas e zebradas de segurança, instalação de 4 quadros sombra padronizados e descarte correto de sucatas metálicas',
    where: 'Oficina Central de Manutenção Mecânica - Unidade Assari',
    when: '2026-10-15',
    howMuch: 7400.00,
    efficacyVerifier: 'Juliana Paes (Comitê 5S Corporativo)',
    efficacyTargetDate: '2026-10-25',
    efficacyCriteria: 'Nota no checklist de auditoria 5S superior a 90% e tempo de setup de ferramentas reduzido em 30%',
    status: 'eficaz',
    executionCompletedAt: '2026-10-14',
    executionNotes: 'Pintura finalizada e quadros de ferramentas montados. Sucatas destinadas ao pátio de reciclagem com MTR emitido.',
    verifiedAt: '2026-10-24',
    verifiedBy: 'Juliana Paes (Comitê 5S Corporativo)',
    verificationResult: 'eficaz',
    verificationNotes: 'Auditoria in loco realizada. Nota 94/100 na avaliação de 5S. Oficina perfeitamente organizada, ferramentas nos respectivos locais e corredor de pedestres desobstruído.',
    verificationScore: 94
  },
  {
    id: 'plan-004',
    code: 'PA-2026-004',
    createdAt: '2026-10-28',
    updatedAt: '2026-11-01',
    unidade: 'Administrativo',
    categoria: 'Reunião de Liderança',
    referenciaNormativa: 'ISO 9001:2015 - Item 9.3 (Análise Crítica pela Direção)',
    what: 'Desenvolvimento e publicação de painel executivo com atualização diária dos indicadores de safra e metas ESG',
    why: 'Facilitar a tomada de decisão ágil dos diretores e gerentes sem depender de consolidação manual de planilhas',
    who: 'Amanda Rodrigues (Planejamento Estratégico)',
    how: 'Integração de dados do ERP com dashboard analítico e treinamento dos líderes no comitê quinzenal',
    where: 'Sede Administrativa / Salas de Reunião da Diretoria',
    when: '2026-11-30',
    howMuch: 12000.00,
    efficacyVerifier: 'Lucas Brandão (Gerente de TI & Gestão)',
    efficacyTargetDate: '2026-12-15',
    efficacyCriteria: '100% das reuniões executivas utilizando o painel e taxa de atualização automática de 99%',
    status: 'planejado'
  },
  {
    id: 'plan-005',
    code: 'PA-2026-005',
    createdAt: '2026-10-05',
    updatedAt: '2026-10-30',
    unidade: 'Indústria',
    categoria: 'Auditorias',
    referenciaNormativa: 'NR-12 - Segurança no Trabalho em Máquinas e Equipamentos',
    what: 'Instalação de gradeamento fixo e botão de parada de emergência monitorado na esteira transportadora de biomassa',
    why: 'Apontamento de risco grave em auditoria interna de SST na moenda',
    who: 'Sérgio Ramos (Coordenação de Segurança do Trabalho)',
    how: 'Confecção das proteções em chapa perfurada conforme NBR ISO 13857 e intertravamento elétrico com relé de segurança cat. 4',
    where: 'Moenda / Esteira Alimentadora 01',
    when: '2026-10-25',
    howMuch: 24500.00,
    efficacyVerifier: 'Eng. Beatriz Rocha (Auditora Líder SST)',
    efficacyTargetDate: '2026-10-30',
    efficacyCriteria: 'Laudo de conformidade técnica emitido com ART e teste prático de parada de emergência',
    status: 'eficaz',
    executionCompletedAt: '2026-10-24',
    executionNotes: 'Proteções instaladas e pintadas na cor amarela de segurança. Relé instalado e testado.',
    verifiedAt: '2026-10-29',
    verifiedBy: 'Eng. Beatriz Rocha (Auditora Líder SST)',
    verificationResult: 'eficaz',
    verificationNotes: 'Laudo emitido por profissional habilitado com ART. Teste de acionamento em carga com tempo de parada inferior a 1,2 segundos. Ação 100% eficaz.',
    verificationScore: 100
  },
  {
    id: 'plan-006',
    code: 'PA-2026-006',
    createdAt: '2026-10-12',
    updatedAt: '2026-11-07',
    unidade: 'Agrícola',
    categoria: 'Alinhamentos Internos',
    referenciaNormativa: 'Manual Operacional de Tratos Culturais - PO-AGR-08',
    what: 'Calibração e revisão completa de 12 bicos de pulverização de defensivos com sensor de vazão digital',
    why: 'Reduzir perda por deriva e garantir dosagem precisa de defensivos nas lavouras',
    who: 'Henrique Prado (Líder de Pulverização)',
    how: 'Contratação de aferição metrológica e substituição de bicos desgastados por pontas de cerâmica com indução de ar',
    where: 'Pátio de Máquinas Agrícolas - Tratos Culturais',
    when: '2026-11-18',
    howMuch: 9800.00,
    efficacyVerifier: 'Eng. Agrônomo Diego Martins',
    efficacyTargetDate: '2026-11-30',
    efficacyCriteria: 'Coeficiente de variação (CV) entre bicos inferior a 5% em bancada de teste',
    status: 'em_andamento'
  },
  {
    id: 'plan-007',
    code: 'PA-2026-007',
    createdAt: '2026-10-10',
    updatedAt: '2026-11-06',
    unidade: 'Indústria',
    categoria: 'Patrulha de 5S',
    referenciaNormativa: 'Auditoria de Rotulagem e 5S Operacional',
    what: 'Substituição das mangueiras de lavagem e fixação de carretéis aéreos na destilaria',
    why: 'Mangueiras soltas no piso causam risco de queda de operadores e desgaste prematuro do material',
    who: 'Marcos Vinícius (Manutenção Predial)',
    how: 'Instalação de 8 carretéis retráteis automáticos com bicos reguláveis em inox nas passarelas de operação',
    where: 'Destilaria de Etanol - Setor de Fermentação',
    when: '2026-11-04',
    howMuch: 5600.00,
    efficacyVerifier: 'Juliana Paes (Comitê 5S Corporativo)',
    efficacyTargetDate: '2026-11-15',
    efficacyCriteria: '100% das mangueiras suspensas nos carretéis sem contato com o piso',
    status: 'em_andamento'
  },
  {
    id: 'plan-008',
    code: 'PA-2026-008',
    createdAt: '2026-10-25',
    updatedAt: '2026-11-02',
    unidade: 'Agrícola',
    categoria: 'Auditorias',
    referenciaNormativa: 'ISO 14001:2015 - Gestão de Resíduos & Renovabio',
    what: 'Implantação de pátio experimental de compostagem para torta de filtro e cinzas de caldeira',
    why: 'Aproveitamento agronômico de nutrientes e redução substancial de fertilizantes químicos',
    who: 'Dr. Gustavo Silveira (Pesquisa & Solos)',
    how: 'Construção de leiras com revolvedor mecânico e monitoramento diário de temperatura e umidade',
    where: 'Campo Experimental de Fertirrigação - Setor Norte',
    when: '2026-12-28',
    howMuch: 45000.00,
    efficacyVerifier: 'Fernanda Silveira (Coordenação de Meio Ambiente)',
    efficacyTargetDate: '2027-01-20',
    efficacyCriteria: 'Laudo agronômico com taxa de mineralização superior a 75% e ausência de fitotoxicidade',
    status: 'planejado'
  }
];

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDatePlusDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

export function isActionCompleted(plan: ActionPlan): boolean {
  return (
    plan.status === 'eficaz' ||
    plan.status === 'ineficaz' ||
    plan.status === 'aguardando_verificacao' ||
    plan.status === 'cancelado'
  );
}

export function isActionOverdue(plan: ActionPlan, todayStr = getTodayString()): boolean {
  if (isActionCompleted(plan)) return false;
  return plan.when < todayStr;
}

export function isActionDueWithin30Days(plan: ActionPlan, todayStr = getTodayString()): boolean {
  if (isActionCompleted(plan)) return false;
  const in30Days = getDatePlusDays(30);
  return plan.when >= todayStr && plan.when <= in30Days;
}

export function getActionPlans(): ActionPlan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ACTION_PLANS));
      return INITIAL_ACTION_PLANS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ACTION_PLANS;
  }
}

export function saveActionPlans(plans: ActionPlan[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  } catch (err) {
    console.error('Falha ao salvar no localStorage:', err);
  }
}

export function resetToDefaults(): ActionPlan[] {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ACTION_PLANS));
  return INITIAL_ACTION_PLANS;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const [year, month, day] = dateString.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return dateString;
  } catch {
    return dateString;
  }
}

export function generateNextCode(plans: ActionPlan[]): string {
  const currentYear = new Date().getFullYear();
  const yearPlans = plans.filter(p => p.code.includes(`${currentYear}`));
  const nextNum = yearPlans.length + 1;
  return `PA-${currentYear}-${String(nextNum).padStart(3, '0')}`;
}
