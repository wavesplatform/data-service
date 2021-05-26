export const collect = <A, B>(partialFunction: (a: A, idx: number) => B | undefined) => (
  arr: A[]
): B[] => {
  const res: B[] = [];

  arr.forEach((a, idx) => {
    const maybeB = partialFunction(a, idx);
    if (typeof maybeB !== 'undefined') {
      res.push(maybeB);
    }
  });

  return res;
};
