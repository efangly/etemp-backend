import fs from "node:fs"
import path from "node:path";

const firmwareList = (): string[] => {
  try {
    const directoryPath = 'public/firmwares';
    const filesAndFolders = fs.readdirSync(directoryPath);
    const files = filesAndFolders.filter((item) => {
      const itemPath = path.join(directoryPath, item);
      const stats = fs.statSync(itemPath);
      return stats.isFile();
    })
    return files.filter((item) => item !== ".DS_Store");
  } catch (error) {
    throw error;
  }
}

const removeFirmware = (filename: string): string => {
  try {
    fs.unlinkSync(path.join('public/firmwares', filename));
    return `Delete ${filename} success`;
  } catch (error) {
    throw error;
  }
}

export {
  firmwareList,
  removeFirmware
}