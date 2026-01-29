import bcrypt from "bcrypt";
import env from "../../env.ts";

export const hashPassword = async (password: string) => {
    const saltRounds = env.BCRYPT_ROUNDS;
    const hashedPassword = bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword);
}