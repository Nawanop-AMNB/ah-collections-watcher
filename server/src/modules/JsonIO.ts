import { existsSync, mkdirSync, readFile, writeFile } from "fs";
import { dirname } from "path";

export const writeJson = async (path: string, json: any) => {
  const dir = dirname(path);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  return new Promise<void>(async (res, rej) => {
    writeFile(
      path,
      JSON.stringify(json, null, 2),
      {
        encoding: "utf-8",
      },
      (err) => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      }
    );
  });
};

export const readJson = async (path: string) => {
  if (!existsSync(path)) {
    return {};
  }

  return new Promise<any>((res, rej) => {
    readFile(path, { encoding: "utf-8" }, (err, data) => {
      if (err) {
        rej(err);
      } else {
        res(JSON.parse(data));
      }
    });
  });
};
