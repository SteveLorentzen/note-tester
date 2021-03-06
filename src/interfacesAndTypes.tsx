export interface IUser {
  uid: string;
  email: string;
  hostSessionId: string;
  displayName: string;
  photoURL: string;
  soloSettings: IAutoQuiz;
  guitarSettings: IGuitarSettings;
}

export interface ISession {
  guestId: string;
  hostId: string;
  identifiedNotes: number;
  totalNotes: number;
  mnemonics: IMnemonics;
  selectedClef: string;
  selectedNote: string;
  answer: string;
  sessionCode: string;
  answerStatus: string;
  displayingNotes: boolean;
  autoQuiz: IAutoQuiz;
}

interface IMnemonics {
  showLinesOnStaff: boolean;
  showSpacesOnStaff: boolean;
}

export interface IAutoQuiz {
  on: boolean;
  includeSharps: boolean;
  includeFlats: boolean;
  includeTreble: boolean;
  includeBass: boolean;
  lowTrebleNote: string;
  highTrebleNote: string;
  lowBassNote: string;
  highBassNote: string;
  treblePreset: string;
  bassPreset: string;
}

export interface IGuitarSettings {
  preset: string;
  lowString: number;
  highString: number;
  lowFret: number;
  highFret: number;
  includeFlats: boolean;
  includeSharps: boolean;
}

export interface IGuitarNote {
  stringNumber: number;
  name: string;
}
