import bcrypt from "bcrypt";

export const hashedpassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (err) {
    console.err(err);
  }
};

export const comparepassword = async (password, hashedpassword) => {
  return bcrypt.compare(password, hashedpassword);
};
