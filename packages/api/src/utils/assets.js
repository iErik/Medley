const { VITE_AUTUMN_API: AUTUMN_API } = import.meta.env;
export const getAssetUrl = (type, id) => `${AUTUMN_API}/${type}/${id}`;
