console.log('Back-end by aiko-chan-ai');
const startAppTimestamp = Date.now();
let lastUpdateTime = Date.now();
let timerMode = 0;
let languageObj = {};
const timerModeEnums = {
    0: 'NONE',
    1: 'APP_START',
    2: 'RPC_UPDATE',
    3: 'LOCAL_TIME',
    4: 'CUSTOM',
    NONE: 0,
    APP_START: 1,
    RPC_UPDATE: 2,
    LOCAL_TIME: 3,
    CUSTOM: 4,
}
// Regex filter LanguageCode
const regex = /(?<=>)(\s*)(JSON=\S+)(\s*)(?=<\/)/gim;
// Load Language
const loadLang = async (langcode = 'en') => {
	const res = await axios.get(
		`${document.URL.replace('/rpc', '')}/src/Language/${langcode}.json`,
	);
	console.log(res.data, typeof res.data);
	languageObj = res.data;
    return languageObj;
};
// Replace UI Language
async function replaceAll(lang_ = 'en') {
	let body_ = $('body').html();
	const matches = body_
		.match(regex)
		.map((text) => text.replace(/\s+/gim, '').split('</')[0]);
	console.log(matches);
	await loadLang(lang_);
	const replaceData = matches.map((key) => {
		const value = getValuefromObjectString(
			languageObj.html,
			key.replace('JSON=', ''),
		);
		return {
			orginal: key,
			replace: value,
		};
	});
	replaceData.forEach((data) => {
		body_ = body_.replace(data.orginal, data.replace);
	});
	$('body').html(body_);
    return true;
}
// convert string object path
const getValuefromObjectString = (obj, str) => {
	const keySplit = str.split('.');
	const result = obj[keySplit[0]];
	if (keySplit.length > 1) {
		return getValuefromObjectString(result, keySplit.slice(1).join('.'));
	}
	return result;
};
// Replace Image
const convertImgToSVG = async (imageLink) => {
	const res = await axios.get(imageLink);
	return res.data;
};
// Timer
const timer = () => {
	switch (timerMode) {
		case timerModeEnums.NONE:
		case timerModeEnums['0']: {
			// jquery
			$('#preview_time').text('­'); // clear
			break; //not set;
		}
		case timerModeEnums.APP_START:
		case timerModeEnums['1']: {
			// App start
			const t = Date.now() - startAppTimestamp;
			const hours = Math.floor(t / 3600000) % 24;
			const minutes = '0' + (Math.floor(t / 60000) % 60);
			const seconds = '0' + (Math.floor(t / 1000) % 60);
			const time = hours
				? hours + ':' + minutes.slice(-2) + ':' + seconds.slice(-2)
				: minutes.slice(-2) + ':' + seconds.slice(-2);
			$('#preview_time').text(
				`${time} ${getValuefromObjectString(
					languageObj.html,
					'preview.time',
				)}`,
			);
            break;
		}
        case timerModeEnums.RPC_UPDATE:
		case timerModeEnums['2']: {
			// RPC Update
			const t = Date.now() - lastUpdateTime;
			const hours = Math.floor(t / 3600000) % 24;
			const minutes = '0' + (Math.floor(t / 60000) % 60);
			const seconds = '0' + (Math.floor(t / 1000) % 60);
			const time = hours
				? hours + ':' + minutes.slice(-2) + ':' + seconds.slice(-2)
				: minutes.slice(-2) + ':' + seconds.slice(-2);
			$('#preview_time').text(
				`${time} ${getValuefromObjectString(
					languageObj.html,
					'preview.time',
				)}`,
			);
            break;
		}
        case timerModeEnums.LOCAL_TIME:
        case timerModeEnums['3']: {
			const t = new Date();
			const hours = t.getHours() ? t.getHours().toString() : null;
			const minutes = '0' + t.getMinutes().toString();
			const seconds = '0' + t.getSeconds().toString();
			const time = hours
				? hours + ':' + minutes.slice(-2) + ':' + seconds.slice(-2)
				: minutes.slice(-2) + ':' + seconds.slice(-2);
			$('#preview_time').text(
				`${time} ${getValuefromObjectString(
					languageObj.html,
					'preview.time',
				)}`,
			);
            break;
        }
        case timerModeEnums.CUSTOM:
        case timerModeEnums['4']: {
            //
            break;
        }
	}
    setTimeout(timer, 1000);
};
// Tab
const tab = () => {
	      var el = document.querySelector('.chrome-tabs');
			var chromeTabs = new ChromeTabs();

			chromeTabs.init(el);

			el.addEventListener('activeTabChange', ({ detail }) =>
				console.log('Active tab changed', detail.tabEl),
			);
			el.addEventListener('tabAdd', ({ detail }) =>
				console.log('Tab added', detail.tabEl),
			);
			el.addEventListener('tabRemove', ({ detail }) =>
				console.log('Tab removed', detail.tabEl),
			);

			document
				.querySelector('button[data-add-tab]')
				.addEventListener('click', (_) => {
					chromeTabs.addTab({
						title: 'New Tab',
						favicon: false,
					});
				});

			document
				.querySelector('button[data-add-background-tab]')
				.addEventListener('click', (_) => {
					chromeTabs.addTab(
						{
							title: 'New Tab',
							favicon: false,
						},
						{
							background: true,
						},
					);
				});

			document
				.querySelector('button[data-remove-tab]')
				.addEventListener('click', (_) => {
					chromeTabs.removeTab(chromeTabs.activeTabEl);
				});

			document
				.querySelector('button[data-theme-toggle]')
				.addEventListener('click', (_) => {
					if (el.classList.contains('chrome-tabs-dark-theme')) {
						document.documentElement.classList.remove('dark-theme');
						el.classList.remove('chrome-tabs-dark-theme');
					} else {
						document.documentElement.classList.add('dark-theme');
						el.classList.add('chrome-tabs-dark-theme');
					}
				});

			window.addEventListener('keydown', (event) => {
				if (event.ctrlKey && event.key === 't') {
					chromeTabs.addTab({
						title: 'New Tab',
						favicon: false,
					});
				}
			});
}
// Ready event
$(document).ready(async () => {
	// await replaceAll();
    // timer();
	tab();
});
