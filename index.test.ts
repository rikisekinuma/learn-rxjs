import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { getDisplayValues, setupPage, stopAndNavigate } from './index';
import { Subject } from 'rxjs';

describe('getDisplayValues', () => {
  it('returns the value and double value as strings', () => {
    expect(getDisplayValues('3')).toEqual({ value: '3', doubled: '6' });
  });

  it('treats empty input as 0', () => {
    expect(getDisplayValues('')).toEqual({ value: '0', doubled: '0' });
  });
});

describe('stopAndNavigate', () => {
  it('notifies the stream to complete and calls the provided navigation function', () => {
    const destroy$ = new Subject<void>();
    const navigate = vi.fn();

    stopAndNavigate(destroy$, navigate);

    expect(navigate).toHaveBeenCalledTimes(1);
  });
});

describe('page setup', () => {
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html lang="ja">
        <body>
          <input id="numberInput" type="number" value="3" />
          <span id="inputValue">0</span>
          <span id="doubledValue">0</span>
          <button id="stopButton">Stop</button>
        </body>
      </html>
    `);

    globalThis.window = dom.window as any;
    globalThis.document = dom.window.document as any;
    globalThis.location = dom.window.location as any;

    setupPage();
  });

  afterEach(() => {
    dom.window.close();
  });

  it('updates the displayed values when the input emits an input event', () => {
    const input = document.getElementById('numberInput') as HTMLInputElement;
    const inputValue = document.getElementById('inputValue') as HTMLSpanElement;
    const doubledValue = document.getElementById('doubledValue') as HTMLSpanElement;

    input.value = '7';
    input.dispatchEvent(new window.Event('input'));

    expect(inputValue.textContent).toBe('7');
    expect(doubledValue.textContent).toBe('14');
  });
});
