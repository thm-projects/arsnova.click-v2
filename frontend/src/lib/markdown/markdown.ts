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
  return parseCustomMarkdown(marked(value));
}

function parseCustomMarkdown(value: string): string {
  const iframeOptions = `frameborder="0" gesture="media" webkitallowfullscreen mozallowfullscreen allowfullscreen`;

  const youtubeMatch = value.match(/<a href=".*(youtube|youtu).*">.*<\/a>/g);
  if (youtubeMatch) {
    youtubeMatch.forEach(token => {
      const videoTag = token.replace('<a', `<iframe`)
                            .replace('</a>', `</iframe>`)
                            .replace('<iframe', `<iframe ${iframeOptions}`)
                            .replace('href', 'src');
      value = value.replace(token, videoTag);
    });
  }

  const vimeoMatch = value.match(/<a href=".*(vimeo).*">.*<\/a>/g);
  if (vimeoMatch) {
    vimeoMatch.forEach(token => {
      const id = token.match(/([0-9]+)/);
      if (id) {
        const videoTag = `<iframe src="https://player.vimeo.com/video/${id[0]}?title=0&byline=0&portrait=0" ${iframeOptions}></iframe>`;
        value = value.replace(token, videoTag);
      }
    });
  }

  const linkMatch = value.match(/<a href=".*">/g);
  if (linkMatch) {
    linkMatch.forEach(token => {
      value = value.replace(token, token.replace('<a ', '<a target=\'_blank\' '));
    });
  }

  return value;
}
