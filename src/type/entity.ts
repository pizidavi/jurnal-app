export type Model = {
  id: string;
  name: string;
  fileName: string;
  url: string;
  size: number;
};

export type TranscriptionSegment = {
  text: string;
  t0: number;
  t1: number;
};
