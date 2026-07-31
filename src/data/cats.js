export const CATS = [
  { id: "king", label: "King", file: "/king-cat.png" },
  { id: "scifi", label: "Sci-Fi", file: "/scifi-kitty.png" },
  { id: "warrior", label: "Warrior", file: "/warrior-kitty.png" },
  { id: "queen", label: "Queen", file: "/Queen-car.png" },
  { id: "corrupted", label: "Corrupted", file: "/corrupted-car.png" },
  { id: "fairy", label: "Fairy", file: "/download.png" },
];

export function getCat(catId) {
  return CATS.find((c) => c.id === catId) || null;
}
