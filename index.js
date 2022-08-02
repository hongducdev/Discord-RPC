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
let newProfileName = 'New Profile';
let activeProfile = 0;
var settingData = null;
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
// by hongduccodedao
const handlerProfileClick = () => {
    const addProfile = $('.profile-plus');
    const save = $('.saved');
    const profileControl = $('.profile-control');
    const profileEdit = $('.profile-edit');
    const addProfileF = () => {
        const profileList = $('.profile-list');
        const li = document.createElement('li');
        li.classList.add('profile');
        li.id = `profile-${profileList['0'].children.length}`;
        li.innerHTML = newProfileName[0];
        // check
        if (profileList['0'].children.length == 9) {
            return alert('ERROR\n' + getValuefromObjectString(languageObj.html, 'error.maxprofiles'));
        }
        profileList.append(li);
    }
    addProfile.click(() => {
        addProfileF();
        profileControl.css('width', save.width() - profileEdit.width());
        console.log(profileControl.width());
    });
}
// load Profile


// Socket
const socket = io();
socket.on('ready', () => {
    console.log('Connect WS');
    socket.emit('getSaveData');
});
// receive data
socket.on('saveData', (data) => {
    console.log(data);
    settingData = data;
});

// Update and create Profile
const updateSetting = (profileSelect = 0) => {
    //
}

const modalSetting = () => {
	const iconSetting = $('.icon__setting');
	const overlay = $('.overlay');
	const modal = $('.modal__setting');
	const modalClose = $('.modal__control__close');

	iconSetting.click(() => {
		overlay.css('display', 'block');
		modal.css('display', 'block');
	})

	modalClose.click(() => {
		overlay.css('display', 'none');
		modal.css('display', 'none');
	});
}

// Ready event
$(document).ready(async () => {
	await replaceAll();
    timer();
    handlerProfileClick();
	modalSetting();
});