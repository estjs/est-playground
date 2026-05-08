import { onMount } from 'essor';
import {
  compileMode,
  dark,
  essorVersion,
  essorVersions,
  fetchEssorVersions,
  isSSRSupported,
  setCompileMode,
  setEssorVersion,
  shareUrl,
  toggleDark,
} from '../utils';

export function Bar() {
  onMount(() => {
    fetchEssorVersions();
  });

  return (
    <div class="glass sticky top-0 z-100 h-64px w-full flex items-center justify-between b-b-1 b-base px-6">
      <div class="group flex cursor-pointer items-center gap-3">
        <div class="relative">
          <div class="i-carbon-flash-filled text-2xl text-[#646cff] transition-transform duration-300 group-hover:scale-110" />
          <div class="absolute inset-0 bg-[#646cff] opacity-20 blur-lg transition-opacity group-hover:opacity-40" />
        </div>
        <h1 class="flex items-center gap-1 text-xl font-bold tracking-tight">
          <span class="text-gradient">Essor</span>
          <span class="opacity-90">Playground</span>
        </h1>
      </div>

      <div class="flex-auto" />

      <div class="flex items-center gap-4 md:gap-8">
        {isSSRSupported.value && (
          <>
            <div class="flex items-center gap-4">
              <span class="hidden select-none text-[11px] font-bold tracking-[0.15em] uppercase opacity-30 sm:block">
                Mode
              </span>
              <div class="group/toggle relative flex overflow-hidden b-1 b-base rounded-xl bg-gray-200/30 p-1 backdrop-blur-sm dark:bg-white/5">
                {(['client', 'ssr', 'ssg'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setCompileMode(mode)}
                    class={`relative z-1 rounded-lg px-3 py-1.5 text-[10px] font-black tracking-widest uppercase transition-all duration-500 md:px-4 ${
                      compileMode.value === mode
                        ? 'text-[#646cff] dark:text-white'
                        : 'opacity-40 hover:opacity-100 hover:scale-105'
                    }`}>
                    {mode}
                    {compileMode.value === mode && (
                      <div class="absolute inset-0 rounded-lg bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] -z-1 dark:bg-[#646cff]" />
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div class="bg-base h-6 w-1px opacity-20" />
          </>
        )}

        <div class="flex items-center gap-3">
          <span class="hidden select-none text-[11px] font-bold tracking-[0.15em] uppercase opacity-30 sm:block">
            Version
          </span>
          <div class="group relative">
            <select
              id="essor-version"
              value={essorVersion.value}
              onChange={(e) => setEssorVersion(e.target.value)}
              class="w-120px cursor-pointer appearance-none border-1 b-base rounded-lg bg-white px-3 py-1.5 pr-8 text-sm text-black font-medium outline-none transition-all md:w-150px dark:bg-[#1e1e20] hover:bg-gray-100/50 dark:text-gray-200 focus:ring-2 focus:ring-[#646cff]/30 dark:hover:bg-white/10">
              {essorVersions.value.map((version) => (
                <option
                  key={version}
                  value={version}
                  class="bg-white text-black dark:bg-[#1e1e20] dark:text-gray-200">
                  {version === 'local' ? 'Local Build' : version}
                </option>
              ))}
            </select>
            <div class="i-carbon-chevron-down pointer-events-none absolute right-2.5 top-1/2 text-xs opacity-50 -translate-y-1/2" />
          </div>
        </div>

        <div class="bg-base hidden h-6 w-1px opacity-20 md:block" />

        <div class="flex items-center gap-3 md:gap-5">
          <button
            class="i-carbon-share icon-btn text-base hover:scale-110"
            onClick={shareUrl}
            title="Share URL"></button>

          <button
            class="icon-btn text-base hover:scale-110"
            onClick={() => toggleDark()}
            title="Toggle Dark Mode">
            {dark.value ? (
              <div class="i-carbon-moon text-blue-400" />
            ) : (
              <div class="i-carbon-sun text-yellow-500" />
            )}
          </button>

          <a
            class="i-carbon-logo-github icon-btn text-base hover:scale-110"
            rel="noreferrer"
            href="https://github.com/estjs/essor-playground"
            target="_blank"
            title="GitHub"
          />
        </div>
      </div>
    </div>
  );
}
