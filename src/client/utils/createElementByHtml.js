const doc = global.document,
    TOP_LEVEL_NS_TAGS = {
        'http://www.w3.org/2000/svg' : 'svg',
        'http://www.w3.org/1998/Math/MathML' : 'math'
    };

let helperDomNode;

export default function createElementByHtml(html, tag, ns) {
    helperDomNode || (helperDomNode = doc.createElement('div'));

    if(!ns || !TOP_LEVEL_NS_TAGS[ns] || TOP_LEVEL_NS_TAGS[ns] === tag) {
        helperDomNode.innerHTML = html;
        return helperDomNode.removeChild(helperDomNode.firstChild);
    }

    const topLevelTag = TOP_LEVEL_NS_TAGS[ns];
    helperDomNode.innerHTML = '<' + topLevelTag + ' xmlns="' + ns + '">' + html + '</' + topLevelTag + '>';
    return helperDomNode.removeChild(helperDomNode.firstChild).firstChild;
}
