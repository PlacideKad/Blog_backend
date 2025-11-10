import bcrypt from "bcryptjs";

export const getHashedPassword=async (plainPassword)=>{
  const hash=await bcrypt.hash(plainPassword,10);
  return hash;
}

export const checkPassword=async (plainPassword, hashPassword)=>{
  const isMatch=await bcrypt.compare(plainPassword,hash);
  return isMatch;
}
