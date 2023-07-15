/* eslint-disable no-undef */
class BitField {
  /**
   * @param {BitFieldResolvable} [bits=this.constructor.defaultBit] Bit(s) to read from
   */
  constructor(bits = this.constructor.defaultBit) {
    /**
     * Bitfield of the packed bits
     * @type {number|bigint}
     */
    this.bitfield = this.constructor.resolve(bits);
  }

  /**
   * Checks whether the bitfield has a bit, or any of multiple bits.
   * @param {BitFieldResolvable} bit Bit(s) to check for
   * @returns {boolean}
   */
  any(bit) {
    return (
      (this.bitfield & this.constructor.resolve(bit)) !==
      this.constructor.defaultBit
    );
  }

  /**
   * Checks if this bitfield equals another
   * @param {BitFieldResolvable} bit Bit(s) to check for
   * @returns {boolean}
   */
  equals(bit) {
    return this.bitfield === this.constructor.resolve(bit);
  }

  /**
   * Checks whether the bitfield has a bit, or multiple bits.
   * @param {BitFieldResolvable} bit Bit(s) to check for
   * @returns {boolean}
   */
  has(bit) {
    bit = this.constructor.resolve(bit);
    return (this.bitfield & bit) === bit;
  }

  /**
   * Gets all given bits that are missing from the bitfield.
   * @param {BitFieldResolvable} bits Bit(s) to check for
   * @param {...*} hasParams Additional parameters for the has method, if any
   * @returns {string[]}
   */
  missing(bits, ...hasParams) {
    return new this.constructor(bits).remove(this).toArray(...hasParams);
  }

  /**
   * Freezes these bits, making them immutable.
   * @returns {Readonly<BitField>}
   */
  freeze() {
    return Object.freeze(this);
  }

  /**
   * Adds bits to these ones.
   * @param {...BitFieldResolvable} [bits] Bits to add
   * @returns {BitField} These bits or new BitField if the instance is frozen.
   */
  add(...bits) {
    let total = this.constructor.defaultBit;
    for (const bit of bits) {
      total |= this.constructor.resolve(bit);
    }
    if (Object.isFrozen(this))
      return new this.constructor(this.bitfield | total);
    this.bitfield |= total;
    return this;
  }

  /**
   * Removes bits from these.
   * @param {...BitFieldResolvable} [bits] Bits to remove
   * @returns {BitField} These bits or new BitField if the instance is frozen.
   */
  remove(...bits) {
    let total = this.constructor.defaultBit;
    for (const bit of bits) {
      total |= this.constructor.resolve(bit);
    }
    if (Object.isFrozen(this))
      return new this.constructor(this.bitfield & ~total);
    this.bitfield &= ~total;
    return this;
  }

  /**
   * Gets an object mapping field names to a {@link boolean} indicating whether the
   * bit is available.
   * @param {...*} hasParams Additional parameters for the has method, if any
   * @returns {Object}
   */
  serialize(...hasParams) {
    const serialized = {};
    for (const [flag, bit] of Object.entries(this.constructor.FLAGS))
      serialized[flag] = this.has(bit, ...hasParams);
    return serialized;
  }

  /**
   * Gets an {@link Array} of bitfield names based on the bits available.
   * @param {...*} hasParams Additional parameters for the has method, if any
   * @returns {string[]}
   */
  toArray(...hasParams) {
    return Object.keys(this.constructor.FLAGS).filter((bit) =>
      this.has(bit, ...hasParams)
    );
  }

  toJSON() {
    return typeof this.bitfield === "number"
      ? this.bitfield
      : this.bitfield.toString();
  }

  valueOf() {
    return this.bitfield;
  }

  *[Symbol.iterator]() {
    yield* this.toArray();
  }

  /**
   * Data that can be resolved to give a bitfield. This can be:
   * * A bit number (this can be a number literal or a value taken from {@link BitField.FLAGS})
   * * A string bit number
   * * An instance of BitField
   * * An Array of BitFieldResolvable
   * @typedef {number|string|bigint|BitField|BitFieldResolvable[]} BitFieldResolvable
   */

  /**
   * Resolves bitfields to their numeric form.
   * @param {BitFieldResolvable} [bit] bit(s) to resolve
   * @returns {number|bigint}
   */
  static resolve(bit) {
    const { defaultBit } = this;
    if (typeof defaultBit === typeof bit && bit >= defaultBit) return bit;
    if (bit instanceof BitField) return bit.bitfield;
    if (Array.isArray(bit))
      return bit
        .map((p) => this.resolve(p))
        .reduce((prev, p) => prev | p, defaultBit);
    if (typeof bit === "string") {
      if (!isNaN(bit))
        return typeof defaultBit === "bigint" ? BigInt(bit) : Number(bit);
      if (this.FLAGS[bit] !== undefined) return this.FLAGS[bit];
    }
    throw new RangeError("BITFIELD_INVALID", bit);
  }
}

/**
 * Numeric bitfield flags.
 * <info>Defined in extension classes</info>
 * @type {Object}
 * @abstract
 */
BitField.FLAGS = {};

/**
 * @type {number|bigint}
 * @private
 */
BitField.defaultBit = 0;

/**
 * Data structure that makes it easy to interact with a {@link User#flags} bitfield.
 * @extends {BitField}
 */
class UserFlags extends BitField {}

/**
 * @name UserFlags
 * @kind constructor
 * @memberof UserFlags
 * @param {BitFieldResolvable} [bits=0] Bit(s) to read from
 */

/**
 * Bitfield of the packed bits
 * @type {number}
 * @name UserFlags#bitfield
 */

/**
 * Numeric user flags. All available properties:
 * * `DISCORD_EMPLOYEE`
 * * `PARTNERED_SERVER_OWNER`
 * * `HYPESQUAD_EVENTS`
 * * `BUGHUNTER_LEVEL_1`
 * * `HOUSE_BRAVERY`
 * * `HOUSE_BRILLIANCE`
 * * `HOUSE_BALANCE`
 * * `EARLY_SUPPORTER`
 * * `TEAM_USER`
 * * `BUGHUNTER_LEVEL_2`
 * * `VERIFIED_BOT`
 * * `EARLY_VERIFIED_BOT_DEVELOPER`
 * * `DISCORD_CERTIFIED_MODERATOR`
 * * `BOT_HTTP_INTERACTIONS`
 * * `ACTIVE_DEVELOPER`
 * @type {Object}
 * @see {@link https://discord.com/developers/docs/resources/user#user-object-user-flags}
 */
UserFlags.FLAGS = {
  DISCORD_EMPLOYEE: 1 << 0,
  PARTNERED_SERVER_OWNER: 1 << 1,
  HYPESQUAD_EVENTS: 1 << 2,
  BUGHUNTER_LEVEL_1: 1 << 3,
  HOUSE_BRAVERY: 1 << 6,
  HOUSE_BRILLIANCE: 1 << 7,
  HOUSE_BALANCE: 1 << 8,
  EARLY_SUPPORTER: 1 << 9,
  TEAM_USER: 1 << 10,
  BUGHUNTER_LEVEL_2: 1 << 14,
  VERIFIED_BOT: 1 << 16,
  EARLY_VERIFIED_BOT_DEVELOPER: 1 << 17,
  DISCORD_CERTIFIED_MODERATOR: 1 << 18,
  BOT_HTTP_INTERACTIONS: 1 << 19,
  ACTIVE_DEVELOPER: 1 << 22,
};

const badges = {
  DISCORD_EMPLOYEE: {
    id: "staff",
    description: "Discord Staff",
    icon: "5e74e9b61934fc1f67c65515d1f7e60d",
    link: "https://discord.com/company",
  },
  PARTNERED_SERVER_OWNER: {
    id: "partner",
    description: "Partnered Server Owner",
    icon: "3f9748e53446a137a052f3454e2de41e",
    link: "https://discord.com/partners",
  },
  DISCORD_CERTIFIED_MODERATOR: {
    id: "certified_moderator",
    description: "Moderator Programs Alumni",
    icon: "fee1624003e2fee35cb398e125dc479b",
    link: "https://discord.com/safety",
  },
  HYPESQUAD_EVENTS: {
    id: "hypesquad",
    description: "HypeSquad Events",
    icon: "bf01d1073931f921909045f3a39fd264",
    link: "https://discord.com/hypesquad",
  },
  HOUSE_BRAVERY: {
    id: "hypesquad_house_1",
    description: "HypeSquad Bravery",
    icon: "8a88d63823d8a71cd5e390baa45efa02",
    link: "https://discord.com/settings/hypesquad-online",
  },
  HOUSE_BRILLIANCE: {
    id: "hypesquad_house_2",
    description: "HypeSquad Brilliance",
    icon: "011940fd013da3f7fb926e4a1cd2e618",
    link: "https://discord.com/settings/hypesquad-online",
  },
  HOUSE_BALANCE: {
    id: "hypesquad_house_3",
    description: "HypeSquad Balance",
    icon: "3aa41de486fa12454c3761e8e223442e",
    link: "https://discord.com/settings/hypesquad-online",
  },
  BUGHUNTER_LEVEL_1: {
    id: "bug_hunter_level_1",
    description: "Discord Bug Hunter",
    icon: "2717692c7dca7289b35297368a940dd0",
    link: "https://support.discord.com/hc/en-us/articles/360046057772-Discord-Bugs",
  },
  BUGHUNTER_LEVEL_2: {
    id: "bug_hunter_level_2",
    description: "Discord Bug Hunter",
    icon: "848f79194d4be5ff5f81505cbd0ce1e6",
    link: "https://support.discord.com/hc/en-us/articles/360046057772-Discord-Bugs",
  },
  ACTIVE_DEVELOPER: {
    id: "active_developer",
    description: "Active Developer",
    icon: "6bdc42827a38498929a4920da12695d9",
    link: "https://support-dev.discord.com/hc/en-us/articles/10113997751447?ref=badge",
  },
  EARLY_VERIFIED_BOT_DEVELOPER: {
    id: "verified_developer",
    description: "Early Verified Bot Developer",
    icon: "6df5892e0f35b051f8b61eace34f4967",
  },
  EARLY_SUPPORTER: {
    id: "early_supporter",
    description: "Early Supporter",
    icon: "7060786766c9c840eb3019e725d2b358",
    link: "https://discord.com/settings/premium",
  },

  // added
  NITRO: {
    id: "premium",
    description: "Subscriber since NaN",
    icon: "2ba85e8026a8614b640c2837bcdfe21b",
    link: "https://discord.com/settings/premium",
  },
  GUILD_BOOSTER: {
    id: "guild_booster_lvl9",
    description: "Server boosting since NaN",
    icon: "ec92202290b48d0879b7413d2dde3bab",
    link: "https://discord.com/settings/premium",
  },
  LEGACY_USERNAME: {
    id: "legacy_username",
    description: "Originally known as undefined#NaN",
    icon: "6de6d34650760ba5551a79732e98ed60",
  },
  BOT_SLASH: {
    id: "bot_commands",
    description: "Supports Commands",
    icon: "6f9e37f9029ff57aef81db857890005e",
    link: "https://discord.com/blog/welcome-to-the-new-era-of-discord-apps?ref=badge",
  },
  BOT_AUTOMOD: {
    id: "automod",
    description: "Uses AutoMod",
    icon: "f2459b691ac7453ed6039bbcfaccbfcd",
  },
};

// const userFlags = new UserFlags(16383);

// console.log(
//   userFlags
//     .toArray()
//     .map((name) => badges[name])
//     .filter((a) => a)
// );

export const userFlags = (flag) => {
  const userFlag = new UserFlags(flag);

  return userFlag
    .toArray()
    .map((name) => badges[name])
    .filter((a) => a);
};
