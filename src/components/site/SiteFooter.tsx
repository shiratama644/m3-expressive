import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-outline-variant/60 bg-surface-container-low">
      <div className="mx-auto flex w-full max-w-350 flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div className="max-w-md">
          <p className="t-title-medium text-on-surface">M3E Studio</p>
          <p className="t-body-small mt-2 text-on-surface-variant">
            Material 3 Expressive™ デザインを、あなたのスタックへ。トークンは{' '}
            <a
              className="text-primary underline decoration-primary/40 underline-offset-2"
              href="https://m3.material.io/"
              target="_blank"
              rel="noreferrer"
            >
              m3.material.io
            </a>{' '}
            と androidx の生成トークンに準拠しています。
          </p>
        </div>
        <div className="t-body-small flex flex-wrap items-center gap-4 text-on-surface-variant">
          <Link href="/docs" className="hover:text-primary">
            Docs
          </Link>
          <Link href="/tokens" className="hover:text-primary">
            Token reference
          </Link>
          <a href="https://github.com/shiratama644/m3-expressive" target="_blank" rel="noreferrer" className="hover:text-primary">
            MIT © Shiratama
          </a>
        </div>
      </div>
    </footer>
  );
}
