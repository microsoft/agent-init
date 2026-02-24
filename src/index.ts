import { runCli } from "./cli";

const [, , ...args] = process.argv;
if (args.length === 0) {
  runCli([process.argv[0], process.argv[1], "tui"]);
} else {
  runCli(process.argv);
}
