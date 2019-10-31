"use strict";
function md2blog(md){
    md=`\n${md}\n`;
    md=md.replace(/\\</g,`&lt`);
    md=md.replace(/\\>/g,`&gt`);
    md=md.replace(/(\n```)(javascript|python|java|php|c|c\+\+|c#|swift|r|go)\n((.*\n)+?)(```\n)/gi,`\n<pre class="language-$2"><code>\n$3</code></pre>\n`);
    for(let i=0,j=(md.match(/<pre\sclass="language-[a-zA-Z]*/g))?md.match(/<pre\sclass="language-[a-zA-Z]*/g):[];i<j.length;i++){
        md=md.replace(j[i],j[i].toLowerCase());
    }
    md=md.replace(/(\n```.*\n)((.*\n)+?)(```\n)/g,`\n<pre><code>\n$2</code></pre>\n`); 
    md=md.replace(/(\n`)([^`\n]+)(`\n)/g,`\n<pre><code>$2</code></pre>`);
    var htmlnum=0;
    var htmlbox=[];
    while((/<([a-z0-9]+)[^>]*>[^<]*<\/\1>/).test(md)){
        htmlnum++;
        htmlbox[htmlnum]=md.match(/<([a-z0-9]+)[^>]*>[^<]*<\/\1>/g);
        md=md.replace(/<([a-z0-9]+)[^>]*>[^<]*<\/\1>/g,`space${htmlnum.toString()} htmlboxreplace`);
    }
    if((/<[a-z0-9]+\s[^<>\n]*>/).test(md)){
        htmlnum++;
        htmlbox[htmlnum]=md.match(/<[a-z0-9]+\s[^<>\n]*>/g);
        md=md.replace(/<[a-z0-9]+\s[^<>\n]*>/g,`space${htmlnum.toString()} htmlboxreplace`);
    }
    md=md.replace(/(\*\*)([^\*\n]+)(\*\*)/g,`<strong>$2</strong>`);
    md=md.replace(/(\*)([^\*\n]+)(\*)/g,`<em>$2</em>`);
    md=md.replace(/(~~)([^~\n]+)(~~)/g,`<del>$2</del>`);
    md=md.replace(/(__)([^_\n]+)(__)/g,`<u>$2</u>`);
    md=md.replace(/(==)([^=\n]+)(==)/g,`<span style="background:yellow;">$2</span>`);
    md=md.replace(/(~)([^~\n]+)(~)/g,`<sup>$2</sup>`);
    md=md.replace(/(\^)([^\^\n]+)(\^)/g,`<sub>$2</sub>`);
    md=md.replace(/(\n#{6}\s+)(.+)/g,`\n<h6>$2</h6>`);
    md=md.replace(/(\n#{5}\s+)(.+)/g,`\n<h5>$2</h5>`);
    md=md.replace(/(\n####\s+)(.+)/g,`\n<h4>$2</h4>`);
    md=md.replace(/(\n###\s+)(.+)/g,`\n<h3>$2</h3>`);
    md=md.replace(/(\n##\s+)(.+)/g,`\n<h2>$2</h2>`);
    md=md.replace(/(\n#\s+)(.+)/g,`\n<h1>$2</h1>`);
    md=md.replace(/(!\s*\[\s*)(\S+)(\s*\]\s*\(\s*)(\S+)(\s+("|')\s*)(.+)(\s*("|')\s*\))/g,`<img src="$4" title="$6" alt="$2">`);
    md=md.replace(/(!\s*\[\s*)(\S+)(\s*\]\s*\(\s*)(\S+)(\s+=\s*)(\d+)(\s*[xX\*]\s*)(\d+)(\s*\))/g,`<img src="$4" alt="$2" width="$6px" height="$8px">`);
    md=md.replace(/(!\s*\[\s*)(\S+)(\s*\]\s*\(\s*)(\S+)(\s+=\s*)(\d+)(\s*[xX\*]\s*)(\d+)(\s+("|')\s*)(.+)(\s*("|')\s*\))/g,`<img src="$4" title="$10" alt="$2" width="$6px" height="$8px">`);
    md=md.replace(/(!\s*\[\s*)(\S+)(\s*\]\s*\(\s*)(\S+)(\s*\))/g,`<img src="$4" alt="$2">`);
    md=md.replace(/(\[\s*)(\S+)(\s*\]\s*\(\s*)(\S+)(\s+("|')\s*)(.+)(\s*("|')\s*\))/g,`<a href="$4" title="$6" target="_blank">$2</a>`);
    md=md.replace(/(\[\s*)(\S+)(\s*\]\s*\(\s*)(\S+)(\s*\))/g,`<a href="$4" target="_blank">$2</a>`);
    md=md.replace(/(\n\s*)(-\s\[\s\]\s+)(.+)/g,`\n<input type="checkbox">$3<br>`);
    md=md.replace(/(\n\s*)(-\s\[[Xx]\]\s+)(.+)/g,`\n<input type="checkbox" checked>$3<br>`);
    if((/(\|([^\|\n]*\|)+\n)(\|(-{3,}\|)+)(\n\|([^\|\n]*\|)+)+/).test(md)){
        let tablebox=md.match(/(\|([^\|\n]*\|)+\n)(\|(-{3,}\|)+)(\n\|([^\|\n]*\|)+)+/g);
        for(let i=0;i<tablebox.length;i++){
            var table=tablebox[i].split(tablebox[i].match(/\n(\|(-{3,}\|)+)\n/)[0]);
            var th=`<tr><th>${table[0].replace(/(\|)(.*)(\|)/,`$2`).split(`|`).join(`</th><th>`)}</th></tr>`;
            var tdbox=table[1].split(`\n`);
            var td=``;
            for(let j=0;j<tdbox.length;j++){
                td=td+`<tr><td>${tdbox[j].replace(/(\|)(.*)(\|)/,`$2`).split(`|`).join(`</td><td>`)}</td></tr>`;
            }
            md=md.replace(tablebox[i],`<table>${th}${td}</table>`)
        }
    }
    if((/([^\|\n]*(\|[^\|\n]*)+\n)((-{3,}\|)+-{3,})(\n[^\|\n]*(\|[^\|\n]*)+)+/).test(md)){
        let tablebox=md.match(/([^\|\n]*(\|[^\|\n]*)+\n)((-{3,}\|)+-{3,})(\n[^\|\n]*(\|[^\|\n]*)+)+/g);
        for(let i=0;i<tablebox.length;i++){
            var table=tablebox[i].split(tablebox[i].match(/\n(-{3,}\|)+(-{3,})\n/)[0]);
            var th=`<tr><th>${table[0].split(`|`).join(`</th><th>`)}</th></tr>`;
            var tdbox=table[1].split(`\n`);
            var td=``;
            for(let j=0;j<tdbox.length;j++){
                td=td+`<tr><td>${tdbox[j].split(`|`).join(`</td><td>`)}</td></tr>`;
            }
            md=md.replace(tablebox[i],`<table>${th}${td}</table>`)
        }
    }
    md=md.replace(/<tr>(<th><\/th>)+<\/tr>/g,"");
    while((/\n>.*/).test(md)){
        md=md.replace(/(\n>*?>\s*)(.*)/g,`\n<blockquote>\n$2\n</blockquote>`);
        md=md.replace(/<\/blockquote>\n*<blockquote>/g,`\n`);
    }
    md=md.replace(/(\n\s*){2,}/g,`\n`);
    md=md.replace(/\n([^<].*)/g,`\n<p>$1</p>`);
    md=md.replace(/\n((<strong|<em|<del|<u[^l]|<span|<a)(.*))/g,`\n<p>$1</p>`);
    md=md.replace(/<p>(space\d+\shtmlboxreplace)<\/p>/g,`$1`);
    while(htmlnum){
        for(let i=0;i<htmlbox[htmlnum].length;i++){
            md=md.replace(`space${htmlnum.toString()} htmlboxreplace`,htmlbox[htmlnum][i]);
        }
        htmlnum--;
    }
    return md;
}
