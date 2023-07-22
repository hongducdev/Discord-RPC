const contextMenu = require('electron-context-menu');
const { nativeImage } = require('electron');
const path = require('path');

module.exports = (win) =>
	contextMenu({
		menu: (actions, props, browserWindow, dictionarySuggestions) => [
			{
				label: 'Unicorn',
				sublabel: 'Magical creature',
				icon: nativeImage
					.createFromPath(path.join(__dirname, 'Icon.png'))
					.resize({ width: 16 }),
				type: 'normal',
			},
			actions.separator(), // dấu ngăn cách
			actions.copy(),
			actions.paste(),
			// Docs: https://www.electronjs.org/docs/latest/api/menu-item/
		],
	});
