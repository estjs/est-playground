import { signal } from 'essor';

export interface ErrorInfo {
  type?: 'runtime' | 'compile' | 'console';
  message: string;
  stack?: string;
  line?: number;
  column?: number;
}

export function ErrorDisplay(props: { error: ErrorInfo | string | null; onClose?: () => void }) {
  if (!props.error || props.error === '') return null;

  const error =
    typeof props.error === 'string' ? { message: props.error } : (props.error as ErrorInfo);

  const pos = signal({ x: 0, y: 0 });
  const isDragging = signal(false);
  let startPos = { x: 0, y: 0 };

  const handleMouseDown = (e: MouseEvent) => {
    isDragging.value = true;
    startPos = {
      x: e.clientX - pos.value.x,
      y: e.clientY - pos.value.y,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.value) return;
      pos.value = {
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      };
    };

    const handleMouseUp = () => {
      isDragging.value = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      style={{
        transform: `translate(${pos.value.x}px, ${pos.value.y}px)`,
        transition: isDragging.value ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      class="glass animate-slide-up absolute bottom-4 left-4 right-4 z-50 max-h-[80%] of-auto b-1 b-red-500/20 rounded-xl pa-4 shadow-2xl dark:b-red-400/20">
      <div class="flex items-start gap-4">
        <div class="flex-auto overflow-hidden">
          <div
            onMouseDown={handleMouseDown}
            class="mb-2 flex cursor-move select-none items-center justify-between text-lg font-bold active:cursor-grabbing">
            <div class="flex items-center gap-3">
              <span
                class={`rounded px-2 py-0.5 text-[10px] font-black tracking-widest uppercase ${
                  error.type === 'compile'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 b-1 b-amber-500/20'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400 b-1 b-red-500/20'
                }`}>
                {error.type === 'compile' ? 'Compile Error' : 'Runtime Error'}
              </span>
              {error.line && (
                <span class="b-1 b-red-500/20 rounded-md bg-red-500/10 px-2 py-0.5 text-xs text-red-500 font-mono">
                  L{error.line}:{error.column}
                </span>
              )}
            </div>

            <button
              onClick={props.onClose}
              class="group/close h-6 w-6 flex items-center justify-center rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-white/5">
              <div class="i-carbon-close text-lg opacity-40 transition-opacity group-hover:opacity-100" />
            </button>
          </div>
          <div class="mb-3 whitespace-pre-wrap b-1 b-red-500/10 rounded-lg bg-red-500/5 p-3 text-sm leading-relaxed font-mono">
            {error.message}
          </div>
          {error.stack && (
            <details class="group">
              <summary class="mt-4 flex cursor-pointer items-center gap-1 text-[12px] font-semibold tracking-widest uppercase opacity-40 transition-opacity hover:opacity-100">
                <div class="i-carbon-chevron-right transition-transform group-open:rotate-90" />
                Stack Trace
              </summary>
              <pre class="mt-3 of-auto whitespace-pre-wrap border-t-1 border-white/5 rounded-lg bg-black/5 p-4 text-[11px] leading-tight font-mono opacity-80 dark:bg-white/5">
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
