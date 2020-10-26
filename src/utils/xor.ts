export function xor(a: boolean, b: boolean): boolean;
export function xor(a: string, b: string): boolean;
export function xor(a: number, b: number): boolean;
export function xor(
  a: boolean | string | number,
  b: boolean | string | number
): boolean {
  return a !== b;
}
