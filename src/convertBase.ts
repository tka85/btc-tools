export const bin2dec = (s: string): string => parseInt(s, 2).toString(10);
export const bin2hex = (s: string): string => parseInt(s, 2).toString(16);
export const dec2bin = (s: string): string => parseInt(s, 10).toString(2);
export const dec2hex = (s: string): string => parseInt(s, 10).toString(16);
export const hex2bin = (s: string): string => parseInt(s, 16).toString(2);
export const hex2dec = (s: string): string => parseInt(s, 16).toString(10);