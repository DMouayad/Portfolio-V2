import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
	experience: defineCollection({
		// Load Markdown files in the src/content/work directory.
		loader: glob({ base: './src/content/experience', pattern: ['**/*.md', '**/*mdx'] }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			publishDate: z.coerce.date(),
			techStack: z.array(z.string()),
			links: z.array(z.object({
				label: z.string(),
				url: z.string(),
				icon: z.string().optional(),
			})),
			img: z.string(),
			img_alt: z.string().optional(),
		}),
	}),
	project: defineCollection({
		loader: glob({ base: './src/content/project', pattern: ['**/*.md', '**/*mdx'] }),
		schema: z.object({
			title: z.string(),
			description: z.string(),
			url: z.string(),
			publishDate: z.coerce.date(),
			tags: z.array(z.string()),
		}),
	}),
};
