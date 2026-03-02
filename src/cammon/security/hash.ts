import { hash, compare } from 'bcrypt';

type HashPayload = string | number | boolean | object | null | undefined;

export const GenerateHash = async (
  payload: HashPayload,
  saltRounds: number = Number(process.env.SALT_ROUNDS) || 10,
): Promise<string> => {
  try {
    if (payload === undefined || payload === null) {
      throw new Error('Payload is required');
    }

    const textToHash =
      typeof payload === 'string' ? payload : JSON.stringify(payload);

    const hashed = await hash(textToHash, saltRounds);
    return hashed;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`generateHash failed: ${errorMessage}`);
  }
};

export const compareHash = async (
  payload: HashPayload,
  hashedText: string,
): Promise<boolean> => {
  try {
    if (payload === undefined || payload === null) {
      throw new Error('Payload is required');
    }

    const textToCompare =
      typeof payload === 'string' ? payload : JSON.stringify(payload);

    const isMatch = await compare(textToCompare, hashedText);
    return isMatch;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`compareHash failed: ${errorMessage}`);
  }
};
