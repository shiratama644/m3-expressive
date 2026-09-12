import type { GenFile } from '@/lib/gen';

/** Client-only: builds a zip with fflate and triggers a download. */
export async function downloadProjectZip(files: GenFile[], name = 'm3e-theme'): Promise<void> {
  const { zipSync, strToU8 } = await import('fflate');
  const input: Record<string, Uint8Array> = {};
  for (const f of files) input[f.path] = strToU8(f.content);
  const zipped = zipSync(input, { level: 6 });
  const blob = new Blob([zipped.slice()], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.zip`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
