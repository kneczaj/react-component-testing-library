import React, { useState } from 'react';

export interface Props {
  a: boolean;
  b: boolean;
}

export function SampleComponent({ a, b }: Props) {
  const [isDShown, setIsDShown] = useState(false);
  if (a) {
    return <div>A</div>;
  }
  if (b) {
    return <div>B</div>;
  }
  return (
    <div>
      <span>{isDShown ? 'D' : 'C'}</span>
      <button onClick={() => setIsDShown(!isDShown)}>show D</button>
    </div>
  );
}
