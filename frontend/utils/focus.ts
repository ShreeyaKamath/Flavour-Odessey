export function focusElement(selector: string) {
  const element = document.querySelector<HTMLElement>(selector);
  element?.focus();
}
