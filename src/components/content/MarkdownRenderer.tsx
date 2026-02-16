import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import {
  preprocessMkdocsAdmonitions,
  preprocessMathFixup,
  rehypeAdmonitions,
} from "@/lib/remark-mkdocs";
import { buildFileToSlugMap } from "@/lib/content";

interface MarkdownRendererProps {
  content: string;
}

function rewriteLinks(
  markdown: string,
  fileToSlug: Map<string, string>
): string {
  return markdown.replace(
    /\[([^\]]*)\]\(([^)]+)\)/g,
    (match, text, url) => {
      if (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("#") ||
        url.startsWith("/")
      ) {
        return match;
      }

      if (url.endsWith(".md")) {
        const filename = url.split("/").pop() || url;
        const cleanPath = url.replace(/^(\.\.\/)+/, "");

        const slug =
          fileToSlug.get(cleanPath) ||
          fileToSlug.get(filename);

        if (slug) {
          return `[${text}](/Hi-Tech-map/${slug})`;
        }

        return text;
      }

      if (
        url.endsWith(".py") ||
        url.endsWith(".ipynb") ||
        url.endsWith(".csv") ||
        url.endsWith(".txt")
      ) {
        return text;
      }

      return match;
    }
  );
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  let processed = content;
  processed = preprocessMkdocsAdmonitions(processed);
  processed = preprocessMathFixup(processed);

  const fileToSlug = buildFileToSlugMap();
  processed = rewriteLinks(processed, fileToSlug);

  return (
    <article className="prose dark:prose-invert max-w-none" dir="rtl">
      <MDXRemote
        source={processed}
        options={{
          mdxOptions: {
            format: "md",
            remarkPlugins: [remarkMath, remarkGfm],
            rehypePlugins: [
              rehypeRaw,
              rehypeKatex,
              rehypeAdmonitions,
              rehypeSlug,
            ],
          },
        }}
      />
    </article>
  );
}
