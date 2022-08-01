import { readdirSync, lstatSync } from 'fs';
import ascii from 'ascii-table';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const { dirname } = path;
// Syntax Commonjs
const require = createRequire(import.meta.url);
// __dirname
const __dirname = dirname(fileURLToPath(import.meta.url));
// __filename
const __filename = fileURLToPath(import.meta.url);
export default {
	loadEvent: async function (
		client,
		classLoad,
		folderName,
		commonJs = false,
		packaged = false,
	) {
		const pathEvent = packaged
			? path.resolve('.', 'resources', 'app', 'src', folderName)
			: path.resolve('.', 'src', folderName);
		const eventTable = new ascii(`Event ${folderName} Status`);
		eventTable.setHeading(
			chalk.bold.yellowBright('Name'),
			chalk.bold.blueBright('File'),
			chalk.bold.greenBright('Status'),
		);
		for (const fileName of readdirSync(pathEvent).filter(
			(fileName_) =>
				fileName_.endsWith(commonJs ? '.cjs' : '.js') &&
				lstatSync(path.resolve(pathEvent, fileName_)).isFile(),
		)) {
			const eventName = fileName.split('.')[0];
			try {
				const event = commonJs
					? require(`../${folderName}/${fileName}`)
					: (await import(`../${folderName}/${fileName}`)).default;
				classLoad.on(eventName, event.bind(null, client ? client : {}));
				eventTable.addRow(
					chalk.bold.yellowBright(eventName),
					chalk.bold.cyanBright(fileName),
					chalk.bold.greenBright('✔'),
				);
			} catch (e) {
				eventTable.addRow(
					chalk.bold.yellowBright(eventName),
					chalk.bold.cyanBright(fileName),
					chalk.bold.redBright(e.message),
				);
			}
		}
		console.log(eventTable.toString());
	},
	random(min = 0, max = 10) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
};
