export function parseCodeBlock(result, i) {
  let tmpNewItem = result[i].replace(/\s/g, '') + '\n';
  let mergeEndIndex = result.length;
  for (let j = i + 1; j < result.length; j++) {
    tmpNewItem += result[j] + '\n';
    if (/^```/.test(result[j])) {
      mergeEndIndex = j;
      break;
    }
  }
  result.splice(i, mergeEndIndex - i + 1);
  result.splice(i, 0, tmpNewItem);
}

export function parseOrderedList(result, i) {
  let tmpNewItem = result[i] + '\n';
  let mergeEndIndex = result.length;
  for (let j = i + 1; j < result.length; j++) {
    if (!/^[0-9]*./.test(result[j])) {
      mergeEndIndex = j - 1;
      break;
    }
    tmpNewItem += result[j] + '\n';
  }
  result.splice(i, mergeEndIndex - i + 1);
  result.splice(i, 0, tmpNewItem);
}

export function parseUnorderedList(result, i) {
  let tmpNewItem = result[i] + '\n';
  let mergeEndIndex = result.length;
  for (let j = i + 1; j < result.length; j++) {
    if (!/^(  )[*-+] /.test(result[j]) && !/^[0-9]*./.test(result[j])) {
      mergeEndIndex = j - 1;
      break;
    }
    tmpNewItem += result[j] + '\n';
  }
  result.splice(i, mergeEndIndex - i + 1);
  result.splice(i, 0, tmpNewItem);
}

export function parseCommentBlock(result, i) {
  let tmpNewItem = result[i] + '\n';
  let mergeEndIndex = result.length;
  for (let j = i + 1; j < result.length; j++) {
    if (!/^> /.test(result[j])) {
      mergeEndIndex = j - 1;
      break;
    }
    tmpNewItem += result[j] + '\n';
  }
  result.splice(i, mergeEndIndex - i + 1);
  result.splice(i, 0, tmpNewItem);
}

export function parseLinkBlock(result, i) {
  const startIndex = /((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/.exec(result[i]);
  const linkStr = startIndex[0] || result[i];
  const link = !/^https?:\/\//.test(linkStr) ? 'http://' + linkStr : linkStr;
  const prevLinkContent = result[i].substring(0, startIndex.index);
  const postLinkContent = result[i].indexOf(' ', startIndex.index) > -1 ? result[i].substring(result[i].indexOf(' ', startIndex.index)) : '';
  result[i] = prevLinkContent + '<a href=\'' + link + '\' target=\'_blank\'>' + linkStr + '</a>' + postLinkContent;
}

export function parseHeaderBlock(result, i) {
  const length = result[i].lastIndexOf('#') + 1;
  result[i] = `<h${length}>${result[i].replace(/#/g, '')}</h${length}>`;
}

export function parseStrikeThroughBlock(result, i) {
  result[i].match(/~~[^~{2}]*~~/gi).forEach(function (element) {
    result[i] = result[i].replace(element, '<del>' + element.replace(/~~/g, '') + '</del>');
  });
}

export function parseBoldBlock(result, i) {
  result[i].match(/\*\*[^*{2}]*\*\*/gi).forEach(function (element) {
    result[i] = result[i].replace(element, '<b>' + element.replace(/\*\*/g, '') + '</b>');
  });
}

export function parseItalicBlock(result, i) {
  result[i].match(/\*.*\*/gi).forEach(function (element) {
    result[i] = result[i].replace(element, '<em>' + element.replace(/\*/g, '') + '</em>');
  });
}

export function parseUnderlineBlock(result, i) {
  result[i].match(/__[^_{2}]*__/gi).forEach(function (element) {
    result[i] = result[i].replace(element, '<u>' + element.replace(/__/g, '') + '</u>');
  });
}

export function parseEmojiBlock(result, i) {
  const wrapper = document.createElement('div');
  wrapper.className = 'emojiWrapper';
  let lastIndex = 0;
  result[i].match(/:([a-z0-9_\+\-]+):/g).forEach(function (emoji) {
    const emojiPlain = emoji.replace(/:/g, '');
    const textChild = document.createElement('span');
    textChild.innerText = result[i].substring(lastIndex, result[i].indexOf(emoji));
    wrapper.appendChild(textChild);
    lastIndex = result[i].indexOf(emoji) + emoji.length;
    const imgChild = document.createElement('img');
    imgChild.className = 'emojiImage';
    imgChild.setAttribute('src', '/images/emojis/' + emojiPlain + '.png');
    imgChild.setAttribute('alt', emojiPlain + '.png');
    imgChild.setAttribute('aria-label', emojiPlain);
  });
  const textChild = document.createElement('span');
  textChild.innerText = result[i].substring(lastIndex, result[i].length);
  result[i] = wrapper.outerHTML;
}

export function parseMathjaxBlock(result, i, endDelimiter) {
  let tmpNewItem = result[i] + '\n';
  let mergeEndIndex = result.length;
  for (let j = i + 1; j < result.length; j++) {
    tmpNewItem += (result[j] + '\n');
    if (result[j].endsWith(endDelimiter)) {
      mergeEndIndex = j;
      break;
    }
  }
  result.splice(i, mergeEndIndex - i + 1);
  const wrapperElem = document.createElement('div');
  wrapperElem.innerHTML = tmpNewItem;
  result.splice(i, 0, wrapperElem.outerHTML);
}

export function parseGithubFlavoredMarkdown(result: Array<string>, overrideLineBreaks: boolean = true) {
  for (let i = 0; i < result.length; i++) {
    switch (true) {
      case /^\$\$/.test(result[i]) && overrideLineBreaks:
        parseMathjaxBlock(result, i, '$$');
        break;
      case /^\[/.test(result[i]) && overrideLineBreaks:
        parseMathjaxBlock(result, i, '\]');
        break;
      case /^<math/.test(result[i]) && overrideLineBreaks:
        parseMathjaxBlock(result, i, '</math>');
        break;
      case /\$/.test(result[i]) || /\(/.test(result[i]):
        break;
      case /^```/.test(result[i]) && overrideLineBreaks:
        parseCodeBlock(result, i);
        break;
      case /^([0-9]*\.)?(-)?(\*)? \[x\] /.test(result[i]):
        result[i] = ('<input class=\'markdownCheckbox\' type=\'checkbox\' checked=\'checked\' disabled=\'disabled\' aria-label=\'ToDo (checked)\' />' + result[i].replace(/([0-9]*\.)?(-)?(\*)? \[x\] /, ''));
        break;
      case /^([0-9]*\.)?(-)?(\*)? \[ \] /.test(result[i]):
        result[i] = ('<input class=\'markdownCheckbox\' type=\'checkbox\' disabled=\'disabled\' aria-label=\'ToDo (unchecked)\' />' + result[i].replace(/^([0-9]*\.)?(-)?(\*)? \[ \] /, ''));
        break;
      case /^[\s]*1\./.test(result[i]) && overrideLineBreaks:
        parseOrderedList(result, i);
        break;
      case /^[*-+] /.test(result[i]) && overrideLineBreaks:
        parseUnorderedList(result, i);
        break;
      case /^> /.test(result[i]):
        parseCommentBlock(result, i);
        break;
      case /~~.*~~/.test(result[i]):
        parseStrikeThroughBlock(result, i);
        break;
      case /\*\*.*\*\*/.test(result[i]):
        parseBoldBlock(result, i);
        break;
      case /__.*__/.test(result[i]):
        parseUnderlineBlock(result, i);
        break;
      case /\*.*\*/.test(result[i]):
        parseItalicBlock(result, i);
        break;
      case /^[#{0-6}].*/.test(result[i]):
        parseHeaderBlock(result, i);
        break;
      case !/(^!)?\[.*\]\(.*\)/.test(result[i]) && /((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/.test(result[i]) && !(/youtube/.test(result[i]) || /youtu.be/.test(result[i]) || /vimeo/.test(result[i])):
        parseLinkBlock(result, i);
        break;
      case overrideLineBreaks && result[i].length === 0:
        i++;
        break;
      case /:[^\s]*:/.test(result[i]) && /:([a-z0-9_\+\-]+):/g.test(result[i]):
        parseEmojiBlock(result, i);
        break;
    }
  }
}
