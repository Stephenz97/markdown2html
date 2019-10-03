"use strict";
function times(text,time){//字符串乘法
    var texts="";
    for(var i=0;i<time;i++){texts+=text;}
    return texts; 
};
function md2blog(md){
    md=`\n`+md+`\n`;
//代码区域
    md=md.replace(/(\n\`{3})([a-zA-Z]+\n)((.*\n)+?)(\`{3}\n)/g,`\n<pre language="$2"><code>$3</pre></code>`);
    md=md.replace(/(\n\`{3}\n)((.*\n)+?)(\`{3}\n)/g,`\n<pre><code>$2</pre></code>`); 
    md=md.replace(/(\n\`)([^\`\n]*)(\`\n)/g,`\n<pre><code>$2</pre></code>`);
//取出HTML标签
    var htmlbox=md.match(/(\<)([a-z0-9]+)(\>)([\s\S\n]*?)(\<\/)\2(\>)/g);
    if(htmlbox){
        for(var k=0;k<htmlbox.length;k++){
          md=md.replace(htmlbox[k],`<space>htmlboxreplace${k.toString()}</space>`);
        }
    }
//消除多余\n和开头空格
    md=md.replace(/(\n\s*){2,}/g,`\n`);
//分割线
    md=md.replace(/\n(\*{3,}|-{3,})\n/g,`\n<hr>\n`);
    md=md.replace(/\n(\*{3,}|-{3,})\n/g,`\n<hr>\n`);
//行内样式的修改
    md=md.replace(/(\*\*)(.+)(\*\*)/g,`<strong>$2</strong>`);//加粗
    md=md.replace(/(\*)([^\*\n]+)(\*)/g,`<em>$2</em>`);//斜体
    md=md.replace(/(\~\~)(.+)(\~\~)/g,`<del>$2</del>`);//删除线
    md=md.replace(/(\_\_)(.+)(\_\_)/g,`<u>$2</u>`);//下划线
    md=md.replace(/(\={3})(.+)(\={3})/g,`<span onmouseover="this.style.background=''" onmouseout="this.style.background='black'" style="background:black;">$2</span>`);//隐藏块
    md=md.replace(/(\=\=)(.+)(\=\=)/g,`<span style="background:yellow;">$2</span>`);//高亮和自定义高亮颜色
    md=md.replace(/(\=)([a-z]+|#[\dA-F]{3}|#[\dA-F]{6})(\=)(.+)(\=\=)/g,`<span style="background:$2;">$4</span>`);
    md=md.replace(/(\~)([^\~\n]+)(\~)/g,`<sup>$2</sup>`);//上下标
    md=md.replace(/(\^)(.+)(\^)/g,`<sub>$2</sub>`);
    md=md.replace(/(\\\<)/g,`&lt`);//前面加\的HTML标签不转义
    md=md.replace(/(\\\>)/g,`&gt`);
//转换图片和超链接
    md=md.replace(/(\!\s*\[\s*)(\S+)(\s*\]\s*\(\s*)(\S+)(\s+\"\s*)(.+)(\s*\"\s*\))/g,`<img src="$4" title="$6" alt="$2">`);
    md=md.replace(/(\!\s*\[\s*)(\S+)(\s*\]\s*\(\s*)(\S+)(\s+\=\s*)(\d+)(\s*[xX\*]\s*)(\d+)(\s*\))/g,`<img src="$4" alt="$2" width="$6px" height="$8px">`);
    md=md.replace(/(\!\s*\[\s*)(\S+)(\s*\]\s*\(\s*)(\S+)(\s+\=\s*)(\d+)(\s*[xX\*]\s*)(\d+)(\s+\"\s*)(.+)(\s*\"\s*\))/g,`<img src="$4" title="$10" alt="$2" width="$6px" height="$8px">`);
    md=md.replace(/(\!\s*\[\s*)(\S+)(\s*\]\s*\(\s*)(\S+)(\s*\))/g,`<img src="$4" alt="$2">`);
    md=md.replace(/(\[\s*)(\S+)(\s*\]\s*\(\s*)(\S+)(\s+\"\s*)(.+)(\s*\"\s*\))/g,`<a href="$4" title="$6" target="_blank">$2</a>`);
    md=md.replace(/(\[\s*)(\S+)(\s*\]\s*\(\s*)(\S+)(\s*\))/g,`<a href="$4" target="_blank">$2</a>`);
//如果是标题，则在转换完成之后换行
    md=md.replace(/(\n)(#{6}\s+)(.+)/g,`\n<h6>$3</h6>`);
    md=md.replace(/(\n)(#{5}\s+)(.+)/g,`\n<h5>$3</h5>`);
    md=md.replace(/(\n)(#{4}\s+)(.+)/g,`\n<h4>$3</h4>`);
    md=md.replace(/(\n)(#{3}\s+)(.+)/g,`\n<h3>$3</h3>`);
    md=md.replace(/(\n)(#{2}\s+)(.+)/g,`\n<h2>$3</h2>`);
    md=md.replace(/(\n)(#{1}\s+)(.+)/g,`\n<h1>$3</h1>`);
//待办列表
    md=md.replace(/(\n\s*)(-\s\[\s\]\s+)(.+)/g,`\n<input type="checkbox">$3<br>`);
    md=md.replace(/(\n\s*)(-\s\[x\]\s+)(.+)/g,`\n<input type="checkbox" checked>$3<br>`);
    md=md.replace(/(\n\s*)(-\s\[X\]\s+)(.+)/g,`\n<input type="checkbox" checked>$3<br>`);
//列表内容
    for(var i=0;i<10;i++){
        var spacenum=i*3;
        var reg1=eval(`/((\\n\\s{${spacenum.toString()}}\\d+\\.\\s+.+)((\\n\\s{${spacenum.toString()},}[-\\+\\*]\\s+.+)|(\\n\\s{${spacenum.toString()},}\\d+\\.\\s+.+))*)/g`);
        var reg2=eval(`/((\\n\\s{${spacenum.toString()}}[-\\+\\*]\\s+.+)((\\n\\s{${spacenum.toString()},}[-\\+\\*]\\s+.+)|(\\n\\s{${spacenum.toString()},}\\d+\\.\\s+.+))*)/g`);
        md=md.replace(reg2,`\n<ul>$1\n</ul>`); 
        md=md.replace(reg1,`\n<ol>$1\n</ol>`);
    }
    md=md.replace(/(\n\s*)([-\+\*]\s+)(.+)/g,`\n<li>$3</li>`);
    md=md.replace(/(\n\s*)(\d+\.\s+)(.+)/g,`\n<li>$3</li>`);
//表格
    var tablebox1=md.match(/(\|([^(\|\n)]+\|)+\n)(\|(-{3,}\|)+)(\n\|([^(\|\n)]+\|)+)+/g);
    var tablebox2=md.match(/([^(\|\n)]+(\|[^(\|\n)]+)+\n)((-{3,}\|)+-{3,})(\n[^(\|\n)]+(\|[^(\|\n)]+)+)+/g);
    if(tablebox1){
        for(var m=0;m<tablebox1.length;m++){
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
        for(var n=0;n<tablebox2.length;n++){
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
//引用
    for(var j=10;j>0;j--){
        var reg3=eval(`/(\\n>{${j.toString()}}\\s*)(.*)/g`);
        md=md.replace(reg3,`\n${times(`<blockquote>`,j)}$2${times(`</blockquote>`,j)}`);
        md=md.replace(/\<\/blockquote\>\n\<blockquote\>/g,`\n`);
    }
//<p>标签
    md=md.replace(/\n([^\<][^\n]*)/g,`\n<p>$1</p>`);
    md=md.replace(/\n((\<strong>|\<em>|\<del>|\<u>|\<span)(.*))/g,`\n<p>$1</p>`);
//复原取出的HTML标签内容
    if(htmlbox){
        for(var k=0;k<htmlbox.length;k++){
          md=md.replace(`<space>htmlboxreplace${k.toString()}</space>`,htmlbox[k]);
        }
    }
    return md;
}
