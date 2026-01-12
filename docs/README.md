# Dibooking.id Documentation

Platform booking management untuk penyewaan tempat (venue) dan barang (equipment).

## Daftar Isi

1. [Arsitektur](#arsitektur)
2. [Getting Started](#getting-started)
3. [Database Schema](#database-schema)
4. [Authentication](#authentication)
5. [API Reference](#api-reference)
6. [File Upload](#file-upload)
7. [Features](#features)

---

## Arsitektur

### Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14+** | React framework dengan App Router |
| **TypeScript** | Type-safe JavaScript |
| **Prisma** | ORM untuk PostgreSQL |
| **better-auth** | Authentication dengan OAuth |
| **Cloudflare R2** | Object storage untuk images |
| **Sharp** | Image optimization |
| **Tailwind CSS** | Styling |
| **Shadcn UI** | Component library |
| **Recharts** | Dashboard charts |

### Folder Structure

```
├── app/
│   ├── (auth)/          # Auth pages (sign-in)
│   ├── (main)/          # Main app pages
│   │   ├── [slug]/      # Brand public pages
│   │   ├── dashboard/   # Provider dashboard
│   │   ├── explore/     # Browse brands
│   │   └── my-bookings/ # User bookings
│   └── api/             # API routes
│       ├── auth/        # better-auth endpoints
│       ├── brands/      # Brand CRUD
│       ├── products/    # Product CRUD
│       ├── bookings/    # Booking CRUD
│       └── upload/      # File upload
├── components/
│   ├── home/            # Landing page components
│   ├── sidebar/         # Dashboard sidebar
│   └── ui/              # Shadcn UI components
├── lib/
│   ├── auth.ts          # better-auth server config
│   ├── auth-client.ts   # better-auth client
│   ├── prisma.ts        # Prisma client
│   └── r2/              # R2 upload utilities
├── prisma/
│   └── schema.prisma    # Database schema
└── docs/                # Documentation
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Cloudflare R2 bucket
- Google OAuth credentials

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dibooking"

# Auth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
BETTER_AUTH_SECRET="random-secret-key"
BETTER_AUTH_URL="http://localhost:3000"

# Cloudflare R2
R2_ENDPOINT="https://xxx.r2.cloudflarestorage.com"
R2_PUBLIC_URL="https://pub-xxx.r2.dev"
R2_ACCESS_KEY_ID="your-access-key"
R2_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="dibooking"
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Run development server
npm run dev
```

---

## Database Schema

### Models

#### User
User account dengan role-based access.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| name | String | Display name |
| email | String | Unique email |
| role | Role | USER, PROVIDER, or ADMIN |
| image | String? | Avatar URL |

#### Brand
Provider's business entity.

| Field | Type | Description |
|-------|------|-------------|
| id | String | CUID |
| slug | String | URL-friendly identifier (unique) |
| name | String | Brand name |
| description | String? | About the brand |
| location | String | City/area |
| address | String | Full address |
| type | BrandType | VENUE, RENTAL, SERVICE |
| logoImage | String? | Logo URL (R2) |
| coverImage | String? | Cover photo URL (R2) |
| operatingHours | Json? | Weekly schedule |
| socialMedia | Json? | Social links |
| ownerId | String | FK to User |

#### Product
Items available for booking.

| Field | Type | Description |
|-------|------|-------------|
| id | String | CUID |
| name | String | Product name |
| description | String? | Details |
| features | String[] | Feature list |
| price | Int | Price in IDR |
| priceUnit | String | "hari", "jam", "event" |
| images | String[] | Image URLs (R2) |
| type | ProductType | VENUE, EQUIPMENT, PACKAGE |
| capacity | String? | For venues |
| brandId | String | FK to Brand |

#### Booking
Reservation records.

| Field | Type | Description |
|-------|------|-------------|
| id | String | CUID |
| bookingCode | String | Unique booking reference |
| startDate | DateTime | Booking start |
| endDate | DateTime | Booking end |
| totalPrice | Int | Calculated price |
| status | BookingStatus | PENDING, CONFIRMED, COMPLETED, CANCELLED |
| paymentStatus | PaymentStatus | UNPAID, PAID, REFUNDED |
| customerName | String | Booker name |
| customerPhone | String | Contact phone |
| productId | String | FK to Product |
| brandId | String | FK to Brand |
| userId | String? | FK to User (if logged in) |

### Enums

```prisma
enum Role {
  USER      // Regular user
  PROVIDER  // Has brand(s)
  ADMIN     // Platform admin
}

enum BrandType {
  VENUE     // Physical venues
  RENTAL    // Equipment rental
  SERVICE   // Service providers
}

enum ProductType {
  VENUE
  EQUIPMENT
  PACKAGE
}

enum BookingStatus {
  PENDING    // Waiting confirmation
  CONFIRMED  // Approved by provider
  COMPLETED  // Booking finished
  CANCELLED  // Cancelled
}

enum PaymentStatus {
  UNPAID
  PAID
  REFUNDED
}
```

---

## Authentication

### Provider: better-auth

Better-auth handles OAuth authentication dengan Prisma adapter.

### Flow

1. User clicks "Login with Google"
2. Redirects to Google OAuth
3. On success, creates/updates User in database
4. Session stored in cookies
5. Role determines access:
   - **USER**: Can browse, book, view own bookings
   - **PROVIDER**: + Can manage own brand(s)
   - **ADMIN**: + Full access

### Role Upgrade

When a USER creates their first Brand, their role is automatically upgraded to PROVIDER.

### Middleware Protection

Routes under `/dashboard/*` require PROVIDER or ADMIN role. Unauthorized users are redirected to `/become-provider`.

### Code Example

```typescript
// Client-side
import { authClient } from "@/lib/auth-client";

// Get session
const { data: session } = await authClient.getSession();

// Login
await authClient.signIn.social({
  provider: "google",
  callbackURL: "/dashboard",
});

// Logout
await authClient.signOut();
```

```typescript
// Server-side (API routes)
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const session = await auth.api.getSession({
  headers: await headers(),
});

if (!session?.user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

---

## API Reference

### Brands

#### List Brands
```
GET /api/brands
Query params:
  - ownerId: string (filter by owner)
  - slug: string
  - type: string (VENUE, RENTAL, SERVICE)
  - limit: number (default 20)
  - offset: number (default 0)
```

#### Get Brand
```
GET /api/brands/:id
:id can be brand ID or slug
```

#### Create Brand
```
POST /api/brands
Body: {
  name: string (required)
  slug: string (required, unique)
  location: string (required)
  address: string (required)
  description?: string
  phone?: string
  email?: string
  type?: "VENUE" | "RENTAL" | "SERVICE"
  logoImage?: string (R2 URL)
  operatingHours?: object
  socialMedia?: object
}
```

#### Update Brand
```
PATCH /api/brands/:id
Body: (same as create, all optional)
Requires: Brand owner or ADMIN
```

#### Delete Brand
```
DELETE /api/brands/:id
Soft delete (sets isActive = false)
Requires: Brand owner or ADMIN
```

### Products

#### List Products
```
GET /api/products
Query params:
  - brandId: string
  - brandSlug: string
  - type: string
  - search: string
  - limit: number
  - offset: number
```

#### Get Product
```
GET /api/products/:id
```

#### Create Product
```
POST /api/products
Body: {
  name: string (required)
  brandId: string (required)
  type: string (required)
  price: number (required)
  priceUnit?: string
  description?: string
  features?: string[]
  images?: string[]
  capacity?: string
  size?: string
}
Requires: Brand owner
```

#### Update Product
```
PATCH /api/products/:id
Requires: Brand owner or ADMIN
```

#### Delete Product
```
DELETE /api/products/:id
Soft delete
Requires: Brand owner or ADMIN
```

### Bookings

#### List Bookings
```
GET /api/bookings
Query params:
  - brandId: string
  - productId: string
  - status: string
  - userId: string
  - startDate: string (ISO date)
  - endDate: string (ISO date)
  - limit: number
  - offset: number
```

#### Get Booking
```
GET /api/bookings/:id
:id can be booking ID or bookingCode
```

#### Create Booking
```
POST /api/bookings
Body: {
  productId: string (required)
  startDate: string (required, ISO date)
  endDate: string (required, ISO date)
  customerName: string (required)
  customerPhone: string (required)
  startTime?: string
  endTime?: string
  customerEmail?: string
  customerOrg?: string
  notes?: string
}
```

#### Update Booking Status
```
PATCH /api/bookings/:id
Body: {
  status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
  paymentStatus?: "UNPAID" | "PAID" | "REFUNDED"
  paymentMethod?: string
  notes?: string
}
Requires: Brand owner or ADMIN (for status updates)
```

#### Cancel Booking
```
DELETE /api/bookings/:id
Sets status to CANCELLED
Requires: Booking owner, Brand owner, or ADMIN
```

### Upload

#### Upload Image
```
POST /api/upload
Content-Type: multipart/form-data
Body:
  - file: File (required, max 2MB)
  - folder: string ("brands", "products", "avatars")

Response: {
  success: true,
  url: string,
  key: string,
  originalSize: number,
  optimizedSize: number,
  savedBytes: number
}
```

---

## File Upload

### Configuration

Files are uploaded to Cloudflare R2 with automatic optimization.

### Constraints

| Constraint | Value |
|------------|-------|
| Max upload size | 2 MB |
| Max optimized size | 1 MB |
| Output format | WebP |
| Quality | 80 (auto-adjusted if needed) |

### Optimization Process

1. Validate file size (≤ 2MB)
2. Validate MIME type (JPEG, PNG, WebP, GIF)
3. Convert to WebP using Sharp
4. Resize if larger than 1920x1080
5. Progressively reduce quality if still > 1MB
6. Upload to R2 with cache headers

### Usage Example

```typescript
// Client-side upload
const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "brands");

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error);
  }

  return data.url;
};
```

### R2 Folder Structure

```
dibooking/
├── brands/      # Brand logos and covers
├── products/    # Product images
├── avatars/     # User avatars
└── uploads/     # General uploads
```

---

## Features

### User Features

1. **Browse Brands** (`/explore`)
   - Search and filter brands
   - View brand profiles

2. **View Brand Page** (`/[slug]`)
   - See brand info, products, operating hours
   - Filter by product type (venue/equipment/package)

3. **Book Products**
   - Select dates via calendar
   - Fill booking form
   - Receive booking code

4. **My Bookings** (`/my-bookings`)
   - View booking history
   - Track booking status

### Provider Features

1. **Dashboard** (`/dashboard`)
   - Analytics overview
   - Recent bookings
   - Revenue stats

2. **Brand Settings** (`/dashboard/settings`)
   - Update brand info
   - Upload logo with auto-optimization
   - Set operating hours

3. **Social Media** (`/dashboard/settings/social`)
   - Configure social links

4. **WhatsApp Templates** (`/dashboard/settings/whatsapp`)
   - Customize notification templates

5. **Products Management** (`/dashboard/products`)
   - Add/edit/delete products
   - Upload product images

6. **Schedule** (`/dashboard/schedule`)
   - Calendar view of bookings
   - Manage availability

---

## Development Notes

### Adding New Features

1. Update Prisma schema if needed
2. Run `npx prisma db push`
3. Create API route in `app/api/`
4. Create/update UI components
5. Update this documentation

### Testing

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build
```

### Deployment

1. Set all environment variables
2. Run `npx prisma migrate deploy`
3. Deploy to Vercel/similar platform

---

## Changelog

### v1.0.0 (January 2026)

- Initial release
- Authentication with Google OAuth
- Brand management
- Product management
- Booking system
- R2 image upload with optimization
- Provider dashboard
