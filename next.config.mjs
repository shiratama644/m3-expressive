/**
 * M3E Studio — Next.js 設定
 *
 * ⚠ .ts ではなく .mjs にしている理由（DropMod 実証済みの移植・2026-09-12）:
 *   Next 16 は next.config.ts を next.config.compiled.js にコンパイルして
 *   読み込み後に削除する。すると webpack の persistent cache がそのパスを
 *   解決できず「Caching failed for pack」で毎回キャッシュが無効化される。
 *   .mjs はコンパイルなしで直接読まれ、キャッシュが正しく永続化する。
 *   （scripts/executer.ts の webpack ルートに必須）
 *   また webpack の cache 設定は独自 override せず Next 標準を使う
 *   （override すると pnpm レイアウトで mini-css-extract-plugin の
 *   pack 解決に失敗する）。
 */
const nextConfig = {
  experimental: {
    // Turbopack filesystem cache（Next 16.3+、2 回目以降の build/dev を速くする）。
    // webpack 経路 (--webpack) では効かない — 代わりに Next 標準の
    // .next/cache/webpack が executer の linkNextCache で永続化される。
    turbopackFileSystemCacheForBuild: true,
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
