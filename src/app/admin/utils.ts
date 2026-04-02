/**
 * Convert local asset paths to GitHub raw URLs for admin preview.
 * Newly uploaded images exist on GitHub but not on the current deployment,
 * so we serve them from GitHub raw until the next deploy.
 */
export function toPreviewSrc(src: string): string {
  if (!src) return src;
  if (src.startsWith('http') || src.startsWith('blob:') || src.startsWith('data:')) return src;
  return `https://raw.githubusercontent.com/aminedamoun/tonus/main/public${src}`;
}
