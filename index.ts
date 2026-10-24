import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export function getDisplayValues(value: string) {
  const parsed = Number(value || 0);

  return {
    value: String(parsed),
    doubled: String(parsed * 2),
  };
}

export function nextDisplay() {
  window.location.href = '/next.html';
}

export function stopAndNavigate(destroy$: Subject<void>, navigate = nextDisplay) {
  destroy$.next();
  destroy$.complete();
  navigate();
}

export function setupPage() {
  if (typeof document === 'undefined') {
    return;
  }

  const input = document.querySelector<HTMLInputElement>('#numberInput');
  const inputValue = document.querySelector<HTMLElement>('#inputValue');
  const doubleValue = document.querySelector<HTMLElement>('#doubledValue');
  const stopButton = document.querySelector<HTMLButtonElement>('#stopButton');

  if (!input || !inputValue || !doubleValue || !stopButton) {
    throw new Error('入力欄または停止ボタンが見つかりません');
  }

  const destroy$ = new Subject<void>();

  stopButton.addEventListener('click', () => {
    stopAndNavigate(destroy$);
  });

  fromEvent(input, 'input')
    .pipe(takeUntil(destroy$))
    .subscribe({
      next: () => {
        const nextValues = getDisplayValues(input.value);
        inputValue.textContent = nextValues.value;
        doubleValue.textContent = nextValues.doubled;
      },
      error: (err) => {
        console.error('入力イベントでエラーが発生しました', err);
      },
      complete: () => {
        console.log('入力イベントの監視を終了しました');
      },
    });
}

if (typeof document !== 'undefined') {
  setupPage();
}
