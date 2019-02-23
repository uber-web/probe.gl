"use strict";module.export({formatSI:()=>formatSI});function formatSI(number, precision = 3) {
  const {base, exponent} = splitIntoBaseAndExponent(number);
  const multipleOf3 = Math.floor(exponent / 3);
  const remaining = exponent - multipleOf3 * 3;
  const digits = base * Math.pow(10, remaining);
  return `${digits.toPrecision(precision)}${getSISuffix(multipleOf3)}`;
}

function getSISuffix(multipleOf3) {
  const SI_SUFFIXES = {0: '', 1: 'K', 2: 'M', 3: 'G', '-1': 'm', '-2': 'µ', '-3': 'n'};
  const key = String(multipleOf3);
  return key in SI_SUFFIXES ? SI_SUFFIXES[key] : `e${multipleOf3 * 3}`;
}

// Breaks a number into a normalized base and an exponent
// E.g. 5640 => {5.64, 1000}
function splitIntoBaseAndExponent(number) {
  let base = number;
  let exponent = 0;
  if (number !== 0) {
    while (base >= 10 || base <= -10) {
      base /= 10;
      exponent++;
    }
    while (base < 1 && base > -1) {
      base *= 10;
      exponent--;
    }
  }
  return {base, exponent};
}
