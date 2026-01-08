import React from "react";

type InlineNode = {
  type: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  children?: InlineNode[];
};

type Block = {
  type: string;
  children?: InlineNode[];
  level?: number;
  format?: string;
};

/**
 * Simple renderer for Strapi blocks content
 * Handles paragraphs, headings, lists, and basic formatting
 */
export function renderBlocks(blocks: Block[] | null | undefined): React.ReactNode {
  if (!blocks || !Array.isArray(blocks)) {
    return null;
  }

  return blocks.map((block, index) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={index} className="mb-4 text-slate-700">
            {renderInlineContent(block.children)}
          </p>
        );

      case "heading":
        const level = block.level || 2;
        const headingProps = {
          key: index,
          className: `mb-4 font-bold ${getHeadingClass(level)}`,
          style: { color: "var(--school-navy)" },
        };
        const headingContent = renderInlineContent(block.children);
        
        switch (level) {
          case 1:
            return <h1 {...headingProps}>{headingContent}</h1>;
          case 2:
            return <h2 {...headingProps}>{headingContent}</h2>;
          case 3:
            return <h3 {...headingProps}>{headingContent}</h3>;
          case 4:
            return <h4 {...headingProps}>{headingContent}</h4>;
          case 5:
            return <h5 {...headingProps}>{headingContent}</h5>;
          case 6:
            return <h6 {...headingProps}>{headingContent}</h6>;
          default:
            return <h2 {...headingProps}>{headingContent}</h2>;
        }

      case "list":
        const listProps = {
          key: index,
          className: "mb-4 ml-6 list-disc",
        };
        const listItems = block.children?.map((item, itemIndex) => (
          <li key={itemIndex} className="mb-2 text-slate-700">
            {renderInlineContent(item.children)}
          </li>
        ));
        
        if (block.format === "ordered") {
          return <ol {...listProps}>{listItems}</ol>;
        }
        return <ul {...listProps}>{listItems}</ul>;

      case "quote":
        return (
          <blockquote
            key={index}
            className="mb-4 pl-4 border-l-4 italic"
            style={{ borderColor: "var(--school-navy)" }}
          >
            {renderInlineContent(block.children)}
          </blockquote>
        );

      default:
        return (
          <div key={index} className="mb-4">
            {renderInlineContent(block.children)}
          </div>
        );
    }
  });
}

function renderInlineContent(
  children?: InlineNode[]
): React.ReactNode {
  if (!children) return null;

  return children.map((child, index) => {
    if (child.type === "text") {
      let content: React.ReactNode = child.text || "";

      if (child.bold) {
        content = <strong key={index}>{content}</strong>;
      }
      if (child.italic) {
        content = <em key={index}>{content}</em>;
      }
      if (child.underline) {
        content = <u key={index}>{content}</u>;
      }

      return <span key={index}>{content}</span>;
    }

    // Handle nested children (for list items)
    if (child.children) {
      return <span key={index}>{renderInlineContent(child.children)}</span>;
    }

    return null;
  });
}

function getHeadingClass(level: number): string {
  const classes: Record<number, string> = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
    6: "text-base",
  };
  return classes[level] || "text-2xl";
}
