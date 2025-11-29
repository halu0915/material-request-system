import path from 'path';
import fs from 'fs';

/**
 * Find the client build directory
 * Returns the path if found, null otherwise
 */
export function findClientBuild(): string | null {
  const possiblePaths = [
    // From dist/index.js, looking for client/dist
    path.join(__dirname, '../../../client/dist'),
    // From project root
    path.join(process.cwd(), 'client/dist'),
    // Alternative structure
    path.join(process.cwd(), '../client/dist'),
    // Render deployment structure
    path.join(process.cwd(), 'client/dist'),
  ];

  for (const buildPath of possiblePaths) {
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      return buildPath;
    }
  }

  return null;
}

