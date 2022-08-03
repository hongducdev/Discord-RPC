console.log('Back-end by aiko-chan-ai');
const startAppTimestamp = Date.now();
let lastUpdateTime = Date.now();
let timerMode = 0;
let timestampSet = null;
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
};
const modeLoginEnums = {
	1: 'APP',
	2: 'SELFBOT',
	APP: 1,
	SELFBOT: 2,
};
let newProfileName = 'New Profile';
let activeProfile = 0;
var settingData = null;
var loginMode = null;
var isLogin = false;
var buttonMetadata = [];
var activeProfileData;
var languageSetting = null;
var allLanguage = [];
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
	if (typeof result === 'string') {
		return result;
	} else if (Array.isArray(result)) {
		return result[Math.floor(Math.random() * result.length)];
	}
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
			timestampSet = null;
			// jquery
			$('#preview_time').text('­'); // clear
			$('#rpc-timetitle').text(
				getValuefromObjectString(
					languageObj.html,
					'rpc.time.options.off',
				),
			);
			$('#rpc-time-custom').val('');
			$('#rpc-time-custom').attr('disabled', true);
			break; //not set;
		}
		case timerModeEnums.APP_START:
		case timerModeEnums['1']: {
			// App start
			const t = Date.now() - startAppTimestamp;
			timestampSet = startAppTimestamp;
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
			$('#rpc-timetitle').text(
				getValuefromObjectString(
					languageObj.html,
					'rpc.time.options.app',
				),
			);
			$('#rpc-time-custom').val('');
			$('#rpc-time-custom').attr('disabled', true);
			break;
		}
		case timerModeEnums.RPC_UPDATE:
		case timerModeEnums['2']: {
			// RPC Update
			const t = Date.now() - lastUpdateTime;
			timestampSet = lastUpdateTime;
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
			$('#rpc-timetitle').text(
				getValuefromObjectString(
					languageObj.html,
					'rpc.time.options.update',
				),
			);
			$('#rpc-time-custom').val('');
			$('#rpc-time-custom').attr('disabled', true);
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
			t.setHours(0, 0, 0, 0);
			timestampSet = t.getTime();
			$('#rpc-timetitle').text(
				getValuefromObjectString(
					languageObj.html,
					'rpc.time.options.local',
				),
			);
			$('#rpc-time-custom').val('');
			$('#rpc-time-custom').attr('disabled', true);
			break;
		}
		case timerModeEnums.CUSTOM:
		case timerModeEnums['4']: {
			$('#rpc-timetitle').text(
				getValuefromObjectString(
					languageObj.html,
					'rpc.time.options.custom',
				),
			);
			$('#rpc-time-custom').removeAttr('disabled');
			const t =
				Date.now() -
				new Date(
					$('#rpc-time-custom').val() || new Date().toISOString(),
				).getTime();
			timestampSet = new Date(
				$('#rpc-time-custom').val() || new Date().toISOString(),
			).getTime();
			if (t < 0) {
				$('#preview_time').text(
					`00:00 ${getValuefromObjectString(
						languageObj.html,
						'preview.time',
					)}`,
				);
			} else {
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
			}
			break;
		}
	}
	setTimeout(timer, 1000);
};
//
const getProfile = () => {
	const profileName =
		$('#profile-name').val().length > 0
			? $('#profile-name').val()
			: newProfileName;
	$(`profile-${activeProfile}`).text(profileName[0]);
	return Object.assign(settingData.profile[activeProfile], {
		profile: profileName,
		name: $('#rpc-name').val(),
		application_id: /\d{17,19}/.test($('#profile-input').val())
			? $('#profile-input').val()
			: $('#rpc-appid').val(),
		state: $('#rpc-state').val(),
		details: $('#rpc-details').val(),
		party: {
			min: $('#rpc-party-min').val(),
			max: $('#rpc-party-max').val(),
		},
		timestamps: timestampSet,
		assets: {
			large_text: $('#Large-image-text').val(),
			large_image: $('#Large-image-url').val(),
			small_text: $('#small-image-text').val(),
			small_image: $('#small-image-url').val(),
		},
		buttons: [
			{
				url: $('#switch')[0].checked
					? $('#btn-1-url').val()
					: undefined,
				text: $('#switch')[0].checked
					? $('#btn-1-text').val()
					: undefined,
			},
			{
				url: $('#switch-2')[0].checked
					? $('#btn-2-url').val()
					: undefined,
				text: $('#switch-2')[0].checked
					? $('#btn-2-text').val()
					: undefined,
			},
		],
		token: /\d{17,19}/g.test($('#rpc-token').val())
			? $('#rpc-token').val()
			: settingData.profile[activeProfile].token,
	});
};
// by hongduccodedao
let addProfileF;
const handlerProfileClick = () => {
	const addProfile = $('.profile-plus');
	const deleteProfile = $('.del-profile');
	const saveProfile = $('.save-profile');
	const save = $('.saved');
	const profileControl = $('.profile-control');
	const profileEdit = $('.profile-edit');
	addProfileF = (data) => {
		const profileList = $('.profile-list');
		const li = document.createElement('li');
		li.classList.add('profile');
		li.id = `profile-${profileList['0'].children.length}`;
		li.innerHTML = data ? data.profile[0] : newProfileName[0];
		// check
		if (profileList['0'].children.length == 9) {
			return alert(
				'ERROR\n' +
					getValuefromObjectString(
						languageObj.html,
						'error.maxprofiles',
					),
			);
		}
		profileList.append(li);
		profileControl.css('width', save.width() - profileEdit.width());
		updatePreview({}, false);
	};
	addProfile.click(() => {
		addProfileF();
		console.log(profileControl.width());
	});
	// Click Profile
	$('#profile-list').on('click', '.profile', function (event) {
		console.log('clicked', event);
		event.preventDefault();
		const id = $(this).attr('id');
		console.log(id);
		loadProfile(id.replace('profile-', ''));
	});
	// Delete Profile
	deleteProfile.click(() => {
		// Get Current Profile
		const currentProfile = $('.profile-list li.active');
		// ID
		const id = currentProfile.attr('id');
		//
		const msg = getValuefromObjectString(
			languageObj.html,
			'confirm.delete',
		);
		//
		if (confirm(msg)) {
			console.time('time-remove');
			// remove from array data
			console.log(id);
			settingData.profile.splice(id.replace('profile-', ''), 1);
			//
			currentProfile.remove();
			// Update ID
			$('.profile').each((index, element) => {
				$(element).attr('id', `profile-${index}`);
			});
			// if 1 profile
			const profileList = $('.profile-list');
			// check
			if (profileList['0'].children.length == 0) {
				addProfile.trigger('click');
			}
			// Update Active Profile
			$('.profile').removeClass('active');
			$('.profile').first().addClass('active');
			// Update Profile Control
			profileControl.css('width', save.width() - profileEdit.width());
			console.log(profileControl.width());
			// Alert
			console.timeEnd('time-remove');
			setTimeout(() => {
				alert(
					getValuefromObjectString(
						languageObj.html,
						'confirm.deleted',
					),
				);
			}, 50);
			// Load first profile
			loadProfile(0);
		} else {
			return;
		}
	});
	//
	saveProfile.click(() => {
		settingData.profile[activeProfile] = getProfile();
		socket.emit('saveProfile', settingData);
	});
};
// load Profile
// Update and create Profile
const loadProfile = (profileSelect = 0) => {
	activeProfile = profileSelect;
	// find all element startwith id profile-
	const profileList = $('li[id^="profile-"]');
	// edit all profile
	profileList.attr('class', 'profile');
	// select profile
	const profileSelected = $(`#profile-${profileSelect}`);
	// edit attribute
	profileSelected.attr('class', 'profile active');
	//
	loadSettingOneProfile(settingData.profile[activeProfile]);
};
// Load Setting
const loadSettingOneProfile = (rawData) => {
	if (!rawData)
		rawData = {
			profile: '',
			name: '',
			type: '',
			application_id: '',
			url: '',
			state: '',
			details: '',
			party: {},
			timestamps: 0,
			assets: {},
			buttons: [],
			mode: 1,
			token: '',
		};
	// Add to Array
	settingData.profile[activeProfile] = rawData;
	// Login Mode
	const loginMode = rawData.mode;
	switch (loginMode) {
		case modeLoginEnums.APP: {
			$('#profile-login-app').trigger('click');
			break;
		}
		case modeLoginEnums.SELFBOT: {
			$('#profile-login-sb').trigger('click');
			break;
		}
	}
	// Input name
	$('#profile-name').val(rawData.profile || newProfileName);
	// Name
	$(`profile-${activeProfile}`).text(rawData.profile[0] || newProfileName[0]);
	// Application Name
	if (!isLogin) {
		loginMode == modeLoginEnums.SELFBOT
			? $('#rpc-name')
					.val(rawData.name)
					.attr('required', true)
					.removeAttr('disabled') &&
			  $('#rpc-appid')
					.val(rawData.application_id)
					.attr('required', true)
					.removeAttr('disabled') &&
			  $('#profile-login-sb').trigger('click')
			: $('#rpc-name')
					.val('')
					.attr('required', false)
					.attr('disabled', true) &&
			  $('#rpc-appid')
					.val('')
					.attr('required', false)
					.attr('disabled', true) &&
			  $('#profile-login-app').trigger('click');
	}
	// Details
	$('#rpc-details').val(rawData.details);
	// state
	$('#rpc-state').val(rawData.state);
	// Party
	const minP = rawData.party.min ?? 0;
	const maxP = (rawData.party.max ?? 0) >= minP ? rawData.party.max : 0;
	$('#rpc-party-min').val(minP);
	$('#rpc-party-max').val(maxP);
	// Assets
	const assets = rawData.assets;
	// large
	$('#Large-image-text').val(assets.large_text);
	$('#Large-image-url').val(assets.large_image);
	// small
	$('#small-image-text').val(assets.small_text);
	$('#small-image-url').val(assets.small_image);
	// Button
	if (rawData.buttons.length > 0) {
		$('#switch').prop('checked', true);
		$('#switch-2').prop('checked', false);
		// URL + title
		const button1 = rawData.buttons[0];
		$('#btn-1-url').val(button1.url);
		$('#btn-1-text').val(button1.label);
		if (rawData.buttons.length > 1) {
			$('#switch-2').prop('checked', true);
			const button2 = rawData.buttons[1];
			$('#btn-2-url').val(button2.url);
			$('#btn-2-text').val(button2.label);
		}
	}
};

const updateData = () => {
	activeProfileData = Object.assign(settingData.profile[activeProfile], {
		profile: $('#profile-name').val(),
		name: $('#rpc-name').val(),
		application_id: /\d{17,19}/.test($('#profile-input').val())
			? $('#profile-input').val()
			: $('#rpc-appid').val(),
		state: $('#rpc-state').val(),
		details: $('#rpc-details').val(),
		party: {
			min: $('#rpc-party-min').val(),
			max: $('#rpc-party-max').val(),
		},
		timestamps: timestampSet,
		assets: {
			large_text: $('#Large-image-text').val(),
			large_image: $('#Large-image-url').val(),
			small_text: $('#small-image-text').val(),
			small_image: $('#small-image-url').val(),
		},
		buttons: [
			{
				url: $('#switch')[0].checked
					? $('#btn-1-url').val()
					: undefined,
				text: $('#switch')[0].checked
					? $('#btn-1-text').val()
					: undefined,
			},
			{
				url: $('#switch-2')[0].checked
					? $('#btn-2-url').val()
					: undefined,
				text: $('#switch-2')[0].checked
					? $('#btn-2-text').val()
					: undefined,
			},
		],
		token: /\d{17,19}/g.test($('#rpc-token').val())
			? $('#rpc-token').val()
			: settingData.profile[activeProfile].token,
	});
	console.log('update', activeProfileData);
	socket.emit('update', {
		mode: loginMode,
		data: activeProfileData,
	});
};
//
const updatePreview = (data, rpc = true) => {
	console.log('update preview', data);
	// App id
	const appId = data.application_id;
	$('#rpc-appid').val(appId);
	// App name
	$('#rpc-name').val(data.name);
	// Details
	$('#rpc-details').val(data.details);
	// State
	$('#rpc-state').val(data.state);
	// timestamp
	// party
	$('#rpc-party-min').val(data.party?.size[0] || '');
	$('#rpc-party-max').val(data.party?.size[1] || '');
	// Assets
	const assets = data.assets || {};
	// large
	$('#Large-image-text').val(assets.large_text);
	if (!assets.large_image) $('#Large-image-url').val('');
	// small
	$('#small-image-text').val(assets.small_text);
	if (!assets.small_image) $('#small-image-url').val('');
	//
	// Button
	const buttons = data.buttons || [];
	buttonMetadata = data.metadata?.button_urls || [];
	if (rpc) {
		$('#preview-name').text(data.name);
		$('#preview-details').text(data.details);
		$('#preview-state').text(
			`${data.state} ${
				data.party?.size[0]
					? `(${data.party.size[0]} ${getValuefromObjectString(
							languageObj.html,
							'rpc.party.of',
					  )} ${data.party.size[1]})`
					: ''
			}`,
		);
		$('#preview-asset-small-text').text(assets.small_text || '');
		$('#preview-asset-small-image').attr(
			'src',
			convertImageStrToURL(data.application_id, assets.small_image),
		);
		$('#preview-asset-large-image').attr(
			'src',
			convertImageStrToURL(data.application_id, assets.large_image),
		);
		$('#preview-asset-large-text').text(assets.large_text || '');
		//
		if (buttons[0]) {
			$('#preview-btn-1').text(buttons[0]);
			$('#preview-btn-1').removeClass('hidden');
		} else {
			$('#preview-btn-1').addClass('hidden');
		}
		if (buttons[1]) {
			$('#preview-btn-2').text(buttons[1]);
			$('#preview-btn-2').removeClass('hidden');
		} else {
			$('#preview-btn-2').addClass('hidden');
		}
	}
	if (buttons[0]) {
		$('#switch')[0].checked = true;
		$('#btn-1-url').val(buttons[0]);
		$('#btn-1-text').val(buttonMetadata[0]);
	} else {
		$('#switch')[0].checked = false;
	}
	if (buttons[1]) {
		$('#switch-2')[0].checked = true;
		$('#btn-2-url').val(buttons[1]);
		$('#btn-2-text').val(buttonMetadata[1]);
	} else {
		$('#switch-2')[0].checked = false;
	}
};
const buttonClick = () => {
	const btn1 = $('#preview-btn-1');
	const btn2 = $('#preview-btn-2');
	btn1.click(() => {
		buttonMetadata[0] ? alert(`URL: ${buttonMetadata[0]}`) : null;
	});
	btn2.click(() => {
		buttonMetadata[1] ? alert(`URL: ${buttonMetadata[1]}`) : null;
	});
};
const presenceHandler = () => {
	// Button Update
	$('#rpc-update').click(() => {
		if (!isLogin) {
			return alert(
				getValuefromObjectString(languageObj.html, 'error.login'),
			);
		}
		updateData();
	});
	$('#rpc-stop').click(() => {
		if (!isLogin) {
			return alert(
				getValuefromObjectString(languageObj.html, 'error.login'),
			);
		}
		console.log('stop');
		socket.emit('stop', {
			mode: loginMode,
		});
	});
};
const convertImageStrToURL = (botId, str = '') => {
	if (/\d{17,19}/.test(str)) {
		return `https://cdn.discordapp.com/app-assets/${botId}/${str}.png`;
	} else if (str.startsWith('mp:external')) {
		return (
			`https://${str.split('https/')[1]}` ||
			`http://${str.split('http/')[1]}`
		);
	} else {
		return 'https://cdn.discordapp.com/attachments/820557032016969751/1003645431261180017/unknown.png';
	}
};
const loadAssetsFromID = async (botId) => {
	const res = await axios.get(
		`https://discord.com/api/v9/oauth2/applications/${botId}/assets`,
	);
	const assets = res.data.map((asset) => `<option value="${asset.name}">`);
	document.getElementById('assets').innerHTML = assets.join('\n');
};
const loadLangs = async () => {
	const res = await axios.get(
		`${document.URL.replace('/rpc', '/language.json')}`,
	);
	allLanguage = res.data;
	const langs = res.data.map(
		(lang) =>
			`<div class="dropdown-list__item dropdown-list__item-language" id="${lang.lang_code}">${lang.local_name}</div>`,
	);
	document.getElementById('list-language').innerHTML = langs.join('\n');
};
const checkURL = (url) => {
	try {
		new URL(url);
	} catch (_) {
		return false;
	}
	return true;
};
// Button Login Event
const buttonLoginEvent = () => {
	const input = $('#profile-input');
	input.attr(
		'title',
		getValuefromObjectString(
			languageObj.html,
			'error.profile_login_valid_all',
		),
	);
	const buttonLoginAppID = $('#profile-login-app');
	const buttonLoginSbToken = $('#profile-login-sb');
	buttonLoginAppID.click(() => {
		if (isLogin) return;
		const appId = settingData.profile[activeProfile].application_id;
		// Replace Title
		$('#profile-modelogin').text(
			`${getValuefromObjectString(languageObj.html, 'login.app')}`,
		);
		// Replace Value
		input.val(appId || '');
		//
		loginMode = 1;
		//
		input.removeAttr('disabled');
		input.attr('type', 'number');
		input.attr('max', '19');
		input.attr('min', '17');
		input.attr('pattern', '\\d{17,19}');
		//
		input.attr('placeholder', 'ID');
		//
		input.change();
		// lock
		$('#rpc-name').val('').attr('required', false).attr('disabled', true);
		$('#rpc-appid').val('').attr('required', false).attr('disabled', true);
	});
	buttonLoginSbToken.click(() => {
		if (isLogin) return;
		const token = settingData.profile[activeProfile].token;
		// Replace Title
		$('#profile-modelogin').text(
			`${getValuefromObjectString(languageObj.html, 'login.self')}`,
		);
		// Replace Value
		input.val(token || '');
		//
		loginMode = 2;
		//
		input.removeAttr('disabled');
		input.attr('type', 'password');
		input.attr('min', '59');
		input.attr('pattern', '[\\w-]{24}\\.[\\w-]{6}\\.[\\w-]{27,}');
		//
		input.attr('placeholder', 'Token');
		//
		input.change();
		// unlock
		$('#rpc-name')
			.val(settingData.profile[activeProfile].name)
			.attr('required', true)
			.removeAttr('disabled');
		// application id
		$('#rpc-appid')
			.val(settingData.profile[activeProfile].application_id)
			.attr('required', true)
			.removeAttr('disabled');
	});
	// Login
	const login = $('#rpc-login');
	//
	login.click(() => {
		console.log('click login', input.val());
		if (!isLogin) {
			if (!input.val()) {
				return alert(
					getValuefromObjectString(
						languageObj.html,
						loginMode == 1
							? 'error.profile_login_valid_id'
							: 'error.profile_login_valid_token',
					),
				);
			} else if (loginMode == 1 && !/\d{17,19}/.test(input.val())) {
				return alert(
					getValuefromObjectString(
						languageObj.html,
						'error.profile_login_valid_id',
					),
				);
			} else if (
				loginMode == 2 &&
				!/[\w-]{24}\.[\w-]{6}\.[\w-]{27,}/.test(input.val())
			) {
				return alert(
					getValuefromObjectString(
						languageObj.html,
						'error.profile_login_valid_token',
					),
				);
			}
			// Lock all
			$('#setting-login').attr('disabled', true);
			//
			$('#profile-input').attr('disabled', true);
			// Add class disable
			$('#dropdown-login').addClass('disable');
			// Disable button
			// Send Login
			socket.emit('login', {
				mode: loginMode,
				id: input.val(),
			});
		} else if (
			confirm(
				getValuefromObjectString(languageObj.html, 'confirm.logout'),
			)
		) {
			// Logout
			$('#setting-login').attr('disabled', true);
			//
			$('#profile-input').attr('disabled', true);
			// Add class disable
			$('#dropdown-login').addClass('disable');
			// Disable button
			// Send
			socket.emit('logout');
		}
	});
};
// Button Time Event
const buttonTimeEvent = () => {
	const time0 = $('#rpc-time0');
	const time1 = $('#rpc-time1');
	const time2 = $('#rpc-time2');
	const time3 = $('#rpc-time3');
	const time4 = $('#rpc-time4');
	//
	time0.click(() => {
		timerMode = 0;
	});
	time1.click(() => {
		timerMode = 1;
	});
	time2.click(() => {
		timerMode = 2;
	});
	time3.click(() => {
		timerMode = 3;
	});
	time4.click(() => {
		timerMode = 4;
	});
};
// Add all profile
const addProfile = () => {
	if (settingData.profile.length == 0) addProfileF();
	else {
		for (const data of settingData.profile || []) {
			addProfileF(data);
		}
	}
};
// Modal
const modalSetting = () => {
	const iconSetting = $('.icon__setting');
	const overlay = $('.overlay');
	const modal = $('#modal_setting');
	const modalClose = $('#modal_setting_close');
	const saveButton = $('#modal_setting_save');
	$('#list-language').on(
		'click',
		'.dropdown-list__item-language',
		function (event) {
			console.log('clicked language', event);
			event.preventDefault();
			const id = $(this).attr('id');
			console.log(id);
			languageSetting = id;
			// Edit
			$(`#title-lang`).text($(`#${id}`).text());
		},
	);
	overlay.css('display', 'none');
	modal.css('display', 'none');
	iconSetting.click(() => {
		overlay.css('display', 'block');
		modal.css('display', 'block');
	});

	modalClose.click(() => {
		overlay.css('display', 'none');
		modal.css('display', 'none');
	});

	saveButton.click(() => {
		if (!languageSetting) {
			modalClose.trigger('click');
		} else {
			socket.emit('saveProfile', {
				language: languageSetting,
			});
			setTimeout(() => {
				alert(
					allLanguage.find((obj) => obj.lang_code == languageSetting)
						.change_notif,
				);
				socket.emit('restart');
			}, 1000);
		}
	});
};
const modalGithub = () => {
	const iconSetting = $('.icon__github');
	const overlay = $('.overlay');
	const modal = $('#modal_github');
	const modalClose = $('#modal_github_close');
	overlay.css('display', 'none');
	modal.css('display', 'none');
	iconSetting.click(() => {
		overlay.css('display', 'block');
		modal.css('display', 'block');
	});

	modalClose.click(() => {
		overlay.css('display', 'none');
		modal.css('display', 'none');
	});
};
const modalDiscord = () => {
	const iconSetting = $('.icon__discord');
	const overlay = $('.overlay');
	const modal = $('#modal_discord');
	const modalClose = $('#modal_discord_close');
	overlay.css('display', 'none');
	modal.css('display', 'none');
	iconSetting.click(() => {
		overlay.css('display', 'block');
		modal.css('display', 'block');
	});

	modalClose.click(() => {
		overlay.css('display', 'none');
		modal.css('display', 'none');
	});
};
// Ready event
$(document).ready(async () => {
	socket.emit('getLang');
});

//
const testNoInternet = () => {
	window.dispatchEvent(new Event('offline'));
};
//
window.addEventListener('offline', function () {
	console.log('Redirect ...');
	window.location.href = `${document.URL.replace('/rpc', '/dino')}`;
});
//
const resetPreview = (logout = false) => {
	if (logout) {
		$('#preview-username').text('Discord');
		$('#preview-tag').text(`#0000`);
		$('#preview-avatar').attr(
			'src',
			`https://cdn.discordapp.com/embed/avatars/0.png`,
		);
	}
	$('#preview-name').text('Visual Studio Code');
	$('#preview-details').text('Edit client.js');
	$('#preview-state').text('Workspace: NyanRPC');
};

// Socket
const socket = io();
socket.on('ready', () => {
	console.log('Connect WS');
	socket.emit('getSaveData');
});
socket.on('getLang', async (langCode) => {
	await replaceAll(langCode);
	timer();
	buttonTimeEvent();
	handlerProfileClick();
	buttonLoginEvent();
	addProfile();
	loadProfile(0);
	presenceHandler();
	buttonClick();
	modalDiscord();
	modalGithub();
	modalSetting();
	await loadLangs();
});
// receive data
socket.on('saveData', (data) => {
	console.log(data);
	settingData = data;
});
socket.on('saveProfile', () =>
	alert(getValuefromObjectString(languageObj.html, 'success.save')),
);
// Login
socket.on('login', (data) => {
	console.log(data);
	// Update Preview
	$('#preview-username').text(data.username);
	$('#preview-tag').text(`#${data.discriminator}`);
	$('#preview-avatar').attr(
		'src',
		`https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.${
			data.avatar.startsWith('a_') ? 'gif' : 'png'
		}?size=1024`,
	);
	//
	isLogin = true;
	// rename button
	$('#rpc-login').text(
		getValuefromObjectString(languageObj.html, 'login.logout'),
	);
	// unlock
	$('#setting-login').removeAttr('disabled');
	if (loginMode == 1) {
		loadAssetsFromID($('#profile-input').val());
	} else {
		document.getElementById('assets').innerHTML = '';
	}
});

socket.on('logout', () => {
	console.log('Logout');
	// Update Preview
	resetPreview(true);
	//
	isLogin = false;
	// rename button
	$('#rpc-login').text(
		getValuefromObjectString(languageObj.html, 'login.login'),
	);
	// unlock
	$('#setting-login').removeAttr('disabled');
	// Logout
	$('#profile-input').removeAttr('disabled');
	// Add class disable
	$('#dropdown-login').removeClass('disable');
});

socket.on('update', (data) => {
	lastUpdateTime = Date.now();
	console.log('Update receive', data);
	updatePreview(data);
});

socket.on('stop', () => {
	// Clear Presence
	// Update Preview
	resetPreview(false);
	alert(getValuefromObjectString(languageObj.html, 'success.stop'));
});

socket.on('error', (data) => {
	console.log(data);
	alert(`RPC Error:\n${data}`);
	if (!isLogin) {
		// Update Preview
		resetPreview(true);
		// rename button
		$('#rpc-login').text(
			getValuefromObjectString(languageObj.html, 'login.login'),
		);
		// unlock
		$('#setting-login').removeAttr('disabled');
		// Logout
		$('#profile-input').removeAttr('disabled');
		// Add class disable
		$('#dropdown-login').removeClass('disable');
	}
});
