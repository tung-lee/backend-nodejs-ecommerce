export interface ApiKey {
  key: string;
  status: boolean;
  permissions: string[];
}

export enum Permission {
  A = "0000",
  B = "1111",
  C = "2222",
}
