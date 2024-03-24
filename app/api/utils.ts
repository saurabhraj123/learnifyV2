export const createSlug = (title: string) => {
  let slug = title.toLowerCase();
  slug = slug.replace(/\s+/g, "-");
  slug = slug.replace(/[^a-z0-9-]/g, "");
  slug = slug.replace(/-+/g, "-");
  return slug;
};
