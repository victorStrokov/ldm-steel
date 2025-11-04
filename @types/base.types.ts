// общий список всех возможных материалов
export type BaseMaterial = 'STEEL' | 'PVC' | 'ALUMINIUM' | 'PLASTIC';

export type BaseMaterialName = 'Сталь' | 'ПВХ' | 'Алюминий' | 'Пластик';

export const BaseMaterialMap: Record<BaseMaterial, BaseMaterialName> = {
  STEEL: 'Сталь',
  PVC: 'ПВХ',
  ALUMINIUM: 'Алюминий',
  PLASTIC: 'Пластик',
};
