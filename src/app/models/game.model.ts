export interface Game {
  player1: string;
  player2: string;
  player3: string;
  player4: string;
  status: string;
}

export interface GamePagination {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}
