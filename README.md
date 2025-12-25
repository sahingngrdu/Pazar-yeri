# Pazaryeri - Frontend Marketplace Application

Modern, ölçeklenebilir ve SEO-uyumlu bir pazaryeri frontend uygulaması.

> **Frontend Developer Technical Case** - Next.js 16, TypeScript, Zustand, Tailwind CSS

---

## 🚀 Teknoloji Stack

| Kategori | Teknoloji | Versiyon |
|----------|-----------|----------|
| Framework | Next.js | 16.1.1 |
| Dil | TypeScript | 5.x (strict mode) |
| Styling | Tailwind CSS | 4.x |
| State | Zustand | 5.0.9 |
| Animasyon | Framer Motion | 12.x |
| i18n | next-intl | 4.6.1 |
| Testing | Jest + RTL | 30.x |
| UI Docs | Storybook | 10.x |

---

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/           # i18n dynamic routing
│   │   ├── page.tsx        # Homepage (SSG)
│   │   ├── products/       # Ürün detay sayfaları
│   │   ├── categories/     # Kategori sayfaları
│   │   ├── favorites/      # Favoriler (Client-side)
│   │   ├── cart/           # Sepet sayfası
│   │   ├── search/         # Arama sonuçları
│   │   ├── not-found.tsx   # 404 sayfası
│   │   ├── error.tsx       # 500 hata sayfası
│   │   └── layout.tsx      # Locale layout + metadata
│   ├── sitemap.ts          # Dynamic sitemap.xml
│   ├── robots.ts           # robots.txt
│   └── globals.css         # Global stiller
├── components/             # Atomic Design
│   ├── atoms/              # Button, Badge, Skeleton, Input
│   ├── molecules/          # ProductCard, FavoriteButton, SearchBar
│   ├── organisms/          # Header, Footer
│   ├── templates/          # Layout templates
│   ├── shared/             # Shared dynamic components (DynamicHeader/Footer)
│   ├── providers/          # ThemeProvider
│   └── seo/                # JSON-LD components
├── store/                  # Zustand stores
│   ├── favorites.ts        # Favori yönetimi (normalized)
│   ├── cart.ts             # Sepet yönetimi
│   ├── ui.ts               # UI state (tema, modals)
│   └── __tests__/          # Store testleri
├── lib/
│   ├── api/                # API client yapısı
│   └── utils/              # Utility fonksiyonları
├── mappers/                # Veri dönüşüm katmanı
├── types/                  # TypeScript type definitions
├── data/                   # Mock JSON data
├── hooks/                  # Custom React hooks
├── i18n/                   # i18n configuration
└── messages/               # Çeviri dosyaları (tr.json, en.json)
```

---

## 🏃‍♂️ Kurulum & Çalıştırma

### Gereksinimler
- Node.js 18.17 veya üzeri
- npm 9.x veya üzeri

### Kurulum

```bash
# Repository'yi klonla
git clone https://github.com/username/pazaryeri.git
cd pazaryeri

# Bağımlılıkları yükle
npm install
```

### Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu (localhost:3000) |
| `npm run build` | Production build |
| `npm start` | Production sunucusu |
| `npm run lint` | ESLint kontrolü |
| `npm run lint:fix` | ESLint otomatik düzeltme |
| `npm run format` | Prettier ile formatlama |
| `npm run format:check` | Format kontrolü |
| `npm test` | Jest testlerini çalıştır |
| `npm run test:watch` | Watch modunda test |
| `npm run test:coverage` | Test coverage raporu |
| `npm run storybook` | Storybook (localhost:6006) |
| `npm run build-storybook` | Storybook static build |

---

## 🎨 Rendering Stratejileri

| Sayfa | Strateji | Gerekçe |
|-------|----------|---------|
| Homepage | **SSG** | `generateStaticParams()` ile statik üretim, içerik nadiren değişir |
| Kategoriler | **SSG + Dynamic** | Kategori slug'ları önceden bilinir |
| Ürün Detay | **SSG + fallback** | Bireysel ürünler build time'da oluşturulur |
| Arama | **SSR** | Query-bağımlı, dinamik sonuçlar |
| Favoriler | **Client-side** | Kullanıcıya özel, localStorage'dan |
| Sepet | **Client-side** | Kullanıcı state'i, SSR gereksiz |

### Data Fetching Yaklaşımı

```typescript
// Server Component'lerde
const products = productsData.products as Product[];

// Client Component'lerde (Zustand)
const { items, addToFavorites } = useFavoritesStore();
```

> **Not**: Mock data kullanıldığından `fetch` yerine JSON import tercih edildi. Production'da API client kullanılmalı.

---

## 🌍 Internationalization (i18n)

URL-tabanlı dil yönetimi (`next-intl`):

| URL | Dil |
|-----|-----|
| `/tr/*` | 🇹🇷 Türkçe (varsayılan) |
| `/en/*` | 🇬🇧 İngilizce |

### Kullanım

```typescript
// Server Component
const t = await getTranslations('nav');
<h1>{t('home')}</h1>

// Client Component
const t = useTranslations('common');
<button>{t('addToCart')}</button>
```

---

## ⚡ Performans İyileştirmeleri

- **Code Splitting**: `LazyProductGrid` ile ağır komponentler ve ürün listeleri viewport'a girince yüklenir.
- **Dynamic Imports**: Header ve Footer tüm sayfalarda merkezi yapıdan (`SharedDynamicComponents`) lazy load edilir.
- **Image Optimization**:
  - `next/image` ile modern formatlar (WebP/AVIF)
  - Layout kaymalarını önlemek için `width/height` ve `fill` kullanımı
  - LCP için critical görsellerde `priority` flag'i
- **Bundle Optimization**: Route-based splitting default olarak aktif.

---

## 📊 State Management

Zustand ile **normalize edilmiş** state yapısı:

```typescript
// O(1) lookup için normalize yapı
interface FavoritesState {
  items: Record<string, Product>;  // ID bazlı hızlı erişim
  ids: string[];                   // Sıralama korunur
  
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (id: string) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: string) => boolean;
}
```

### Neden Normalize?
- ✅ O(1) lookup performance
- ✅ Duplicate önleme
- ✅ Kolay test edilebilirlik
- ✅ Ölçeklenebilir yapı

---

## 🧪 Testing

**93 test** - Jest + React Testing Library

```bash
# Testleri çalıştır
npm test

# Coverage raporu
npm run test:coverage
```

### Test Coverage

| Modül | Test Sayısı |
|-------|-------------|
| Button | 17 |
| ProductCard | 14 |
| FavoriteButton | 8 |
| Skeleton | 11 |
| Favorites Store | 15 |
| Cart Store | 20 |
| Formatters | 8 |

---

## 🔍 SEO & Accessibility

### SEO Özellikleri
- ✅ Dynamic `generateMetadata()` - sayfa bazlı meta
- ✅ OpenGraph & Twitter Cards
- ✅ JSON-LD yapılandırılmış veri (Organization, Product, ItemList, Breadcrumb)
- ✅ `sitemap.xml` - otomatik oluşturma
- ✅ `robots.txt` - crawler kuralları

### Accessibility (a11y)
- ✅ ARIA labels (`aria-label`, `aria-pressed`, `aria-busy`)
- ✅ Keyboard navigation (`focus-visible` stilleri)
- ✅ Semantic HTML (`article`, `nav`, `main`, `footer`)
- ✅ Color contrast (Dark mode uyumlu)
- ✅ Storybook a11y addon ile test

---

## 🌙 Dark Mode

- ✅ Sistem tercihini takip (`prefers-color-scheme`)
- ✅ Manuel tema değiştirme (Header toggle)
- ✅ localStorage ile kalıcılık
- ✅ SSR uyumlu (hydration mismatch yok)

---

## 🧩 Atomic Design

| Katman | Açıklama | Örnekler |
|--------|----------|----------|
| **Atoms** | Temel UI elemanları | Button, Badge, Skeleton, Input |
| **Molecules** | Birleşik küçük bileşenler | ProductCard, FavoriteButton, SearchBar |
| **Organisms** | Karmaşık bölümler | Header, Footer |
| **Templates** | Sayfa şablonları | MainLayout |

---

## 📝 Varsayımlar & Trade-off'lar

### Varsayımlar

1. **API Yapısı**: `https://api.meshur.co/docs` referans alındı
2. **Mock Data**: Gerçek API olmadığından `data/*.json` dosyaları kullanıldı
3. **Resimler**: Placeholder görüntüler kullanıldı
4. **Auth**: Kimlik doğrulama scope dışında bırakıldı

### Trade-off'lar

| Karar | Gerekçe |
|-------|---------|
| **JSON import vs fetch** | Mock data için fetch overhead gereksiz |
| **Client-side favorites** | Kullanıcıya özel, SSR gereksiz |
| **Zustand vs Redux** | Daha hafif, boilerplate az, bu proje için yeterli |
| **next-intl vs next-i18next** | App Router native desteği, daha modern |
| **Tailwind vs CSS Modules** | Utility-first, hızlı geliştirme, case gereksinimleri |

### Production İçin Gerekli İyileştirmeler

- [ ] Gerçek API entegrasyonu
- [ ] Kimlik doğrulama (NextAuth.js)
- [ ] CDN görüntü optimizasyonu
- [ ] Error boundary iyileştirmeleri
- [ ] Performance monitoring (Sentry, Vercel Analytics)
- [ ] CI/CD pipeline

---

## 📚 Storybook

UI bileşenlerini izole olarak geliştirme ve test etme:

```bash
npm run storybook
```

**localhost:6006** adresinde açılır.

---

## 🔧 Kod Kalitesi

- ✅ **ESLint** - Next.js kuralları + Storybook plugin
- ✅ **Prettier** - Otomatik kod formatlama
- ✅ **TypeScript strict** - Tip güvenliği
- ✅ **Barrel exports** - Temiz importlar
- ✅ **Path aliases** - `@/` ile kolay importlar

---

## 📄 Lisans

MIT License

