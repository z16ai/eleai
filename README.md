# eleAI Studio

The definitive workstation for generative AI artists. A next-generation creative suite for high-fidelity image, video, and audio creation powered by neural engines.

## Features

### Image Studio
- AI-powered image generation with multiple model support
- Aspect ratio and resolution options
- History gallery with regenerate capability

### Video Studio (Coming in Phase 2)
- AI-powered video generation
- Queue-based processing

### Audio Lab
- Text-to-speech synthesis with multiple voice options
- Voice filtering by gender, age, language, and scene
- Custom voice cloning support

### Plaza
- Community shared creations gallery
- Browse and explore AI-generated artworks

### Authentication
- Google OAuth integration
- Web3 wallet login (Ethereum, Solana)

## Tech Stack

- **Framework**: Next.js 14.2.5
- **UI**: React 18 + Tailwind CSS
- **Database**: Supabase
- **Authentication**: Supabase Auth (Google, Web3)
- **AI Models**: Doubao (ByteDance), WanXiang (Alibaba), Seedance (Volcengine)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── image/             # Image generation page
│   ├── video/             # Video generation page
│   ├── audio/             # Audio synthesis page
│   ├── plaza/             # Community gallery
│   ├── roadmap/           # Product roadmap
│   └── auth/             # Authentication
├── components/             # Reusable React components
├── lib/                   # Utility functions
└── styles/                # Global styles
```

## Supabase Database Connection

### Connect via JavaScript SDK (without Docker)

Create a script to query the database:

```javascript
// check-db.mjs
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ddxcnhidzlzlatzeibon.supabase.co',
  'your-anon-key'
)

// Query examples:
const { data, error } = await supabase
  .from('image_generations')
  .select('*')
  .order('created_at', { ascending: false })
  .limit(10)
```

Run with:
```bash
node check-db.mjs
```

### Connect via Supabase CLI (requires Docker)

```bash
# Link to remote project
cd supabase
supabase link --project-ref ddxcnhidzlzlatzeibon

# Query remote database (requires password)
supabase db query "SELECT * FROM image_generations;" --db-url "postgresql://..."

# List migrations
supabase migration list
```

## Environment Variables

Create a `.env.local` file with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## License

© 2026 eleAI Studio // The Digital Curator