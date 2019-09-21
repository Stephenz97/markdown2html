"use strict";
function md2blog(md){
    var mdlist=md.split(/\n/g);
    var html="";
    var if_code=0;
    var if_ul=0;
    for (var mdi in mdlist){
        var line=mdlist[mdi];
        {//代码区域
            if(if_code==1 && line!='```'){html=html+line+`\n`;continue;}
            if(if_code==1){html=html+`</code></pre>`;if_code=0;continue;}
            if(line.indexOf("`")==0){
                if(line.indexOf("```")==0 && if_code==0){
                    html=html+line.replace(/(\`\`\`)(.*)/g,`<pre class="language-$2"><code>`);if_code=1;continue;
                }
                html=html+line.replace(/(\`)(.*)(\`)/g,`<p><code>$2</code></p>`);continue;
            }
        }
        {//行内样式的修改
            line=line.replace(/(\*\*)(.+)(\*\*)/g,`<strong>$2</strong>`);
            line=line.replace(/(\*)([^\*]+)(\*)/g,`<em>$2</em>`);
            line=line.replace(/(\~\~)(.+)(\~\~)/g,`<del>$2</del>`);
            line=line.replace(/(\=\=)(.+)(\=\=)/g,`<span style="background-color:yellow;">$2</span>`);
            line=line.replace(/(\~)([^\~]+)(\~)/g,`<sup>$2</sup>`);
            line=line.replace(/(\^)(.+)(\^)/g,`<sub>$2</sub>`);
        }
        {//转换图片和超链接
            line=line.replace(/(\!\[\s*)(.+\S)(\s*\]\s*\(\s*)(.+\S)(\s+[^\=]\"\s*)(.*\S)(\s*\"\s*\))/g,`<img src="$4" title="$6" alt="$2">`);
            line=line.replace(/(\!\[\s*)(.+\S)(\s*\]\s*\(\s*)(.+\S)(\s+\=\s*)(\d+)(\s*[xX\*]\s*)(\d+)(\s+\"\s*)(.*\S)(\s*\"\s*\))/g,`<img src="$4" title="$10" alt="$2" width="$6px" height="$8px">`);
            line=line.replace(/(\[\s*)(.+\S)(\s*\]\s*\(\s*)(.+\S)(\s+\"\s*)(.*\S)(\s*\"\s*\))/g,`<a href="$4" title="$6" target="_blank">$2</a>`);

        }
        {//如果是标题，则在转换完成之后换行
            if(line.indexOf("###### ")==0){html=html+line.replace(/(#{6}\s)(.+)/g,`<h6>$2</h6>`);continue;}
            if(line.indexOf("##### ")==0){html=html+line.replace(/(#{5}\s)(.+)/g,`<h5>$2</h5>`);continue;}
            if(line.indexOf("#### ")==0){html=html+line.replace(/(#{4}\s)(.+)/g,`<h4>$2</h4>`);continue;}
            if(line.indexOf("### ")==0){html=html+line.replace(/(#{3}\s)(.+)/g,`<h3>$2</h3>`);continue;}
            if(line.indexOf("## ")==0){html=html+line.replace(/(#{2}\s)(.+)/g,`<h2>$2</h2>`);continue;}
            if(line.indexOf("# ")==0){html=html+line.replace(/(#{1}\s)(.+)/g,`<h1>$2</h1>`);continue;}
        }

        {//待办列表
            if(line.indexOf("- [ ] ")==0){html=html+line.replace(/(\-\s\[\s\]\s+)(.+)/g,`<input type="checkbox">$2`);continue;}
            if(line.indexOf("- [x] ")==0){html=html+line.replace(/(\-\s\[x\]\s+)(.+)/g,`<input type="checkbox" checked>$2`);continue;}
            if(line.indexOf("- [X] ")==0){html=html+line.replace(/(\-\s\[X\]\s+)(.+)/g,`<input type="checkbox" checked>$2`);continue;}
        }
        {//无序列表
            if(if_ul>0 && (line.indexOf("- ")!=0 || (line.indexOf("- [ ] ")==0 || line.indexOf("- [x] ")==0 || line.indexOf("- [X] ")==0)) && line.indexOf("+ ")!=0 && line.indexOf("* ")!=0){
                html=html+`</ul>`;if_ul--;
            }
            if((line.indexOf("- ")==0 && (line.indexOf("- [ ] ")!=0 && line.indexOf("- [x] ")!=0 && line.indexOf("- [X] ")!=0)) || line.indexOf("+ ")==0 || line.indexOf("* ")==0){
                if(if_ul==0){html=html+`<ul>`;if_ul++;}
                html=html+line.replace(/^([\-\+\*]\s)(.+)/g,`<li>$2</li>`);
                continue;
            }
        }


        {//转化换行符
            if((line.replace(/\-/g,"")=="" || line.replace(/\*/g,"")=="") && line.length>2){html=html+"<hr>";continue;}
        }



        {//无序列表

            if((line.indexOf("- ")==0 && (line.indexOf("- [ ] ")!=0 && line.indexOf("- [x] ")!=0 && line.indexOf("- [X] ")!=0)) || line.indexOf("+ ")==0 || line.indexOf("* ")==0){
                if(if_ul==0){html=html+`<ul>`;if_ul++;}
                html=html+line.replace(/^([\-\+\*]\s)(.+)/g,`<li>$2</li>`);
                continue;
            }
        }





        if(line.match(/^\s*[\-\+\*]\s/g)[0].match(/\s/g).length>0){
            html=html+"f000002";
            html=html+line.replace(/^(\s*[\-\+\*]\s)(.+)/g,`<li>$2</li>`);
            continue;
        }








        html=html+line;
    }
    return html;
}
