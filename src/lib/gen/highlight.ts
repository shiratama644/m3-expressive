/**
 * Tiny dependency-free syntax highlighter for the studio code panel.
 * Escapes HTML, then wraps matched tokens with classes using theme color roles.
 */

const TOKEN =
  /(\/\*[\s\S]*?\*\/|\/\/[^\n]*|&lt;!--[\s\S]*?--&gt;|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|var\(--[\w-]+(?:\([^)]*\))?\)|#[0-9a-fA-F]{3,8}\b|\b\d+(?:\.\d+)?(?:px|ms|em|s|%|fr|deg)?\b|\b(?:import|from|export|const|let|type|interface|extends|async|await|function|return|default|new|class)\b)/g;

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function classFor(token: string): string {
  if (token.startsWith('/*') || token.startsWith('//') || token.startsWith('&lt;!--'))
    return 'text-on-surface-variant italic';
  if (/^["'`]/.test(token)) return 'text-tertiary';
  if (token.startsWith('var(--')) return 'text-primary';
  if (token.startsWith('#')) return 'text-secondary';
  if (/^\d/.test(token)) return 'text-error';
  return 'text-primary-container';
}

export function highlight(code: string): string {
  const escaped = escapeHtml(code);
  const out: string[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(escaped))) {
    if (m.index > last) out.push(escaped.slice(last, m.index));
    out.push(`<span class="${classFor(m[0])}">${m[0]}</span>`);
    last = m.index + m[0].length;
  }
  if (last < escaped.length) out.push(escaped.slice(last));
  return out.join('');
}
