import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return rss({
    title: 'Stefan Ilić – Blog',
    description: 'Notes on Business Central, AL and AI-assisted development.',
    site: context.site,
    items: posts.map((p) => ({ title: p.data.title, pubDate: p.data.pubDate, description: p.data.description, link: `/blog/${p.id}/` })),
  });
}
