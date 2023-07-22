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
			{
        type: 'separator',
      },
			{
				label: 'Copy',
				accelerator: 'CmdOrCtrl+C',
				role: 'copy',
				icon: nativeImage
					.createFromPath(path.join(__dirname, 'Icon.png'))
					.resize({ width: 16 }),
				visible: props.isEditable || props.selectionText.length > 0,
        enabled: props.editFlags.canCopy && props.selectionText.length > 0,
			},
			{
				label: 'Paste',
				accelerator: 'CmdOrCtrl+V',
				role: 'paste',
				icon: nativeImage
					.createFromPath(path.join(__dirname, 'Icon.png'))
					.resize({ width: 16 }),
				visible: props.isEditable || props.selectionText.length > 0,
				enabled: props.editFlags.canPaste,
			},
			// Docs: https://www.electronjs.org/docs/latest/api/menu-item/
		],
	});
