import chalk from "chalk";

const prefix = () => {
  return `[${new Date().toLocaleString("th", {
    timeZone: "Asia/Bangkok",
  })}] `;
};

const ln = (line: number) => {
  for (let i = 0; i < line; i++) {
    console.log();
  }
};

const info = (...values: any[]) => {
  console.log(
    chalk.grey(prefix()),
    chalk.blueBright("[INFO]".padEnd(10)),
    ...values
  );
};

const error = (...values: any[]) => {
  console.log(chalk.grey(prefix()), chalk.red("[ERROR]".padEnd(10)), ...values);
};

const debug = (...values: any[]) => {
  console.log(
    chalk.grey(prefix()),
    chalk.green("[DEBUG]".padEnd(10)),
    ...values
  );
};

export default {
  info,
  error,
  debug,
  ln,
};
