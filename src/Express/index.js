import express from 'express';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import ascii from 'ascii-table';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { createRequire } from 'module';
const { dirname } = path;
// Syntax Commonjs
const require = createRequire(import.meta.url);
// Socket.io

const app = express();

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(bodyParser.json());

app.use(
	bodyParser.urlencoded({
		extended: true,
	}),
);

app.use(cors());

app.use(express.static(path.resolve('.')));

const eventTable = new ascii(`Express Routes Status`);
eventTable.setHeading(
	chalk.bold.magentaBright('Type'),
	chalk.bold.yellowBright('Path'),
	chalk.bold.blueBright('File'),
	chalk.bold.greenBright('Status'),
);

for await (const folder of fs.readdirSync(
	path.resolve('.', 'src', 'Express', 'routes'),
)) {
	const type = folder;
	await Promise.all(
		fs
			.readdirSync(path.resolve('.', 'src', 'Express', 'routes', type))
			.map(async (file) => {
				const route = file;
				try {
					const routeFile = (
						await import(`./routes/${type}/${route}`)
					).default;
					app[type](`${routeFile.path}`, routeFile.run);
					eventTable.addRow(
						chalk.bold.magentaBright(type.toUpperCase()),
						chalk.bold.yellowBright(routeFile.path),
						chalk.bold.cyanBright(file),
						chalk.bold.greenBright('✔'),
					);
				} catch (e) {
					eventTable.addRow(
						chalk.bold.magentaBright(type.toUpperCase()),
						chalk.bold.yellowBright('?'),
						chalk.bold.cyanBright(file),
						chalk.bold.redBright(e.message),
					);
				}
			}),
	);
}

console.log(eventTable.toString());

export default {
    express: app,
    http: http,
    io: io,
};
