export function calculateSkillBonus(attributeValue: number): number {
  return Math.floor(attributeValue / 3);
}

export function SetDiceValue(RankValue: string): string
{
  switch (RankValue) {
    case "Sleeper": return "1d12";
    case "Awakened": return "1d20";
    case "Ascendant": return "3d12";
    case "Transcendent": return "3d20";
    case "Sovereign": return "4d24";
    case "Sacred": return "5d20";
    case "Divine": return "6d20";
    default: return "";
  }
}
