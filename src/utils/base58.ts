const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const ALPHABET_MAP = ALPHABET.split('').reduce((map: any, c, i) => {
  map[c] = i;
  return map;
}, {});

export default {
  encode(buffer: Uint8Array): string {
    if (!buffer.length) return '';

    const digits = [0];

    for (let i = 0; i < buffer.length; i++) {
      for (let j = 0; j < digits.length; j++) {
        digits[j] <<= 8;
      }

      digits[0] += buffer[i];
      let carry = 0;

      for (let k = 0; k < digits.length; k++) {
        digits[k] += carry;
        carry = (digits[k] / 58) | 0;
        digits[k] %= 58;
      }

      while (carry) {
        digits.push(carry % 58);
        carry = (carry / 58) | 0;
      }
    }

    for (let i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) {
      digits.push(0);
    }

    return digits
      .reverse()
      .map(function(digit) {
        return ALPHABET[digit];
      })
      .join('');
  },

  decode(string: string): Uint8Array {
    if (!string.length) return new Uint8Array(0);

    const bytes = [0];

    for (let i = 0; i < string.length; i++) {
      const c = string[i];
      if (!(c in ALPHABET_MAP)) {
        throw `There is no character "${c}" in the Base58 sequence!`;
      }

      for (let j = 0; j < bytes.length; j++) {
        bytes[j] *= 58;
      }

      bytes[0] += ALPHABET_MAP[c];
      let carry = 0;

      for (let j = 0; j < bytes.length; j++) {
        bytes[j] += carry;
        carry = bytes[j] >> 8;
        bytes[j] &= 0xff;
      }

      while (carry) {
        bytes.push(carry & 0xff);
        carry >>= 8;
      }
    }

    for (let i = 0; string[i] === '1' && i < string.length - 1; i++) {
      bytes.push(0);
    }

    return new Uint8Array(bytes.reverse());
  },
};
