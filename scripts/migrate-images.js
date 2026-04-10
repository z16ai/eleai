const fs = require('fs');
const crypto = require('crypto');

const USER_ID = '33538287-6906-41c9-852a-9491f20e6c57';
const INDEX_PATH = '/Users/axin/localproject/eleai-studio/aigenerate/index.json';

const images = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf-8'));

console.log(`Found ${images.length} images to migrate`);

// Generate SQL insert statements
let sql = '';
for (const img of images) {
  const id = crypto.randomUUID(); // Generate proper UUID
  const modelId = img.modelName.includes('Flux') ? 'flux-2-flex' : 
                  img.modelName.includes('4.5') ? 'doubao-seedream-4-5' : 
                  img.modelName.includes('5.0') ? 'doubao-seedream-5-0' : 
                  img.modelName.includes('4.0') ? 'doubao-seedream-4-0' : img.modelName;
  
  const createdAt = new Date(img.createdAt).toISOString();
  
  sql += `INSERT INTO public.image_generations (id, user_id, prompt, model_id, aspect_ratio, quality, image_url, created_at) VALUES ('${id}', '${USER_ID}', '${img.prompt.replace(/'/g, "''")}', '${modelId}', '${img.aspectRatio}', '${img.quality}', '${img.url}', '${createdAt}');\n`;
}

fs.writeFileSync('/Users/axin/localproject/eleai-studio/scripts/migrate_images.sql', sql);
console.log('SQL file created: migrate_images.sql');
console.log(`Generated ${images.length} INSERT statements`);