export function preprocessMathFixup(markdown: string): string {
  let result = markdown.replace(
    /\\\((.+?)\\\)/g,
    (_, math) => `$${math}$`
  );

  result = result.replace(
    /\\\[([\s\S]+?)\\\]/g,
    (_, math) => `$$${math}$$`
  );

  result = result
    .replace(/\\begin\{align\}/g, "\\begin{aligned}")
    .replace(/\\end\{align\}/g, "\\end{aligned}")
    .replace(/\\begin\{align\*\}/g, "\\begin{aligned}")
    .replace(/\\end\{align\*\}/g, "\\end{aligned}")
    .replace(/\\stackrel\{([^}]*)\}\{([^}]*)\}/g, "\\overset{$1}{$2}")
    .replace(/\\bold\{([^}]*)\}/g, "\\mathbf{$1}")
    .replace(/\\htext\{/g, "\\text{");

  result = result.replace(/^((?:>\s*)*)\$\$(\\begin\{)/gm, "$1$$\n$1$2");
  result = result.replace(/^((?:>\s*)*)(\\end\{[^}]+\})\$\$\s*$/gm, "$1$2\n$1$$");

  result = result.replace(
    /<figure\s+markdown="span">\s*\n\s*!\[([^\]]*)\]\(([^)]*)\)\s*\n\s*<figcaption>(.*?)<\/figcaption>\s*\n\s*<\/figure>/g,
    '<figure>\n  <img src="$2" alt="$1" />\n  <figcaption>$3</figcaption>\n</figure>'
  );

  return result;
}
