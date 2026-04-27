export const formatPartnerLink = (url: string): string => {
  if (!url) return "";
  const code = "PBG122";
  const urlObj = new URL(url);
  urlObj.searchParams.set("rcode", code);
  return urlObj.toString();
};