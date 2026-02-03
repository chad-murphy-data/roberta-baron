import { useState } from 'react'

// Get base URL from Vite (handles /roberta-baron/ prefix)
const BASE = import.meta.env.BASE_URL || '/'

// Helper to create asset paths with base URL
function assetPath(path: string): string {
  // Remove leading slash from path if present, BASE already has trailing slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${BASE}${cleanPath}`
}

// Placeholder paths
const PLACEHOLDER_IMAGE = assetPath('assets/images/placeholder.svg')
const PLACEHOLDER_CRIMINAL = assetPath('assets/images/criminals/placeholder.svg')
const PLACEHOLDER_CITY = assetPath('assets/images/cities/placeholder.svg')
const PLACEHOLDER_LOCATION = assetPath('assets/images/locations/placeholder.svg')
const GENERIC_CITY = assetPath('assets/images/cities/generic.png')

// Pilot character poses
export type PilotPose = 'hi' | 'excited' | 'worried' | 'pointing'

// Cities that have custom images
const CITIES_WITH_IMAGES = new Set([
  'austin',
  'boston',
  'chicago',
  'cincinnati',
  'seattle',
  'san-francisco',
  'new-york'
])

// Map company names to their headquarters city (for city images)
const COMPANY_CITY_MAP: Record<string, string> = {
  // Tech
  'apple': 'cupertino',
  'google': 'mountain-view',
  'meta': 'menlo-park',
  'microsoft': 'seattle',
  'amazon': 'seattle',
  'tesla': 'austin',
  'dell': 'austin',
  'oracle': 'austin',
  'salesforce': 'san-francisco',
  'uber': 'san-francisco',
  'airbnb': 'san-francisco',
  'twitter': 'san-francisco',
  'netflix': 'los-gatos',
  'adobe': 'san-jose',
  'intel': 'santa-clara',
  'nvidia': 'santa-clara',
  'hp': 'palo-alto',
  'cisco': 'san-jose',

  // Finance
  'jpmorgan': 'new-york',
  'goldman sachs': 'new-york',
  'morgan stanley': 'new-york',
  'citibank': 'new-york',
  'bank of america': 'charlotte',
  'wells fargo': 'san-francisco',
  'fidelity': 'boston',
  'charles schwab': 'san-francisco',
  'capital one': 'mclean',
  'american express': 'new-york',

  // Retail
  'walmart': 'bentonville',
  'target': 'minneapolis',
  'costco': 'seattle',
  'home depot': 'atlanta',
  'lowes': 'charlotte',
  'best buy': 'minneapolis',
  'walgreens': 'chicago',
  'cvs': 'providence',
  'kroger': 'cincinnati',
  'publix': 'lakeland',

  // Food & Beverage
  'starbucks': 'seattle',
  'mcdonalds': 'chicago',
  'chipotle': 'newport-beach',
  'chick-fil-a': 'atlanta',
  'coca-cola': 'atlanta',
  'pepsico': 'purchase',
  'kraft heinz': 'chicago',
  'general mills': 'minneapolis',
  'kellogg': 'battle-creek',
  'tyson': 'springdale',

  // Entertainment & Media
  'disney': 'burbank',
  'warner bros': 'burbank',
  'paramount': 'los-angeles',
  'sony': 'culver-city',
  'nbc universal': 'new-york',
  'fox': 'new-york',
  'viacom': 'new-york',

  // Automotive
  'ford': 'detroit',
  'gm': 'detroit',
  'chrysler': 'detroit',
  'toyota usa': 'plano',
  'honda usa': 'torrance',

  // Airlines
  'american airlines': 'fort-worth',
  'delta': 'atlanta',
  'united': 'chicago',
  'southwest': 'dallas',
  'jetblue': 'new-york',

  // Shipping
  'ups': 'atlanta',
  'fedex': 'memphis',
  'usps': 'washington-dc',

  // Telecom
  'at&t': 'dallas',
  'verizon': 'new-york',
  't-mobile': 'bellevue',

  // Apparel
  'nike': 'beaverton',
  'gap': 'san-francisco',
  'levi strauss': 'san-francisco',
  'vf corporation': 'denver',
  'pvh': 'new-york',
}

// Convert company/brand name to slug for lookup
function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

// Map city names to image slugs (for special cases)
const CITY_NAME_TO_IMAGE_SLUG: Record<string, string> = {
  'new york city': 'new-york',
  'new york': 'new-york',
  'nyc': 'new-york',
}

// Convert a full city name like "Seattle, WA" or "San Francisco, CA" to image slug
function cityNameToImageSlug(cityName: string): string {
  // Remove state suffix if present (e.g., "Seattle, WA" -> "Seattle")
  const cityOnly = cityName.split(',')[0].trim().toLowerCase()

  // Check for special cases first
  if (CITY_NAME_TO_IMAGE_SLUG[cityOnly]) {
    return CITY_NAME_TO_IMAGE_SLUG[cityOnly]
  }

  // Convert to slug
  return toSlug(cityOnly)
}

// Get the city slug for a company name
function getCityForCompany(companyName: string): string {
  const slug = toSlug(companyName)

  // Direct lookup
  if (COMPANY_CITY_MAP[slug]) {
    return COMPANY_CITY_MAP[slug]
  }

  // Try lowercase lookup
  const lowerName = companyName.toLowerCase()
  if (COMPANY_CITY_MAP[lowerName]) {
    return COMPANY_CITY_MAP[lowerName]
  }

  // Try to find partial match
  for (const [key, city] of Object.entries(COMPANY_CITY_MAP)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return city
    }
  }

  return 'default'
}

// Get criminal portrait image path
export function getCriminalImage(criminalId: string): string {
  const slug = toSlug(criminalId)
  return assetPath(`assets/images/criminals/${slug}.png`)
}

// Get city image path directly by city name
export function getCityImage(cityName: string): string {
  const slug = toSlug(cityName)
  return assetPath(`assets/images/cities/${slug}.png`)
}

// Get city image path for a company (maps company → city)
export function getCompanyCityImage(companyName: string): string {
  const city = getCityForCompany(companyName)
  // Try PNG first, fallback handled by component
  return assetPath(`assets/images/cities/${city}.png`)
}

// Get location image path
export function getLocationImage(locationId: string): string {
  const slug = toSlug(locationId)
  return assetPath(`assets/images/locations/${slug}.png`)
}

// Get Roberta Baron image
export function getRobertaBaronImage(): string {
  return assetPath('assets/images/characters/roberta_baron.png')
}

// Get Pilot image by pose
export function getPilotImage(pose: PilotPose = 'hi'): string {
  return assetPath(`assets/images/characters/pilot_${pose}.png`)
}

// Check if a city has a custom image
export function cityHasCustomImage(citySlug: string): boolean {
  return CITIES_WITH_IMAGES.has(citySlug)
}

// Get UI asset path
export function getUIAsset(name: string): string {
  return assetPath(`assets/images/ui/${name}`)
}

// Props for AssetImage component
interface AssetImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  fallback?: string
  onLoad?: () => void
}

// React component with automatic fallback handling
export function AssetImage({
  src,
  alt,
  className,
  style,
  fallback = PLACEHOLDER_IMAGE,
  onLoad
}: AssetImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc(fallback)
    }
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      onLoad={onLoad}
    />
  )
}

// Specialized components for common use cases

interface CriminalImageProps {
  criminalId: string
  alt?: string
  className?: string
  style?: React.CSSProperties
}

export function CriminalImage({ criminalId, alt, className, style }: CriminalImageProps) {
  return (
    <AssetImage
      src={getCriminalImage(criminalId)}
      alt={alt || `Criminal: ${criminalId}`}
      className={className}
      style={style}
      fallback={PLACEHOLDER_CRIMINAL}
    />
  )
}

interface CityImageProps {
  cityName?: string
  companyName?: string
  alt?: string
  className?: string
  style?: React.CSSProperties
  showOverlay?: boolean // Show city name overlay for generic images
}

export function CityImage({ cityName, companyName, alt, className, style, showOverlay = false }: CityImageProps) {
  const citySlug = cityName
    ? cityNameToImageSlug(cityName)
    : companyName
      ? getCityForCompany(companyName)
      : 'default'

  // Use custom image if available, otherwise use generic
  const hasCustomImage = cityHasCustomImage(citySlug)
  const src = hasCustomImage
    ? assetPath(`assets/images/cities/${citySlug}.png`)
    : GENERIC_CITY

  const displayName = cityName || (companyName ? getCityDisplayName(citySlug) : 'Unknown City')
  const shouldShowOverlay = showOverlay && !hasCustomImage

  if (shouldShowOverlay) {
    return (
      <div style={{ position: 'relative', ...style }} className={className}>
        <AssetImage
          src={src}
          alt={alt || displayName}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          fallback={PLACEHOLDER_CITY}
        />
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          padding: '16px 8px 8px',
          textAlign: 'center'
        }}>
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
            {displayName}
          </span>
        </div>
      </div>
    )
  }

  return (
    <AssetImage
      src={src}
      alt={alt || displayName}
      className={className}
      style={style}
      fallback={PLACEHOLDER_CITY}
    />
  )
}

// Get display name for a city slug
function getCityDisplayName(slug: string): string {
  const displayNames: Record<string, string> = {
    'austin': 'Austin, TX',
    'boston': 'Boston, MA',
    'chicago': 'Chicago, IL',
    'cincinnati': 'Cincinnati, OH',
    'seattle': 'Seattle, WA',
    'san-francisco': 'San Francisco, CA',
    'new-york': 'New York, NY',
    'minneapolis': 'Minneapolis, MN',
    'bentonville': 'Bentonville, AR',
    'atlanta': 'Atlanta, GA',
    'detroit': 'Detroit, MI',
    'charlotte': 'Charlotte, NC',
    'omaha': 'Omaha, NE',
    'cupertino': 'Cupertino, CA',
    'mountain-view': 'Mountain View, CA',
    'menlo-park': 'Menlo Park, CA',
    'los-gatos': 'Los Gatos, CA',
    'san-jose': 'San Jose, CA',
    'santa-clara': 'Santa Clara, CA',
    'palo-alto': 'Palo Alto, CA',
    'mclean': 'McLean, VA',
    'providence': 'Providence, RI',
    'lakeland': 'Lakeland, FL',
    'newport-beach': 'Newport Beach, CA',
    'purchase': 'Purchase, NY',
    'battle-creek': 'Battle Creek, MI',
    'springdale': 'Springdale, AR',
    'burbank': 'Burbank, CA',
    'los-angeles': 'Los Angeles, CA',
    'culver-city': 'Culver City, CA',
    'plano': 'Plano, TX',
    'torrance': 'Torrance, CA',
    'fort-worth': 'Fort Worth, TX',
    'dallas': 'Dallas, TX',
    'memphis': 'Memphis, TN',
    'washington-dc': 'Washington, DC',
    'bellevue': 'Bellevue, WA',
    'beaverton': 'Beaverton, OR',
    'denver': 'Denver, CO'
  }
  return displayNames[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

interface LocationImageProps {
  locationId: string
  alt?: string
  className?: string
  style?: React.CSSProperties
}

export function LocationImage({ locationId, alt, className, style }: LocationImageProps) {
  return (
    <AssetImage
      src={getLocationImage(locationId)}
      alt={alt || `Location: ${locationId}`}
      className={className}
      style={style}
      fallback={PLACEHOLDER_LOCATION}
    />
  )
}
