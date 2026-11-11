export type UnitType = 'Agrícola' | 'Indústria' | 'Assari' | 'Administrativo';

export type CategoryType = 
  | 'Auditorias'
  | 'Patrulha de 5S'
  | 'Patrulha de Meio Ambiente'
  | 'Patrulha de qualidade e segurança de alimentos'
  | 'Reunião de Liderança'
  | 'Alinhamentos Internos';

export type ActionStatus = 
  | 'planejado'
  | 'em_andamento'
  | 'aguardando_verificacao'
  | 'eficaz'
  | 'ineficaz'
  | 'cancelado';

export interface ActionPlan {
  id: string;
  code: string; // e.g. PLA-2026-001
  createdAt: string;
  updatedAt: string;

  // Campos de Cadastro
  unidade: UnitType;
  categoria: CategoryType;
  referenciaNormativa: string; // Texto curto (ex: ISO 9001:2015 8.5.1, FSSC 22000, NR-12)

  // 5W2H
  what: string;       // O que vai ser feito?
  why: string;        // Por quê será feito?
  who: string;        // Quem irá fazer?
  how: string;        // Como será feito?
  where: string;      // Onde será feito?
  when: string;       // Qual o prazo? (Data YYYY-MM-DD)
  howMuch: number;    // Quanto vai custar? (Valor numérico em R$)

  // Verificação de Eficácia
  efficacyVerifier: string;       // Responsável pela checagem se a ação foi efetiva
  efficacyTargetDate?: string;    // Data prevista para a checagem
  efficacyCriteria?: string;      // Critério de avaliação / evidência esperada

  // Dados do Fluxo de Execução & Aprovação
  status: ActionStatus;
  executionNotes?: string;        // Evidência / relato do executor
  executionCompletedAt?: string;  // Data da conclusão operacional

  // Dados do Fluxo de Verificação Realizada
  verifiedAt?: string;            // Data em que foi verificada
  verifiedBy?: string;            // Quem efetivamente auditou/verificou
  verificationResult?: 'eficaz' | 'ineficaz';
  verificationNotes?: string;     // Parecer técnico / justificativa
  verificationScore?: number;     // 0 - 100% de eficácia alcançada
}

export const UNIT_OPTIONS: UnitType[] = [
  'Agrícola',
  'Indústria',
  'Assari',
  'Administrativo'
];

export const CATEGORY_OPTIONS: CategoryType[] = [
  'Auditorias',
  'Patrulha de 5S',
  'Patrulha de Meio Ambiente',
  'Patrulha de qualidade e segurança de alimentos',
  'Reunião de Liderança',
  'Alinhamentos Internos'
];

export const STATUS_CONFIG: Record<ActionStatus, { label: string; bg: string; text: string; border: string }> = {
  planejado: {
    label: 'Planejado',
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200'
  },
  em_andamento: {
    label: 'Em Andamento',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200'
  },
  aguardando_verificacao: {
    label: 'Aguardando Verificação',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200'
  },
  eficaz: {
    label: 'Eficaz (Aprovado)',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200'
  },
  ineficaz: {
    label: 'Ineficaz (Reprovado)',
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200'
  },
  cancelado: {
    label: 'Cancelado',
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    border: 'border-slate-300'
  }
};
