export function getR2Url(key: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-yunperfume.r2.dev";
  // Remove trailing slashes from baseUrl and leading slashes from key
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const normalizedKey = key.replace(/^\//, "");
  
  return `${normalizedBase}/${normalizedKey}`;
}
