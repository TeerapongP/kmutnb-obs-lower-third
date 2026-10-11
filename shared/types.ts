export const templates = [
  'standard',
  'modern',
  'glass',
  'minimal',
  'premium',
  'speaker',
] as const;
export type Template = (typeof templates)[number];

export const animationEffects = [
  'slide-up',
  'slide-down',
  'slide-left',
  'slide-right',
  'fade',
  'scale',
  'wipe',
  'blur',
  'staggered',
  'light-sweep',
] as const;
export type AnimationEffect = (typeof animationEffects)[number];

export const animationEasings = ['ease-out', 'ease-in-out', 'spring'] as const;
export type AnimationEasing = (typeof animationEasings)[number];

export type LowerThirdAnimationSettings = {
  effect: AnimationEffect;
  duration: number;
  easing: AnimationEasing;
  enabled: boolean;
};

export type Speaker = {
  id: string;
  name: string;
  academicTitle: string;
  position: string;
  department: string;
  demo?: boolean;
};

export type Settings = {
  template: Template;
  speed: number;
  autoShow: boolean;
  animation: LowerThirdAnimationSettings;
};

export type SavedData = {
  speakers: Speaker[];
  settings: Settings;
  selectedSpeakerId: string | null;
};
export type LiveState = { visible: boolean; cue: number };
export type Snapshot = SavedData & { live: LiveState };

export const templateInfo: Record<Template, { name: string; description: string }> = {
  standard: { name: 'Classic', description: 'Orange brand · white name' },
  modern: { name: 'Angular', description: 'Slanted panels · bold edge' },
  glass: { name: 'Overlay', description: 'Transparent dark frame' },
  minimal: { name: 'Rounded', description: 'Soft curves · orange ribbon' },
  premium: { name: 'Premium', description: 'Illuminated accent' },
  speaker: { name: 'Speaker', description: 'Academic conference' },
};

export const designTemplates = [
  {
    id: 'standard',
    number: '01',
    name: 'Classic',
    description: 'Orange brand · white name',
  },
  {
    id: 'modern',
    number: '02',
    name: 'Angular',
    description: 'Slanted panels · bold edge',
  },
  {
    id: 'glass',
    number: '03',
    name: 'Overlay',
    description: 'Transparent dark frame',
  },
  {
    id: 'minimal',
    number: '04',
    name: 'Rounded',
    description: 'Soft curves · orange ribbon',
  },
] as const satisfies ReadonlyArray<{
  id: Template;
  number: string;
  name: string;
  description: string;
}>;

export const demoSpeakers: Speaker[] = [
  {
    id: 'demo-1',
    name: 'ดร. กานต์ชนก วัฒนกุล',
    academicTitle: 'ผศ.',
    position: 'อาจารย์ประจำภาควิชาวิศวกรรมคอมพิวเตอร์',
    department: 'คณะวิศวกรรมศาสตร์',
    demo: true,
  },
  {
    id: 'demo-2',
    name: 'ธนภัทร ศรีพัฒน์',
    academicTitle: 'รศ. ดร.',
    position: 'ผู้อำนวยการศูนย์นวัตกรรมดิจิทัล',
    department: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ',
    demo: true,
  },
  {
    id: 'demo-3',
    name: 'Dr. Ananya Chaiyaporn',
    academicTitle: '',
    position: 'Research Fellow, AI & Robotics',
    department: 'Faculty of Information Technology',
    demo: true,
  },
];

export const initialData: SavedData = {
  speakers: demoSpeakers,
  settings: {
    template: 'standard',
    speed: 1,
    autoShow: false,
    animation: {
      effect: 'slide-up',
      duration: 0.65,
      easing: 'ease-out',
      enabled: true,
    },
  },
  selectedSpeakerId: demoSpeakers[0].id,
};

export function nextSpeakerId(
  speakers: Speaker[],
  selectedId: string | null,
): string | null {
  if (!speakers.length) return null;
  const index = speakers.findIndex((speaker) => speaker.id === selectedId);
  return speakers[(index + 1) % speakers.length].id;
}

export function displayName(speaker: Speaker): string {
  return [speaker.academicTitle.trim(), speaker.name.trim()].filter(Boolean).join(' ');
}

export function displaySubtitle(speaker: Speaker): string {
  return [speaker.position.trim(), speaker.department.trim()]
    .filter(Boolean)
    .join('  ·  ');
}
