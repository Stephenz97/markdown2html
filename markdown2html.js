function title(text){
    if(text.indexOf("###### ")==0){
        text=text.replace("###### ","" );
        return `<h6>${text}</h6>`;
    }
    if(text.indexOf("##### ")==0){
        text=text.replace("##### ","" );
        return `<h5>${text}</h5>`;
    }    
    if(text.indexOf("#### ")==0){
        text=text.replace("#### ","" );
        return `<h4>${text}</h4>`;
    }
    if(text.indexOf("### ")==0){
        text=text.replace("### ","" );
        return `<h3>${text}</h3>`;
    }
    if(text.indexOf("## ")==0){
        text=text.replace("## ","" );
        return `<h2>${text}</h2>`;
    }
    if(text.indexOf("# ")==0){
        text=text.replace("# ","" );
        return `<h1>${text}</h1>`;
    }
    return text;
}

function font(text){
    text=text.replace(/(.*)(\*\*)(.*)(\*\*)(.*)/g,`$1<strong>$3</strong>$5`);
    text=text.replace(/(.*)(\*)(.*)(\*)(.*)/g,`$1<em>$3</em>$5`);
    text=text.replace(/(.*)(\~\~)(.*)(\~\~)(.*)/g,`$1<del>$3</del>$5`);
    text=text.replace(/(.*)(\=\=)(.*)(\=\=)(.*)/g,`$1<span style="background-color:yellow;">$3</span>$5`);
    text=text.replace(/(.*)(\~)(.*)(\~)(.*)/g,`$1<sup>$3</sup>$5`);
    text=text.replace(/(.*)(\^)(.*)(\^)(.*)/g,`$1<sub>$3</sub>$5`);
    return text;
}

function picture(text){
    text=text.replace(/(.*)(\!\[)(.*)(\]\()(.*)(\s\")(.*)(\"\))(.*)/g,`$1<img src="$5" title="$7" alt="$3"/>$9`);
    text=text.replace(/(.*)(\!\[)(.*)(\]\()(.*)(\s\')(.*)(\'\))(.*)/g,`$1<img src="$5" title="$7" alt="$3"/>$9`);
    return text;
}

function link(text){
    text=text.replace(/(.*)(\[)(.*)(\]\()(.*)(\s\")(.*)(\"\))(.*)/g,`$1<a href="$5" title="$7" target="_blank">$3</a>$9`);
    text=text.replace(/(.*)(\[)(.*)(\]\()(.*)(\s\')(.*)(\'\))(.*)/g,`$1<a href="$5" title="$7" target="_blank">$3</a>$9`);
    return text;
}

function line(text){
    if((text.replace(/\-/g,0)==0 || text.replace(/\*/g,0)==0) && text.length>2){
        return "<hr/>";
    }
    return text;
}

function list(text,if_list){
    if((text.indexOf("- [x] ")==0||text.indexOf("- [ ] ")==0||text.indexOf("+ ")==0||text.indexOf("- ")==0||text.indexOf("* ")==0) && if_list==0){
        return "1";
    }
    
    if(text.indexOf("- [x] ")==0){
        return `<input type="checkbox" checked>${text.replace("- [x] ")}</input>`;
    }
    if(text.indexOf("- [ ] ")==0){
        return `<input type="checkbox">${text.replace("- [ ] ")}</input>`;
    }
    return text;
}

function table(text){

}

function pre(text){

}

function md2blog(md){
    var mdlist=md.split(/\n/g);
    var html="";
    var if_list=0;
    //var if_table=false;
    //var if_pre=false;
    for (mdi in mdlist){
        var text=mdlist[mdi];
        text=line(text);
        text=font(text);
        text=picture(text);
        text=link(text);
        text=title(text);
        text=list(text,if_list);
        html=html+text;
    }
    return html;
}