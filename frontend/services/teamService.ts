import { Team } from "@/models/team";

export async function getTeams(userId: number): Promise<Team[]> {
  return [
    {
      id: 1,
      name: "Team Alpha",
      players: [
        { id: 1, name: "Alice", isPending: false },
        { id: 2, name: "Bob", isPending: true },
      ]
    },
    {
      id: 2,
      name: "Team Beta",
      players: [
        { id: 3, name: "Charlie", isPending: false },
        { id: 4, name: "Diana", isPending: true },
      ]
    },
  ];
}