import { PresetGallery } from '@/components/presets/gallery';

export const metadata = {
  title: 'Presets',
  description:
    'Built-in M3E seed presets plus your locally saved themes — one click to load them into the Studio.',
};

export default function PresetsPage() {
  return <PresetGallery />;
}
