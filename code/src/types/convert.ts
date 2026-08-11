export type ConvertInputType = "text";

export type ConvertInput = {
  name: string;
  type: ConvertInputType;
  placeholder: string;
  label?: string;
};

export type ConvertConfig = {
  title: string;
  inputs: ConvertInput[];
};
