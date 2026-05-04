export const getCartItemDetails = (thicknessDisplay?: string | null, sizeDisplay?: string | null): string => {
  const details = [];

  if (sizeDisplay) {
    details.push(sizeDisplay);
  }
  if (thicknessDisplay) {
    details.push(`толщина ${thicknessDisplay}`);
  }

  return details.join(', ');
};
