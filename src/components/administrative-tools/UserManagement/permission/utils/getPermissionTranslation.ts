export const getPermissionTranslation = (label?: string) => {
  if (!label) return '';

  const key = label.toLowerCase(); 
  const parts = key.split('_');

  const action = parts[0]; 
  const entity = parts.slice(1).join('_');

  const sellingEntities = ['invoice', 'payment', 'quotation'];

  if (sellingEntities.includes(entity)) {
    return `selling_${entity}.${action}_selling_${entity}`;
  }
  return `${entity}.${action}_${entity}`;
};