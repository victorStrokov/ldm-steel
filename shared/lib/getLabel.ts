function getLabel(
  map: Record<string, Record<string | number, string>>,
  material: string | null,
  key?: string | number | null,
): string {
  if (!material || key === null || key === undefined) return '';
  const numKey = Number(key);
  const strKey = String(key);
  const m = map[material];
  return (m?.[numKey] ?? m?.[strKey] ?? '') as string;
}

export default getLabel;
