export interface IDescription {
  title: string;
  sections: {
    type: string;
    content: string | string[];
  }[];
}
