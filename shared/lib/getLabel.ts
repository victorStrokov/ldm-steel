function getLabel(
  map: Record<string, Record<number, string>>,
  material: string | null,
  key?: string | number | null,
): string {
  if (!material || !key) return '';
  const numKey = typeof key === 'string' ? Number(key) : key;
  return map[material]?.[numKey] ?? '';
}

export default getLabel;
