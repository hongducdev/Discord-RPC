export interface User {
    id: string;
    username?: string;
    discriminator?: string;
    global_name?: string;
    avatar: string | null;
    avatar_decoration: string | null;
    bot?: boolean;
    flags?: number;
    premium_type?: number;
};

export type Snowflake = string;

export interface Presence {
	state?: string;
	details?: string;
	startTimestamp?: number | Date;
	endTimestamp?: number | Date;
	largeImageKey?: string | null;
	largeImageText?: string;
	smallImageKey?: string | null;
	smallImageText?: string;
	instance?: boolean;
	partyId?: string;
	partySize?: number;
	partyMax?: number;
	matchSecret?: string;
	spectateSecret?: string;
	joinSecret?: string;
	buttons?: { label: string; url: string }[];
}

export interface RawPresence {
	state?: string;
	details?: string;
    url?: string;
	timestamps?: {
		start?: number;
		end?: number;
	};
	assets?: {
		large_image?: string;
		large_text?: string;
		small_image?: string;
		small_text?: string;
	};
	party?: {
		id?: string;
		size?: number[];
	};
	buttons?: string[];
	name: string;
	application_id: string;
	flags?: number;
	type: 0;
	metadata?: {
		button_urls?: string[];
	};
};