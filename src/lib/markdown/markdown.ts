import marked from 'marked';
import highlight from 'highlight.js';
import {DefaultSettings} from '../default.settings';

export function parseGithubFlavoredMarkdown(value: string): string {
  const renderer = new marked.Renderer();
  const options = {
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: true,
    sanitize: false,
    smartLists: false,
    smartypants: false,
    mathDelimiters: [['$', '$'], ['\\(', '\\)'], ['\\[', '\\]'], ['$$', '$$'], 'beginend'],
    highlight: function (code) {
      return highlight.highlightAuto(code).value;
    }
  };
  marked.setOptions(options);
  return postMarkdownRenderer(marked(preMarkdownRenderer(value)));
}

export function emojiRenderer(value: string): string {
  const emojiMatch = value.match(/:([a-z0-9_\+\-]+):/g);
  if (emojiMatch) {
    emojiMatch.forEach(token => {
      const emoji = token.replace(/:/g, '');
      value = value.replace(token, `![emoji_:${emoji}:](${DefaultSettings.httpApiEndpoint}/files/images/emojis/${emoji}.png)`);
    });
  }
  return value;
}

function preMarkdownRenderer(value: string): string {
  return emojiRenderer(value);
}

function postMarkdownRenderer(value: string): string {
  const iframeOptions = `frameborder="0" gesture="media" webkitallowfullscreen mozallowfullscreen allowfullscreen`;

  const youtubeMatch = value.match(/<a href=".*(youtube|youtu).*">.*<\/a>/g);
  if (youtubeMatch) {
    youtubeMatch.forEach(token => {
      const originalToken = token;
      if (token.indexOf('embed') === -1) {
        // Convert to embed uri. Direct youtube urls are restricted by the sameorigin policy and cannot be embedded in iframes
        token = token.replace('watch?v=', 'embed/');
      }
      const videoTag = token.replace('<a', `<iframe`)
                            .replace('</a>', `</iframe>`)
                            .replace('<iframe', `<iframe ${iframeOptions}`)
                            .replace('href', 'src');
      value = value.replace(originalToken, videoTag);
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
