export function toTwicPicURL(url?: string) {
  if (!url) return "";
  return url.replace("https://cdn.filestackcontent.com/", "image:");
}
export function toTwicPicBlurryImageUrl(url?: string) {
  if (!url) return "";
  return (
    url.replace(
      "https://cdn.filestackcontent.com/",
      import.meta.env.VITE_TWICPIC_URL
    ) + "?twic=v1/output=preview"
  );
}
