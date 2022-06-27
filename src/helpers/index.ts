export function toTwicPicURL(url?: string) {
  if (!url) return "";
  return url.replace("https://cdn.filestackcontent.com/", "image:");
}
export function toTwicPicBlurryImageUrl(url?: string) {
  if (!url) return "";
  console.log("the url", url);
  if (url.startsWith(import.meta.env.VITE_TWICPIC_URL)) {
    return `${url}?twic=v1/output=preview`;
  }
  return (
    url.replace(
      "https://cdn.filestackcontent.com/",
      import.meta.env.VITE_TWICPIC_URL
    ) + "?twic=v1/output=preview"
  );
}
