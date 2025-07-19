const getAvatarImgSrc = (avatarUrl: string | null | undefined) => {
  if (avatarUrl === null || avatarUrl === undefined) {
    return avatarUrl;
  }

  return avatarUrl.startsWith('/uploads')
    ? `https://blogger-wph-api-production.up.railway.app${avatarUrl}`
    : avatarUrl;
};

export default getAvatarImgSrc;
