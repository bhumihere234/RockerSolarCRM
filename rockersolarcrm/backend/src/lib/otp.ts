import bcrypt from "bcrypt";

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isPhone = (v: string) => /^\d{10,14}$/.test(v);

export const genOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
export const hashOtp = (code: string) => bcrypt.hash(code, 10);
export const checkOtp = (code: string, hash: string) => bcrypt.compare(code, hash);
export const expireIn = (min: number) => new Date(Date.now() + min * 60 * 1000);
