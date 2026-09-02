export interface PlanDaySegment {
  name: string;
  detail: string;
  pace: string;
}

export interface PlanDay {
  d: string; // ISO: YYYY-MM-DD
  w: number; // Week number: 1..6
  type: 'easy' | 'quality' | 'long' | 'taper' | 'rest' | 'pre' | 'race';
  loc: string | null;
  kn: number | null; // km numeric
  km: string | null;
  t: string; // title
  desc: string;
  seg: [string, string, string][]; // [title, subtitle, pace]
  tags: [string, string][];
  note?: string | null;
}

export const AYLAR = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
export const GUN = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts'];

export const pad = (n: number) => String(n).padStart(2, '0');
export const ISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseISO = (s: string) => {
  const [a, b, c] = s.split('-').map(Number);
  return new Date(a, b - 1, c);
};
export const sod = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
export const dayDiff = (a: Date, b: Date) => Math.round((sod(b).getTime() - sod(a).getTime()) / 864e5);
export const fmtTR = (d: Date) => `${d.getDate()} ${AYLAR[d.getMonth()]}`;

const P = (
  d: string,
  w: number,
  type: PlanDay['type'],
  loc: string | null,
  kn: number | null,
  km: string | null,
  t: string,
  desc: string,
  seg?: [string, string, string][],
  tags?: [string, string][],
  note?: string | null
): PlanDay => ({
  d,
  w,
  type,
  loc,
  kn,
  km,
  t,
  desc,
  seg: seg || [],
  tags: tags || [],
  note: note || null,
});

const R = (d: string, w: number, t: string, desc: string): PlanDay =>
  P(d, w, 'rest', null, null, null, t, desc);

export const ATHLETIC_PLAN: PlanDay[] = [
  P('2026-09-02', 1, 'easy', 'Metehan Dönüşlü', 10.15, '10.15 km', 'Rahat Koşu', 'Program açılışı — tamamen rahat ve eforsuz ritim.', [['Rahat Blok', '10.15 km kesintisiz, eforsuz koşu', '5\'46" /km · 158 bpm']], null, 'Açılış koşusu tamamlandı.'),
  R('2026-09-03', 1, 'Tam Dinlenme', 'Pasif toparlanma.'),
  P('2026-09-04', 1, 'quality', 'Metehan Dönüşlü', 10.15, '10.15 km', 'İlerleme Koşusu', 'Üç bloklu ilerleme: rahat aç, yarış temposunda kapat.', [['Rahat', '5.5 km', '5\'40" /km'], ['Yarış Temposu', '3 km', '5\'05" /km'], ['Jog', '1.6 km', '6\'00" /km']]),
  R('2026-09-05', 1, 'Dinlenme', 'Hafif yürüyüş / esneme.'),
  P('2026-09-06', 1, 'long', 'Lemar Işıkları', 9.74, '9.74 km', 'Eforsuz Uzun', 'Sabit ritim aerobik koşu.', [], [['Pace', '5\'45"–5\'55" /km']]),
  R('2026-09-07', 2, 'Tam Dinlenme', 'Pasif toparlanma.'),
  P('2026-09-08', 2, 'quality', 'Tartan Pist · Belediye Karşısı', null, '1.5 km + 10×30/30 + 1 km', 'HIIT 30/30', 'Kısa hız bloklarıyla bacak hızını uyandırma.', [['Isınma', '1.5 km kolay koşu', '—'], ['Ana Blok', '10× (30 sn hızlı / 30 sn yavaş jog)', '4\'20"–4\'30" /km'], ['Soğuma', '1 km jog', '—']]),
  R('2026-09-09', 2, 'Tam Dinlenme', 'Pasif toparlanma.'),
  P('2026-09-10', 2, 'quality', 'Metehan Dönüşlü', 10.15, '10.15 km', 'Blok Tempo', 'Kesintisiz tempo bloğu — yarış ritmini içselleştirme.', [['Isınma', '3 km', '—'], ['Kesintisiz Tempo', '4 km', '4\'55"–5\'00" /km'], ['Jog', '3.15 km', '—']]),
  R('2026-09-11', 2, 'Dinlenme', 'Esneme.'),
  R('2026-09-12', 2, 'Tam Dinlenme', 'Pasif toparlanma.'),
  P('2026-09-13', 2, 'long', 'Lemar Işıkları', 9.74, '9.74 km', 'Eforsuz Uzun', 'Zone 2 aerobik dayanıklılık.', [], [['Pace', '5\'40"–5\'50" /km']]),
  R('2026-09-14', 3, 'Tam Dinlenme', 'Pasif toparlanma.'),
  P('2026-09-15', 3, 'quality', 'Tartan Pist · Belediye Karşısı', null, '1.5 km + 6×(2\'/1\') + 1 km', 'Eşik Interval', 'Eşik üstü aralıklar — yorgunlukta tempoyu taşıma.', [['Isınma', '1.5 km kolay koşu', '—'], ['Ana Blok', '6× (2 dk hızlı / 1 dk yürüyüş)', '4\'35"–4\'40" /km'], ['Soğuma', '1 km jog', '—']]),
  R('2026-09-16', 3, 'Tam Dinlenme', 'Pasif toparlanma.'),
  P('2026-09-17', 3, 'quality', 'Metehan Dönüşlü', 10.15, '10.15 km', 'Negatif Split', 'İlk yarı kontrollü, ikinci yarı yarış temposu.', [['İlk Yarı', '5 km kontrollü', '5\'30" /km'], ['İkinci Yarı', '5.15 km yarış temposu', '4\'55" /km']]),
  R('2026-09-18', 3, 'Dinlenme', 'Esneme / foam roller.'),
  R('2026-09-19', 3, 'Tam Dinlenme', 'Pasif toparlanma.'),
  P('2026-09-20', 3, 'long', 'Lemar Işıkları', 9.74, '9.74 km', 'Toparlanma Koşusu', 'Tamamen rahat — nabız 155 altında tut.', [], [['Nabız', '< 155 bpm'], ['Pace', '5\'45"–5\'55" /km']]),
  R('2026-09-21', 4, 'Tam Dinlenme', 'Pasif toparlanma.'),
  P('2026-09-22', 4, 'quality', 'Tartan Pist · Belediye Karşısı', null, 'Isınma + piramit + soğuma', 'Piramit HIIT', 'Yüklenme zirvesi — VO₂ bloğu.', [['Isınma', '1.5 km kolay koşu', '—'], ['Piramit', '1–2–3–2–1 dk hızlı · aralar 1–1.5 dk yürüyüş', '4\'30"–4\'40" /km'], ['Soğuma', '1 km jog', '—']]),
  R('2026-09-23', 4, 'Tam Dinlenme', 'Pasif toparlanma.'),
  P('2026-09-24', 4, 'quality', 'Metehan Dönüşlü', 10.15, '10.15 km', 'Yarış Provası', 'Zirve haftasının ana sınavı: 6 km kesintisiz yarış temposu.', [['Isınma', '2 km', '—'], ['Blok Yarış Temposu', '6 km kesintisiz', '4\'50"–4\'55" /km'], ['Soğuma', '2.15 km', '—']]),
  R('2026-09-25', 4, 'Dinlenme', 'Esneme.'),
  R('2026-09-26', 4, 'Tam Dinlenme', 'Pasif toparlanma.'),
  P('2026-09-27', 4, 'long', 'Lemar Işıkları', 9.74, '9.74 km', 'Aerobik Koşu', 'Rahat ritim.', [], [['Pace', '5\'40"–5\'45" /km']]),
  R('2026-09-28', 5, 'Tam Dinlenme', 'Pasif toparlanma.'),
  P('2026-09-29', 5, 'quality', 'Tartan Pist · Belediye Karşısı', null, '1.5 km + 5×(45/75) + 1 km', 'Hız Koruma', 'Hacim düşerken hızı koru — yormadan.', [['Isınma', '1.5 km kolay koşu', '—'], ['Ana Blok', '5× (45 sn hızlı / 75 sn yürüyüş)', '4\'25" /km'], ['Soğuma', '1 km jog', '—']]),
  R('2026-09-30', 5, 'Tam Dinlenme', 'Pasif toparlanma.'),
  P('2026-10-01', 5, 'taper', 'Metehan Dönüşlü · Kısaltılmış', 6, '6 km', 'Kısa Tempo', 'Tapering: hacim düşürme başlıyor.', [['Rahat', '3 km', '5\'30" /km'], ['Yarış Hızı', '2 km', '4\'50" /km'], ['Jog', '1 km', '—']]),
  R('2026-10-02', 5, 'Dinlenme', 'Esneme.'),
  R('2026-10-03', 5, 'Tam Dinlenme', 'Pasif toparlanma.'),
  P('2026-10-04', 5, 'taper', 'Lemar Işıkları · Kısaltılmış', 6, '6 km', 'Çok Hafif Jog', 'Bacakları taze tut.', [], [['Pace', '6\'00" /km']]),
  R('2026-10-05', 6, 'Tam Dinlenme', 'Karbonhidrat ve su odağı.'),
  P('2026-10-06', 6, 'easy', 'Düz Parkur / Sokak', 3.5, '3.5 km + 4×80 m', 'Bacak Uyandırma', 'Çok yavaş jog + akıcı kısa sprintler.', [['Jog', '3.5 km çok yavaş', '—'], ['Sprint', '4× 80 m akıcı', '—']]),
  R('2026-10-07', 6, 'Tam Dinlenme', 'Pasif toparlanma.'),
  R('2026-10-08', 6, 'Tam Dinlenme', 'Hidrasyon: su + elektrolit.'),
  R('2026-10-09', 6, 'Tam Dinlenme', 'Mideyi yormayan beslenme.'),
  P('2026-10-10', 6, 'pre', 'Yarış Öncesi', null, '15 dk yürüyüş', 'Aktivasyon', 'Kas gerginliğini alma.', [['Aktivasyon', '15 dk yürüyüş + hafif bacak açma', '—']]),
  P('2026-10-11', 6, 'race', 'LEFKOŞA MARATONU · 10K', 10, '10 km', 'YARIŞ GÜNÜ', 'İlk 3 km kontrollü çık, Dereboyu\'nda atağa kalk, son 3 km\'de finişe kapat.', [['0–3 km', 'Kontrollü çıkış', '5\'05" /km'], ['4–7 km', 'Dereboyu atağı', '4\'45" /km'], ['8–10 km', 'Finiş kapanışı', 'MAKS']], [['Hedef', '48:xx – 49:xx'], ['Ortalama', '4\'48"–4\'57" /km']]),
];

export const BY_DATE: Record<string, number> = {};
ATHLETIC_PLAN.forEach((p, i) => {
  BY_DATE[p.d] = i;
});

export const RACE_DATE = parseISO('2026-10-11');
export const START_DATE = parseISO('2026-09-02');
export const RACE_ISO = '2026-10-11';

export const WEEKS: Record<number, { theme: string; r: string }> = {
  1: { theme: 'TEMEL', r: '2–6 Eylül' },
  2: { theme: 'GELİŞİM', r: '7–13 Eylül' },
  3: { theme: 'YÜKSELİŞ', r: '14–20 Eylül' },
  4: { theme: 'ZİRVE', r: '21–27 Eylül' },
  5: { theme: 'AZALTMA · TAPER', r: '28 Eyl – 4 Eki' },
  6: { theme: 'YARIŞ HAFTASI', r: '5–11 Ekim' },
};

export const TYPES: Record<PlanDay['type'], [string, string]> = {
  easy: ['KOŞU', 'b-easy'],
  quality: ['KALİTE', 'b-q'],
  long: ['UZUN', 'b-long'],
  taper: ['TAPER', 'b-long'],
  rest: ['DİNLENME', 'b-rest'],
  pre: ['HAZIRLIK', 'b-easy'],
  race: ['YARIŞ', 'b-race'],
};

export interface SupplementItem {
  id: string;
  n: string;
  dose: string;
  time: string;
  why: string;
  warn?: string;
}

export const SUPPS: SupplementItem[] = [
  {
    id: 'nac',
    n: 'NAC (N-Asetil Sistein)',
    dose: '1 KAPSÜL · 600 MG',
    time: 'Sabah — aç karnına / öğün arası',
    why: 'Glutatyon öncülü. HIIT ve tempo günlerindeki ağır serbest radikal hasarını nötralize eder; akciğer ve bronş kapasitesini destekler.',
  },
  {
    id: 'o3',
    n: 'Omega 3 (Balık Yağı)',
    dose: '2 KAPSÜL · TRİGLİSERİT FORM',
    time: 'Sabah kahvaltısı veya akşam yemeği ile',
    why: 'Asfalt ve tempolu koşuların eklemlerde ve tendonlarda yarattığı mikro-enflamasyonu baskılar; kardiyovasküler destek.',
  },
  {
    id: 'd3',
    n: 'Vitamin D3 + K2',
    dose: '1 TABLET · 5000 IU',
    time: 'Haftada 3–4 gün · yağlı bir öğünle',
    why: 'Kemik yoğunluğu, kalsiyum metabolizması, bağışıklık ve bacak kaslarının kasılma gücü.',
  },
  {
    id: 'zn',
    n: 'Çinko Bisglisinat',
    dose: '1 TABLET · 25 MG',
    time: 'Akşam yemeğinden sonra',
    why: 'Hücre onarımı, kas protein sentezi ve bağışıklık desteği.',
    warn: 'Aç karnına alma — mide hassasiyeti yapabilir.',
  },
  {
    id: 'mg',
    n: 'Magnezyum Bisglisinat',
    dose: '1–2 KAPSÜL · 200–400 MG',
    time: 'Yatmadan 45–60 dk önce',
    why: 'Kas kramplarını önler, kas liflerini gevşetir, sinir sistemini yatıştırır ve derin uyku kalitesini artırır.',
  },
  {
    id: 'cr',
    n: 'Kreatin Monohidrat',
    dose: '3–5 G TOZ',
    time: 'Antrenman sonrası — su veya meyve suyu ile',
    why: 'Ani hızlanmalarda ve son kilometre sprintlerinde ATP depolarını tazeler; kas toparlanmasını hızlandırır.',
    warn: 'Yarış haftasında ekstra yükleme yapma — standart 3 g yeterli.',
  },
  {
    id: 'ber',
    n: 'Berberin',
    dose: '1 KAPSÜL · 500 MG',
    time: 'Yüksek karbonhidratlı ana öğünden 15 dk önce',
    why: 'İnsülin duyarlılığı ve glikoz dağılımı.',
    warn: 'Koşudan hemen önceki öğünde alma — antrenmanda kan şekerini düşürebilir. Koşu sonrası öğünde kullan.',
  },
];

export const suppListFor = (pd: PlanDay | null) => {
  const base = [SUPPS[0], SUPPS[1]];
  if (pd && pd.type !== 'rest') {
    base.push(SUPPS[5], SUPPS[6]); // kreatin + berberin
  }
  base.push(SUPPS[2], SUPPS[3], SUPPS[4]);
  return base;
};

export const NUTR = [
  {
    tag: 'TÜM 5.5 HAFTA',
    t: 'Günlük Temel Beslenme',
    items: ['Yumurta, yoğurt / lor', 'Balık, tavuk, hindi', 'Yulaf, basmati pirinç, haşlanmış patates', 'Zeytinyağı, ceviz'],
    rules: ['Günde 1.4–1.6 g/kg protein al', 'Ağır kızartma ve aşırı işlenmiş şekerden uzak dur'],
  },
  {
    tag: 'KOŞUDAN 1.5–2 SA ÖNCE',
    t: 'Antrenman Öncesi',
    items: ['Muz', '1 dilim fıstık ezmeli ekmek', 'veya küçük bir kase yulaf ezmesi'],
    rules: ['Mideyi doldurma; kan şekerini dalgalandırmayacak hafif karbonhidrat seç'],
  },
  {
    tag: 'SONRAKİ İLK 45 DK',
    t: 'Antrenman Sonrası',
    items: ['Kefir + muz', 'Proteinli süt', '2 yumurtalı menemen / omlet + tam buğday ekmek'],
    rules: ['Kas tamiri ve glikojen dolum penceresi — geciktirme'],
  },
  {
    tag: 'GÜN BOYU',
    t: 'Hidrasyon & Elektrolit',
    items: ['Günde en az 2.5–3 L su', 'Antrenman sonrası 1 şişe maden suyu veya tuzlu limonlu su'],
    rules: ['Terle atılan sodyum ve potasyumu yerine koy', 'Su kaybı pace düşüşünün 1 numaralı sebebi'],
  },
  {
    tag: '5–10 EKİM',
    t: 'Yarış Haftası',
    items: ['Sindirimi kolay karbonhidratlar: makarna, pilav, patates', 'Normal porsiyonlar'],
    rules: ['Son 48 saat: çiğ sebze, baklagil ve ağır lifi kes', 'Aşırı yükleme yapıp vücudu ağırlaştırma'],
    warn: true,
  },
  {
    tag: '11 EKİM · STARTTAN 2.5 SA ÖNCE',
    t: 'Yarış Sabahı',
    items: ['2 dilim beyaz ekmek + bal / reçel', '1 adet muz', 'Az kahve / su'],
    rules: ['Denenmemiş hiçbir yiyecek / içecek tüketme', 'Yağ ve lif oranı sıfıra yakın olsun'],
    warn: true,
  },
];

export const GUIDE = [
  {
    ic: 'moon',
    t: 'Uyku Düzeni',
    d: 'Günde 7.5–8 saat kesintisiz gece uykusu.',
    why: 'Büyüme hormonu ve kas dokusu tamiri en çok derin uykuda gerçekleşir.',
  },
  {
    ic: 'bolt',
    t: 'Doku Masajı (Miyofasiyal)',
    d: 'Salı ve Perşembe akşamları 5–10 dk foam roller / masaj topu.',
    why: 'Baldır, aşil ve ön kaval sertliğini dağıtır; adım boyu için esneklik sağlar.',
  },
  {
    ic: 'route',
    t: 'Zemin Dengesi',
    d: 'Tempo: tartan pist · Uzun koşu: Metehan dönüşü · Dalgalı: Lemar parkuru.',
    why: 'Eklemlere binen tekdüze darbeyi kırar; sakatlık riskini minimuma indirir.',
  },
  {
    ic: 'clock',
    t: 'Toparlanma Kuralı',
    d: 'Saatin verdiği 48–60 saatlik toparlanma uyarılarına sadık kal.',
    why: 'Dinlenme günleri antrenmanın boşa gitmesini engeller; performansı yükselten asıl faktör dinlenmedir.',
  },
];
