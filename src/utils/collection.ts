export const collect = <A, B>(partialFunction: (a: A) => B | undefined) => (
  arr: A[]
): B[] => {
  const res: B[] = [];

  arr.forEach((a) => {
    const maybeB = partialFunction(a);
    if (typeof maybeB !== 'undefined') {
      res.push(maybeB);
    }
  });

  return res;
};
