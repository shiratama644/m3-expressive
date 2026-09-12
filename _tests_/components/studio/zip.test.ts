// @vitest-environment jsdom
import { strFromU8, unzipSync } from 'fflate';
import { afterEach, describe, expect, it } from 'vitest';
import { downloadProjectZip } from '@/components/studio/zip';
import type { GenFile } from '@/lib/gen';

const files: GenFile[] = [
  { path: 'src/app/page.tsx', content: 'export default function Page(){return null}', lang: 'tsx' },
  { path: 'README.md', content: '# hello zip', lang: 'md' },
] as never;

let captured: Blob | undefined;
const orig = URL.createObjectURL;
afterEach(() => {
  captured = undefined;
  URL.createObjectURL = orig;
});

describe('downloadProjectZip', () => {
  it('zips every file and triggers a download', async () => {
    URL.createObjectURL = (b: Blob) => {
      captured = b;
      return 'blob:m3e';
    };
    URL.revokeObjectURL = () => {};
    await downloadProjectZip(files, 'unit-zip');
    expect(captured, 'createObjectURL was called with a Blob').toBeTruthy();
    const bytes = new Uint8Array(await (captured as Blob).arrayBuffer());
    const unzipped = unzipSync(bytes);
    expect(Object.keys(unzipped).sort()).toEqual(['README.md', 'src/app/page.tsx']);
    expect(strFromU8(unzipped['README.md'])).toBe('# hello zip');
  });
});
