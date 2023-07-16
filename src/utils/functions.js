/* global BigInt */

export const avatarURL = (user) => {
  return user?.avatar
    ? `https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.${
        user?.avatar.startsWith("a_") ? "gif" : "png"
      }?size=1024`
    : `https://cdn.discordapp.com/embed/avatars/${
        parseInt(user?.discriminator) === 0
          ? BigInt(user?.id >> 22n) % 6
          : parseInt(user?.discriminator) % 5
      }.png`;
};