import fsp from "fs/promises";

export const getFileContents = async (filepath: string): Promise<string> => {
  try {
    const data = await fsp.readFile(filepath, "utf-8");
    return data;
  } catch (error) {
    throw error;
  }
};
