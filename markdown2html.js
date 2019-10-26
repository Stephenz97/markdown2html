"use strict";
function times(text,time){
    let texts="";
    for(let i=0;i<time;i++){texts+=text;}
    return texts; 
};
function md2blog(md){
    md=`\n${md}\n`;
    md=md.replace(/(\\<)/g,`&lt`);
    md=md.replace(/(\\>)/g,`&gt`);
    md=md.replace(/(\n```)(javascript|python|java|php|c|c\+\+|c#|swift|r|go)\n((.*\n)+?)(```\n)/gi,`\n<pre language="$2"><code>\n$3</code></pre>\n`);
    for(let i=0,j=(md.match(/<pre language="[a-zA-Z]/g))?md.match(/<pre language="[a-zA-Z]/g):[];i<j.length;i++){
        md=md.replace(j[i],j[i].toLowerCase());
    }
    md=md.replace(/(\n```.*\n)((.*\n)+?)(```\n)/g,`\n<pre><code>\n$2</code></pre>\n`); 
    md=md.replace(/(\n`)([^`\n]+)(`\n)/g,`\n<pre><code>$2</code></pre>`);
    var htmlnum=0;
    var htmlbox=[];
    while(md.match(/<([a-z0-9]+)[^>]*>[^<]*<\/\1>/g)){
        htmlnum++;
        htmlbox[htmlnum]=md.match(/<([a-z0-9]+)[^>]*>[^<]*<\/\1>/g);
        md=md.replace(/<([a-z0-9]+)[^>]*>[^<]*<\/\1>/g,`space${htmlnum.toString()} htmlboxreplace`);
    }
    if(md.match(/<[a-z0-9]+\s[^<>\n]*>/)){
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
    md=md.replace(/(\n#{4}\s+)(.+)/g,`\n<h4>$2</h4>`);
    md=md.replace(/(\n#{3}\s+)(.+)/g,`\n<h3>$2</h3>`);
    md=md.replace(/(\n#{2}\s+)(.+)/g,`\n<h2>$2</h2>`);
    md=md.replace(/(\n#{1}\s+)(.+)/g,`\n<h1>$2</h1>`);
    md=md.replace(/(!\s*\[\s*)(\S+)(\s*\]\s*\(\s*)(\S+)(\s+("|')\s*)(.+)(\s*("|')\s*\))/g,`<img src="$4" title="$6" alt="$2">`);
    md=md.replace(/(!\s*\[\s*)(\S+)(\s*\]\s*\(\s*)(\S+)(\s+=\s*)(\d+)(\s*[xX\*]\s*)(\d+)(\s*\))/g,`<img src="$4" alt="$2" width="$6px" height="$8px">`);
    md=md.replace(/(!\s*\[\s*)(\S+)(\s*\]\s*\(\s*)(\S+)(\s+=\s*)(\d+)(\s*[xX\*]\s*)(\d+)(\s+("|')\s*)(.+)(\s*("|')\s*\))/g,`<img src="$4" title="$10" alt="$2" width="$6px" height="$8px">`);
    md=md.replace(/(!\s*\[\s*)(\S+)(\s*\]\s*\(\s*)(\S+)(\s*\))/g,`<img src="$4" alt="$2">`);
    md=md.replace(/(\[\s*)(\S+)(\s*\]\s*\(\s*)(\S+)(\s+("|')\s*)(.+)(\s*("|')\s*\))/g,`<a href="$4" title="$6" target="_blank">$2</a>`);
    md=md.replace(/(\[\s*)(\S+)(\s*\]\s*\(\s*)(\S+)(\s*\))/g,`<a href="$4" target="_blank">$2</a>`);
    md=md.replace(/(\n\s*)(-\s\[\s\]\s+)(.+)/g,`\n<input type="checkbox">$3<br>`);
    md=md.replace(/(\n\s*)(-\s\[x\]\s+)(.+)/g,`\n<input type="checkbox" checked>$3<br>`);
    md=md.replace(/(\n\s*)(-\s\[X\]\s+)(.+)/g,`\n<input type="checkbox" checked>$3<br>`);
    for(let i=0;i<10;i++){
        var reg1=eval(`/((\\n\\s{${(i*3).toString()}}\\d+\\.\\s+.+)((\\n\\s{${(i*3).toString()},}[-\\+\\*]\\s+.+)|(\\n\\s{${(i*3).toString()},}\\d+\\.\\s+.+))*)/g`);
        var reg2=eval(`/((\\n\\s{${(i*3).toString()}}[-\\+\\*]\\s+.+)((\\n\\s{${(i*3).toString()},}[-\\+\\*]\\s+.+)|(\\n\\s{${(i*3).toString()},}\\d+\\.\\s+.+))*)/g`);
        md=md.replace(reg2,`\n<ul>$1\n</ul>`); 
        md=md.replace(reg1,`\n<ol>$1\n</ol>`);
    }
    md=md.replace(/(\n\s*)([-\+\*]\s+)(.+)/g,`\n<li>$3</li>`);
    md=md.replace(/(\n\s*)(\d+\.\s+)(.+)/g,`\n<li>$3</li>`);
    var tablebox1=md.match(/(\|([^\|\n]*\|)+\n)(\|(-{3,}\|)+)(\n\|([^\|\n]*\|)+)+/g);
    var tablebox2=md.match(/([^\|\n]*(\|[^\|\n]*)+\n)((-{3,}\|)+-{3,})(\n[^\|\n]*(\|[^\|\n]*)+)+/g);
    if(tablebox1){
        for(let m=0;m<tablebox1.length;m++){
            var table=tablebox1[m].split(tablebox1[m].match(/\n(\|(-{3,}\|)+)\n/)[0]);
            var th=`<tr><th>${table[0].replace(/(\|)(.*)(\|)/,`$2`).split(`|`).join(`</th><th>`)}</th></tr>`;
            var tdbox=table[1].split(`\n`);
            var td=``;
            for(var q=0;q<tdbox.length;q++){
                td=td+`<tr><td>${tdbox[q].replace(/(\|)(.*)(\|)/,`$2`).split(`|`).join(`</td><td>`)}</td></tr>`;
            }
            md=md.replace(tablebox1[m],`<table>${th}${td}</table>`)
        }
    }
    if(tablebox2){
        for(let n=0;n<tablebox2.length;n++){
            var table=tablebox2[n].split(tablebox2[n].match(/\n(-{3,}\|)+(-{3,})\n/)[0]);
            var th=`<tr><th>${table[0].split(`|`).join(`</th><th>`)}</th></tr>`;
            var tdbox=table[1].split(`\n`);
            var td=``;
            for(var q=0;q<tdbox.length;q++){
                td=td+`<tr><td>${tdbox[q].split(`|`).join(`</td><td>`)}</td></tr>`;
            }
            md=md.replace(tablebox2[n],`<table>${th}${td}</table>`)
        }
    }
    md=md.replace(/<tr>(<th><\/th>)+<\/tr>/g,"");
    for(let j=10;j>0;j--){
        var reg3=eval(`/(\\n>{${j.toString()}}\\s*)(.*)/g`);
        md=md.replace(reg3,`\n${times(`<blockquote>`,j)}$2${times(`</blockquote>`,j)}`);
        md=md.replace(/<\/blockquote>\n<blockquote>/g,`\n`);
    }
    md=md.replace(/(\n\s*){2,}/g,`\n`);
    md=md.replace(/\n([^<(space\d*\shtmlboxreplace)][^\n]*)/g,`\n<p>$1</p>`);
    md=md.replace(/\n((<strong|<em|<del|<u|<span|<a)(.*))/g,`\n<p>$1</p>`);
    while(htmlnum){
        for(let i=0;i<htmlbox[htmlnum].length;i++){
            md=md.replace(`space${htmlnum.toString()} htmlboxreplace`,htmlbox[htmlnum][i]);
        }
        htmlnum--;
    }
    return md;
}
