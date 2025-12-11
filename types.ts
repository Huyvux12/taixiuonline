export type DiceValue = 1 | 2 | 3 | 4 | 5 | 6;

export enum BetOption {
  TAI = 'TAI', // 11-18
  XIU = 'XIU', // 3-10
}

export interface GameHistory {
  id: number;
  dice: DiceValue[];
  sum: number;
  result: BetOption | 'BAO'; // Bão = Triple
}
