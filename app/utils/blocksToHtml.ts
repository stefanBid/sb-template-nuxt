/**
 * Converts Rich Text Blocks to HTML string
 */
export function blocksToHtml(blocks: RichBlock[]): string {
  if (!blocks || !Array.isArray(blocks)) {
    return ''
  }

  return blocks.map(block => blockToHtml(block)).join('')
}

function blockToHtml(block: RichBlock): string {
  switch (block.type) {
    case 'paragraph':
      return `<p>${childrenToHtml(block.children)}</p>`

    case 'heading':
      return `<h${block.level}>${childrenToHtml(block.children)}</h${block.level}>`

    case 'list': {
      const tag = block.format === 'ordered' ? 'ol' : 'ul'
      const items = block.children.map(item => `<li>${childrenToHtml(item.children)}</li>`).join('')
      return `<${tag}>${items}</${tag}>`
    }

    case 'quote':
      return `<blockquote>${childrenToHtml(block.children)}</blockquote>`

    case 'code':
      return `<pre><code>${childrenToHtml(block.children)}</code></pre>`

    default:
      return ''
  }
}

function childrenToHtml(children: RichBlockChild[]): string {
  if (!children || !Array.isArray(children)) {
    return ''
  }

  return children.map((child) => {
    if (child.type === 'link') {
      const linkText = child.children.map(c => formatText(c)).join('')
      return `<a href="${child.url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`
    }

    return formatText(child)
  }).join('')
}

function formatText(text: RichBlockText): string {
  if (!text.text) {
    return ''
  }

  let html = text.text

  if (text.bold) {
    html = `<strong>${html}</strong>`
  }
  if (text.italic) {
    html = `<em>${html}</em>`
  }
  if (text.underline) {
    html = `<u>${html}</u>`
  }
  if (text.strikethrough) {
    html = `<s>${html}</s>`
  }
  if (text.code) {
    html = `<code>${html}</code>`
  }

  return html
}
