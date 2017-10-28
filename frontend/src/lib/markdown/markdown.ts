import marked from 'marked';
import highlight from 'highlight.js';

export function parseGithubFlavoredMarkdown(value: string): string {
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: true,
    highlight: function (code) {
      return highlight.highlightAuto(code).value;
    }
  });
  const emojiMatch = value.match(/:([a-z0-9_\+\-]+):/g);
  if (emojiMatch) {
    emojiMatch.forEach(token => {
      const emoji = token.replace(/:/g, '');
      value = value.replace(token, `![emoji](/assets/icons/emojis/${emoji}.png)`);
    });
  }
  return marked(value);
}
