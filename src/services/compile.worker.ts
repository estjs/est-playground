import { transform } from '@babel/standalone';
import LocalBabelPlugin from 'babel-plugin-essor';
import { normalizeCompileMode } from './compileMode';
interface CompileMessage {
  type: 'compile';
  mode: string;
  code: string;
  version: string;
}

async function loadPlugin(version: string) {
  if (version === 'local') {
    return LocalBabelPlugin;
  }
  const cleanVersion = version === 'latest' ? '' : `@${version}`;
  try {
    const url = `https://esm.sh/babel-plugin-essor${cleanVersion}`;
    const module = await import(/* @vite-ignore */ url);
    return module.default || module;
  } catch (error) {
    console.error(`Failed to load plugin for version ${version}, falling back to local`, error);
    return LocalBabelPlugin;
  }
}

async function babelTransform(filename: string, code: string, mode: string, version: string) {
  try {
    const plugin = await loadPlugin(version);
    const normalizedMode = normalizeCompileMode(mode, version);

    const transformedCode = transform(code, {
      plugins: [[plugin, { mode: normalizedMode, hmr: false }]],
      presets: ['typescript'],
      filename: `${filename}.tsx`,
    }).code;
    return transformedCode!;
  } catch (error) {
    console.error('Babel transform error:', error);
    throw error;
  }
}

self.addEventListener(
  'message',
  async (message: MessageEvent<CompileMessage>) => {
    if (message.data.type === 'compile') {
      try {
        const { code, mode, version } = message.data;
        const compiled = await babelTransform('test', code, mode, version);
        self.postMessage({
          type: 'compile-success',
          value: compiled,
        });
      } catch (error: any) {
        self.postMessage({
          type: 'compile-error',
          error: error.message || String(error),
          loc: error.loc,
        });
      }
    }
  },
  false,
);
