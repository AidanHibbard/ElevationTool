export default function encode(value) {
  let step1 = value < 0 ? ~(value << 1) : value << 1;
  let step2 = '';

  while (step1 >= 0x20) {
    step2 += String.fromCharCode((0x20 | (step1 & 0x1f)) + 63);
    step1 >>= 5;
  };

  step2 += String.fromCharCode(step1 + 63);
  return step2;
};