import EventEmitter, { EventEmitter as EventEmitter$1 } from 'events';
import net from 'net';

interface User {
    id: string;
    username?: string;
    discriminator?: string;
    global_name?: string;
    avatar: string | null;
    avatar_decoration: string | null;
    bot?: boolean;
    flags?: number;
    premium_type?: number;
}
type Snowflake = string;
interface Presence {
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
    buttons?: {
        label: string;
        url: string;
    }[];
    raw?: RawPresence;
}
interface RawPresence {
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
}

declare interface IPCTransport {
    on(event: 'open', listener: () => void): this;
    on(event: 'close', listener: (e: any) => void): this;
    on(event: 'message', listener: (data: any) => void): this;
    on(event: string, listener: Function): this;
}
declare class IPCTransport extends EventEmitter {
    client: RPCClient;
    socket: net.Socket | null;
    ipcId: number;
    _expecting: Map<any, any>;
    clientId: string;
    user: User;
    activity?: RawPresence;
    assets?: {
        id: string;
        type: number;
        name: string;
    }[];
    config?: {
        cdn_host: "cdn.discordapp.com";
        api_endpoint: "//discord.com/api" | "//ptb.discord.com/api" | "//canary.discord.com/api";
        environment: "production";
    };
    constructor(client: RPCClient);
    connect(ipcId?: number): Promise<void>;
    fetchAssets(): Promise<this>;
    parseImageAnyToAsset(image?: string): string | null;
    getActivity(): Presence | null;
    onClose(e: any): void;
    send(data: object | string, op?: number): void;
    close(): Promise<void>;
    ping(): void;
    setActivity(args: Presence, pid?: number): Promise<RawPresence>;
    clearActivity(pid?: number): Promise<any>;
}

declare interface RPCClient {
    on(event: 'ready', listener: (transport: IPCTransport) => void): this;
    on(event: 'connected', listener: (transport: IPCTransport) => void): this;
    on(event: 'disconnected', listener: (transport: IPCTransport) => void): this;
    on(event: string, listener: Function): this;
}
declare class RPCClient extends EventEmitter$1 {
    transports: Map<number, IPCTransport>;
    constructor();
    connect(clientId: Snowflake, id?: number | undefined): Promise<IPCTransport>;
    login({ clientId, ipcId }?: {
        clientId: Snowflake;
        ipcId?: number | undefined;
    }): Promise<IPCTransport>;
    private request;
    setActivity(args?: Presence, pid?: number | null, ipcId?: number): Promise<RawPresence>;
    clearActivity(pid?: number | null, ipcId?: number): Promise<any>;
    destroy(): Promise<void>;
    fetchOpenSocket(): Promise<number[]>;
}

export { RPCClient as Client, RPCClient as default };
