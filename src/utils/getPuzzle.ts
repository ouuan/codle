import DOMPurify from 'dompurify';

export async function fetchStatement(id: number) {
  const response = await fetch(`/statement/${id}.html`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const text = await response.text();
  return DOMPurify.sanitize(text);
}

export async function fetchTargetCodeEncoded(id: number) {
  const response = await fetch(`/targetCode/${id}.txt`);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response.text();
}

export function decodeTargetCode(encoded: string) {
  const base64Decoded = window.atob(encoded);
  return decodeURIComponent(base64Decoded);
}

export async function fetchTargetCode(id: number) {
  const encoded = await fetchTargetCodeEncoded(id);
  return decodeTargetCode(encoded);
}
