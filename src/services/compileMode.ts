import semver from 'semver';

export function normalizeCompileMode(mode: string, version: string) {
  const usesRenamedServerModes =
    version === 'local' ||
    version === 'latest' ||
    semver.gte(version, '0.0.16-0');

  if (!usesRenamedServerModes) {
    return mode;
  }

  if (mode === 'ssg') {
    return 'server';
  }

  if (mode === 'ssr') {
    return 'hydrate';
  }

  return mode;
}
