export function calculateSkillBonus(attributeValue: number): number {
  return Math.floor(attributeValue / 3);
}

export function SetDiceValue(RankValue: string)
{
  switch (RankValue) {
    case "Sleeper": return "1d4";
    case "Awakened": return "1d6";
    case "Ascendant": return "1d8";
    case "Teanscendent": return "1d10";
    case "Sovereign": return "1d6";
    case "Sacred": return "1d8";
    case "Divine": return "1d10";
  }
}
