const fs = require('fs');
let content = fs.readFileSync('src/pages/public/LandingPage.tsx', 'utf8');

const target = `const { data, error } = await supabase.from('content_cms').select('*').eq('page', 'landing').single();
        if (data && !error) {
          if (data.hero_title) setHeroTitle(data.hero_title);
          if (data.hero_subtitle) setHeroSubtitle(data.hero_subtitle);
        }`;

const replacement = `const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
        if (data && !error) {
          if (data.hero_title) setHeroTitle(data.hero_title);
          if (data.hero_subtitle) setHeroSubtitle(data.hero_subtitle);
        }`;

content = content.replace(target, replacement);
fs.writeFileSync('src/pages/public/LandingPage.tsx', content);
