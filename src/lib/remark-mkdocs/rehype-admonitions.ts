import { visit } from "unist-util-visit";

const ALERT_REGEX = /^\[!(\w+)\](\+)?\s*/;

export function rehypeAdmonitions() {
  return (tree: any) => {
    visit(tree, "element", (node: any, index: number | undefined, parent: any) => {
      if (node.tagName !== "blockquote" || !parent || index === undefined) return;

      const firstP = node.children?.find(
        (child: any) => child.type === "element" && child.tagName === "p"
      );
      if (!firstP) return;

      const firstText = extractText(firstP);
      const match = firstText.match(ALERT_REGEX);
      if (!match) return;

      const type = match[1].toLowerCase();
      const isCollapsible = !!match[2];

      const titleChildren = extractTitleChildren(firstP, match[0]);

      if (titleChildren.length === 0) {
        titleChildren.push({ type: "text", value: type });
      }

      const contentChildren = node.children.filter((child: any) => child !== firstP);

      const titleDiv = {
        type: "element",
        tagName: "div",
        properties: { className: ["admonition-title"] },
        children: titleChildren,
      };

      const contentDiv = {
        type: "element",
        tagName: "div",
        properties: { className: ["admonition-content"] },
        children: contentChildren,
      };

      if (isCollapsible) {
        const summary = {
          type: "element",
          tagName: "summary",
          properties: { className: ["admonition-title"] },
          children: titleChildren,
        };

        node.tagName = "details";
        node.properties = {
          className: ["admonition", `admonition-${type}`, "collapsible"],
        };
        node.children = [summary, contentDiv];
      } else {
        node.tagName = "div";
        node.properties = {
          className: ["admonition", `admonition-${type}`],
        };
        node.children = [titleDiv, contentDiv];
      }
    });
  };
}

function extractText(node: any): string {
  if (node.type === "text") return node.value || "";
  if (node.children) {
    return node.children.map(extractText).join("");
  }
  return "";
}

function extractTitleChildren(paragraph: any, markerText: string): any[] {
  const result: any[] = [];
  let markerRemaining = markerText;
  let markerRemoved = false;

  for (const child of paragraph.children || []) {
    if (markerRemoved) {
      result.push(child);
      continue;
    }

    if (child.type === "text") {
      const text = child.value || "";
      if (markerRemaining.length > 0) {
        if (text.startsWith(markerRemaining)) {
          const remaining = text.substring(markerRemaining.length);
          markerRemoved = true;
          if (remaining) {
            result.push({ type: "text", value: remaining });
          }
        } else if (markerRemaining.startsWith(text)) {
          markerRemaining = markerRemaining.substring(text.length);
        } else {
          markerRemoved = true;
          result.push(child);
        }
      } else {
        markerRemoved = true;
        result.push(child);
      }
    } else {
      if (markerRemaining.length === 0) {
        markerRemoved = true;
      }
      if (markerRemoved || markerRemaining.length === 0) {
        markerRemoved = true;
        result.push(child);
      }
    }
  }

  return result;
}
