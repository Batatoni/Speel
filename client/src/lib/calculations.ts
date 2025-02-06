export function calculateMaxHp(body: number): number {
  return body * 5 + 8;
}

export function calculateSkillBonus(attributeValue: number): number {
  return Math.floor(attributeValue / 3);
}
