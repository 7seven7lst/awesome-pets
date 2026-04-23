import bcrypt from "bcrypt";

const saltRounds = 10;

export async function hashSaltPassword(rawPassword: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.hash(rawPassword, saltRounds, (err, hashedPassword) => {
      if (err) return reject(err);
      resolve(hashedPassword!);
    });
  });
}

export async function verifyPassword(rawPassword: string, passwordHash: string): Promise<boolean> {
  return bcrypt.compare(rawPassword, passwordHash);
}
