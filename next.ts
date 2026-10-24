const startButton = document.querySelector<HTMLButtonElement>('#startButton');
if (!startButton) {
  throw new Error('起動ボタンが見つかりません');
}

startButton.addEventListener('click', () => {
  window.location.href = '/index.html';
});