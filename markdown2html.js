"use strict";
function md2blog(md){
    var mdlist=md.split(/\n/g);
    var html="";
    var if_code=0;
    var if_list=0;
    var end_list=[];
    var if_table=0;
    var if_bq=0;
    for (var mdi=0;mdi<mdlist.length;mdi++){
        var line=mdlist[mdi];
        {//跳过空行
            if(line==""){continue;}
        }
        {//分割线
            if((line.replace(/\-/g,"")=="" || line.replace(/\*/g,"")=="") && line.length>2){html=html+"<hr>";continue;}
        }
        {//代码区域
            if(if_code==1 && line!='```'){html=html+line.replace(/(\<)([^\>]*)(\>)/g,`&lt;$2&gt;`)+`\n`;continue;}
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
            line=line.replace(/(\\\<)([^\>]+)(\>)/g,`&lt;$2&gt;`);
        }
        {//转换图片和超链接
            line=line.replace(/(\!\[\s*)(.+\S)(\s*\]\s*\(\s*)(.+\S)(\s+\=\s*)(\d+)(\s*[xX\*]\s*)(\d+)(\s+\"\s*)(.*\S)(\s*\"\s*\))/g,`<img src="$4" title="$10" alt="$2" width="$6px" height="$8px">`);
            line=line.replace(/(\!\[\s*)(.+\S)(\s*\]\s*\(\s*)(.+\S)(\s+\"\s*)(.*\S)(\s*\"\s*\))/g,`<img src="$4" title="$6" alt="$2">`);
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
            if(line.indexOf("- [ ] ")==0){html=html+line.replace(/(\-\s\[\s\]\s+)(.+)/g,`<input type="checkbox">$2<br>`);continue;}
            if(line.indexOf("- [x] ")==0){html=html+line.replace(/(\-\s\[x\]\s+)(.+)/g,`<input type="checkbox" checked>$2<br>`);continue;}
            if(line.indexOf("- [X] ")==0){html=html+line.replace(/(\-\s\[X\]\s+)(.+)/g,`<input type="checkbox" checked>$2<br>`);continue;}
        }
        {//列表   
            if(if_list==0){
                if(line.match(/^\d+\.\s/g)!=null){//有序列表开始
                    if_list++;
                    end_list.unshift(`</ol>`);
                    if(line.match(/^\d/g)=="1"){html=html+line.replace(/^(\d+\.\s+)(.+)/g,`<ol><li>$2</li>`);}
                    else{html=html+line.replace(/^(\d+)(\.\s+)(.+)/g,`<ol start="$1"><li>$3</li>`);}
                    continue;
                }
                if(line.match(/^[\-\+\*]\s/g)!=null && line.match(/^\-\s\[[\sxX]\]\s+/g)==null){//无序列表开始
                    if_list++;
                    end_list.unshift(`</ul>`);
                    html=html+line.replace(/^([\-\+\*]\s)(.+)/g,`<ul><li>$2</li>`);
                    continue;
                }
            }
            if(if_list!=0){
                if(line.match(/^\s*\d+\.\s/g)!=null){//有序列表继续
                    if(line.match(/^\s*\d+\.\s/g)[0].match(/\s/g).length==if_list*3-2){//有序列表正常继续
                        html=html+line.replace(/^(\s*\d+\.\s+)(.+)/g,`<li>$2</li>`);
                        continue;
                    }
                    if(line.match(/^\s*\d+\.\s/g)[0].match(/\s/g).length==if_list*3+1){//嵌套一层有序列表
                        if_list++;
                        end_list.unshift(`</ol>`);
                        html=html+line.replace(/^(\s*\d+\.\s+)(.+)/g,`<ol><li>$2</li>`);
                        continue;
                    }
                    {//嵌套结束
                        var i=Math.round(if_list-(line.match(/^(\s*\d+\.\s)/g)[0].match(/\s/g).length-1)/3);
                        for(;i>1;i--){html=html+end_list.shift();if_list--;}
                        html=html+line.replace(/^(\s*\d+\.\s+)(.+)/g,`<li>$2</li>`);
                        continue;
                    }    
                }
                if(line.match(/^\s*[\-\+\*]\s/g)!=null){
                    if(line.match(/^\s*[\-\+\*]\s/g)[0].match(/\s/g).length==if_list*3-2){//无序列表正常继续
                        html=html+line.replace(/^(^\s*[\-\+\*]\s+)(.+)/g,`<li>$2</li>`);
                        continue;
                    }
                    if(line.match(/^\s*[\-\+\*]\s/g)[0].match(/\s/g).length==if_list*3+1){//嵌套一层无序列表
                        if_list++;
                        end_list.unshift(`</ul>`);
                        html=html+line.replace(/^(\s*[\-\+\*]\s+)(.+)/g,`<ul><li>$2</li>`);
                        continue;
                    }
                    {//嵌套结束
                        var i=Math.round(if_list-(line.match(/^(\s*\-\s)/g)[0].match(/\s/g).length-1)/3);
                        for(;i>1;i--){html=html+end_list.shift();if_list--;}
                        html=html+line.replace(/^(\s*[\-\+\*]\s+)(.+)/g,`<li>$2</li>`);
                        continue;
                    }    
                }
                if(line.match(/^\s*\d+\.\s/g)==null && line.match(/^\s*\-\s/g)==null){//列表结束
                    html=html+end_list.join("");
                    end_list=[];
                    if_list=0;
                }
            }
        }
        {//表格
            if(if_table==1 && line.match(/(\|)?(([^\|]*)\|)+([^\|]*)(\|)?/g)!=line){//结束表格
                if_table=0;
                html=html+`</table>`;
            }
            if(if_table==0 && line.match(/(\|)?(([^\|]*)\|)+([^\|]*)(\|)?/g)==line){//开始表格
                if(mdlist[mdi+1] && mdlist[mdi+1].match(/(\|)?(([^\|]*)\|)+([^\|]*)(\|)?/g)==mdlist[mdi+1]){
                    if(line.match(/^(\|)(([^\|]*)\|)+([^\|]*)(\|)$/g)==line){
                        line=line.replace(/^(\|)(.*)(\|)$/g,`$2`);
                    }
                    if_table=1;
                    mdi++;
                    html=html+`<table><tr><th>`+line.replace(/\|/g,`</th><th>`)+`</th></tr>`;
                    continue;
                }
            }
            if(if_table==1 && line.match(/(\|)?(([^\|]*)\|)+([^\|]*)(\|)?/g)==line){
                if(line.match(/^(\|)(([^\|]*)\|)+([^\|]*)(\|)$/g)==line){
                    line=line.replace(/^(\|)(.*)(\|)$/g,`$2`);
                }
                html=html+`<tr><td>`+line.replace(/\|/g,`</td><td>`)+`</td></tr>`;
                continue;
            }
        }
        {//引用
            function times(text,time){
                var longtext='';
                for(var j=0;j<time;j++)
                {
                    longtext=longtext+text;
                }
                return longtext;
            }
            if(if_bq>0 && line.match(/^\>+\s/g)==null){
                html=html+times('</blockquote>',if_bq);
                if_bq=0;
            }
            if(if_bq==0 && line.match(/^\>+\s/g)!=null){
                if_bq=line.match(/^\>+/g)[0].match(/\>/g).length;
                html=html+times('<blockquote>',if_bq)+line.replace(/(^\>+\s)(.*)/g,'<p>$2</p>');
                continue;
            }
            if(if_bq>0 && line.match(/^\>+\s/g)!=null){
                if(if_bq==line.match(/^\>+/g)[0].match(/\>/g).length){
                    html=html+line.replace(/(^\>+\s)(.*)/g,'<p>$2</p>');continue;
                }
                if(if_bq>line.match(/^\>+/g)[0].match(/\>/g).length){
                    html=html+times('</blockquote>',if_bq-line.match(/^\>+/g)[0].match(/\>/g).length)+line.replace(/(^\>+\s)(.*)/g,'<p>$2</p>');
                    if_bq=line.match(/^\>+/g)[0].match(/\>/g).length;continue;
                }
                if(if_bq<line.match(/^\>+/g)[0].match(/\>/g).length){
                    html=html+times('<blockquote>',line.match(/^\>+/g)[0].match(/\>/g).length-if_bq)+line.replace(/(^\>+\s)(.*)/g,'<p>$2</p>');
                    if_bq=line.match(/^\>+/g)[0].match(/\>/g).length;continue;
                }
            }
        }
        html=html+`<p>`+line+`</p>`;
    }
    return html;
}
