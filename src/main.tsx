import 'virtual:uno.css';
import '@unocss/reset/tailwind.css';
import './style.css';

import { createApp, onMount, watch } from 'essor';
import { Bar } from './components/Bar';
import { Edit } from './components/Edit';
import { Preview } from './components/Preview';
import { dark, setDark } from './utils';

function App() {
  // Initialize dark mode on mount
  onMount(() => {
    setDark();
  });

  // Watch for dark mode changes
  watch(dark, () => {
    setDark();
  });

  return (
    <div class="relative h-100vh w-100vw flex flex-col of-hidden bg-[var(--vt-c-bg)] transition-colors duration-500">
      {/* Vite-style background glow */}
      <div class="pointer-events-none absolute h-[40%] w-[40%] bg-[#646cff] opacity-[0.05] blur-[120px] -left-[10%] -top-[10%] dark:opacity-[0.1]" />
      <div class="pointer-events-none absolute h-[40%] w-[40%] bg-[#42d392] opacity-[0.05] blur-[120px] -bottom-[10%] -right-[10%] dark:opacity-[0.1]" />

      <Bar />
      <div class="relative z-1 w-full flex flex-1 flex-col of-hidden md:flex-row">
        <div class="bg-base relative h-1/2 w-full shadow-inner md:h-full md:w-1/2">
          <Edit />
          <div class="bg-base absolute bottom-0 right-0 top-0 z-10 hidden w-1px opacity-20 md:block" />
          <div class="bg-base absolute bottom-0 left-0 right-0 z-10 h-1px opacity-20 md:hidden" />
        </div>
        <div class="h-1/2 w-full md:h-full md:w-1/2">
          <Preview />
        </div>
      </div>
    </div>
  );
}

createApp(App, '#app');
