import "dotenv/config";

const { JWT_SECRET } = process.env;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error(
    "JWT_SECRET is missing or too short (need >=32 chars). App won't start.",
  );
}

export const config = { JWT_SECRET };
