/**
 * Prettify a directory name into a Confluence folder-page title.
 * - Split on hyphens
 * - Capitalise each word
 * - Join with spaces
 * - Append trailing /
 */
export function prettifyDirName(dirName: string): string {
  return dirName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') + '/';
}

/**
 * Determine the set of directories that need folder pages.
 * Returns relative directory paths (from docs/) sorted deepest-first
 * so parents are created after children are known.
 */
export function getRequiredFolderPaths(relPaths: string[]): string[] {
  const dirs = new Set<string>();

  for (const relPath of relPaths) {
    let dir = relPath.includes('/') ? relPath.slice(0, relPath.lastIndexOf('/')) : '';
    while (dir) {
      dirs.add(dir);
      dir = dir.includes('/') ? dir.slice(0, dir.lastIndexOf('/')) : '';
    }
  }

  // Sort: deepest first (for creation order: create children first doesn't matter,
  // but for lookup we process shallowest first)
  return [...dirs].sort((a, b) => {
    const depthA = a.split('/').length;
    const depthB = b.split('/').length;
    return depthA - depthB;
  });
}
