export default function sameTeam(p1: number, p2: number) {
  const WHITE_START = 48;
  const BLACK_END = 15;

  if (p1 >= WHITE_START && p2 >= WHITE_START) return true;
  if (p1 < BLACK_END && p2 < BLACK_END) return true;

  return false;
}
