type ScreeningSoundMap = {
  [key: string]: string;
};

export const screeningSoundMap: ScreeningSoundMap = {
  subtitles: "Napisy",
  narrator: "Lektor",
  dubbing: "Dubbing",
};

export interface ScreeningType {
  _id: string;
  date: Date;
  type: string;
  sound: string;
  seats: SeatType[];
}

interface SeatType {
  row: string;
  number: number;
  class: string;
  taken: boolean;
}
