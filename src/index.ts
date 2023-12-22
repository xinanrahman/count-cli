import figlet from "figlet";
import { Command } from "commander";
import { getFileContents } from "./utils";
import path from "path";
import { createReadStream } from "fs";
import * as readline from "node:readline/promises";
import fsp from "fs/promises";

const program = new Command();

// Outputs the Count CLI header to console
console.log(figlet.textSync("Count CLI"));

program
  .version("1.0.0")
  .description("A readable, node.js alternative to the Unix wc tool")
  .option("-b, --bytes <filepath>", "output number of bytes")
  .option("-w, --words <filepath>", "output number of words")
  .option("-c, --chars <filepath>", "output number of characters")
  .option("-l, --lines <filepath>", "output number of lines")
  .parse(process.argv);

const options = program.opts();

// Displays character count of a text file
const listCharCount = async (
  filepath: string,
  relativeFilePath: string
): Promise<void> => {
  try {
    const data: string = await getFileContents(filepath);
    console.log(`${data.length} chars in ${relativeFilePath}`);
  } catch (error) {
    throw new Error(
      `Error reading filepath while getting char count at ${filepath}: ${error}`
    );
  }
};

// Displays word count of a text file
const listWordCount = async (
  filepath: string,
  relativeFilePath: string
): Promise<void> => {
  try {
    const data: string = (await getFileContents(filepath)).trim();
    const words = data.split(/\s+/);
    console.log(`${words.length} words in ${relativeFilePath}`);
  } catch (error) {
    throw new Error(
      `Error reading filepath while getting char count at ${filepath}: ${error}`
    );
  }
};

// Displays line count of a text file
const listLineCount = async (
  filePath: string,
  relativeFilePath: string
): Promise<void> => {
  const filestream = createReadStream(filePath);
  const rl = readline.createInterface({
    input: filestream,
    crlfDelay: Infinity,
  });

  let lineCount = 0;
  for await (const _ of rl) {
    lineCount++;
  }
  console.log(`${lineCount} lines in ${relativeFilePath}`);
};

// Displays byte count of a text file
const listByteCount = async (
  filePath: string,
  relativeFilePath: string
): Promise<void> => {
  const { size } = await fsp.stat(filePath);
  console.log(`${size} bytes in ${relativeFilePath}`);
};

if (options.words) {
  listWordCount(path.resolve(process.cwd(), options.words), options.words);
}

if (options.chars) {
  listCharCount(path.resolve(process.cwd(), options.chars), options.chars);
}

if (options.lines) {
  listLineCount(path.resolve(process.cwd(), options.lines), options.lines);
}

if (options.bytes) {
  listByteCount(path.resolve(process.cwd(), options.bytes), options.bytes);
}