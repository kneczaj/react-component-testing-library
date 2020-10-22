import React from "react";

export interface Props {
  a: boolean;
  b: boolean;
}

export function SampleComponent({ a, b }: Props) {
  if (a) {
    return <div>A</div>;
  }
  if (b) {
    return <div>B</div>;
  }
  return <div>C</div>;
}
