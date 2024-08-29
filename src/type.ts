export interface Event {
  id: string;
  name: string;
  flag_url: string;
  gold_medals: number;
  silver_medals: number;
  bronze_medals: number;
  total_medals: number;
  medals_by_sport?: {
    until_2024?: {
      sports: { name: string; gold: number; silver: number; bronze: number }[];
      total?: { gold: number; silver: number; bronze: number };
    };
  };
}

export interface Country {
  id: string;
  name: string;
  description: string;
  hostcountry:string;
}


export interface Comment {
  name: string
  text: string
  date: string
}

export interface MessageState {
  message: string
}
