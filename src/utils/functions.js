/* global BigInt */

export const avatarURL = (user) => {
	return user?.avatar
		? `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.${
				user?.avatar.startsWith('a_') ? 'gif' : 'png'
		  }?size=1024`
		: `https://cdn.discordapp.com/embed/avatars/${
				parseInt(user?.discriminator) === 0
					? BigInt(user?.id >> 22n) % 6
					: parseInt(user?.discriminator) % 5
		  }.png`;
};

export const parseImageDataToURL = (imageData, applicationId) => {
	if (imageData?.includes(':')) {
		const [platform, id] = imageData.split(':');
		switch (platform) {
			case 'mp':
				return `https://media.discordapp.net/${id}`;
			case 'spotify':
				return `https://i.scdn.co/image/${id}`;
			case 'youtube':
				return `https://i.ytimg.com/vi/${id}/hqdefault_live.jpg`;
			case 'twitch':
				return `https://static-cdn.jtvnw.net/previews-ttv/live_user_${id}.png`;
			default:
				return null;
		}
	}
	if (/\d{17,19}/.test(imageData ?? '')) {
		return `https://cdn.discordapp.com/app-assets/${applicationId}/${imageData}.png?size=512`;
	}
	return null;
};
