export function calculateMaxHp(body: number, endurance: number): number {
  return body * 5 + endurance * 2;
}

export function calculateSkillBonus(attributeValue: number): number {
  return Math.floor(attributeValue / 3);
}
