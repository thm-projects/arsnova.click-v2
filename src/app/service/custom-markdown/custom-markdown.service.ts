import { Injectable } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';

@Injectable({
  providedIn: 'root',
})
export class CustomMarkdownService {
  constructor(private markdownService: MarkdownService) {}

  public parseGithubFlavoredMarkdown(value: string): string {
    return this.postMarkdownRenderer(this.compile(this.preMarkdownRenderer(value)));
  }

  public compile(value: string): string {
    return this.markdownService.compile(value);
  }

  // noinspection JSMethodCanBeStatic
  private createElementFromHTML(htmlString): Node {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
  }

  private emojiRenderer(value: string): string {
    const emojiMatch = value.match(/:([a-z0-9_\+\-]+):/g);
    if (emojiMatch) {
      emojiMatch.forEach(token => {
        const emoji = token.replace(/:/g, '');
        value = value.replace(token, `![emoji_:${emoji}:](/assets/images/emojis/${emoji}.png)`);
      });
    }
    return value;
  }

  private preMarkdownRenderer(value: string): string {
    return this.emojiRenderer(value);
  }

  private postMarkdownRenderer(value: string): string {
    const iframeOptions = `frameborder="0" gesture="media" webkitallowfullscreen mozallowfullscreen allowfullscreen`;

    const youtubeMatch = value.match(/<a href=".*(youtube|youtu).*">.*<\/a>/g);
    if (youtubeMatch) {
      youtubeMatch.forEach(token => {
        const originalToken = token;
        if (token.indexOf('embed') === -1) {
          // Convert to embed uri. Direct youtube urls are restricted by the sameorigin policy and cannot be embedded in iframes
          token = token.replace('watch?v=', 'embed/');
        }
        const videoTag = token //
        .replace('<a', `<iframe`) //
        .replace('</a>', `</iframe>`) //
        .replace('<iframe', `<iframe ${iframeOptions}`) //
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

    const imgMatch = value.match(/<img (?!src=".*emoji.*").+?(?=>)>/g);
    if (imgMatch) {
      imgMatch.forEach(token => {
        const imgNode: HTMLImageElement = this.createElementFromHTML(token) as HTMLImageElement;
        imgNode.classList.add(...['thumbnail', 'cursor-zoom-in']);

        const anchorNode = document.createElement<'a'>('a');
        anchorNode.href = imgNode.src;
        anchorNode.target = null;
        anchorNode.classList.add(...['highslide']);
        anchorNode.setAttribute('onclick', 'return hs.expand(this);');
        anchorNode.appendChild(imgNode);

        value = value.replace(token, anchorNode.outerHTML);
      });
    }

    const linkMatch = value.match(/<a href=".*">/g);
    if (linkMatch) {
      linkMatch.forEach(token => {
        value = value.replace(token, token.replace('<a ', '<a rel=\'noopener noreferrer\' target=\'_blank\' '));
      });
    }

    return value;
  }
}
