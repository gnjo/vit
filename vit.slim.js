/*history
v0.1 make
v1.0 seln demo https://codepen.io/gnjo/pen/jOPBVNj
*/
const CR="\n";
var vlib={}
;(function(root){
 var fps=60,ms=50,count=0,callary=[],running=false,stopflg=false,cl=void 0
 ;
 function loop() {
  callary.map(f=>f(count))
  if(stopflg)return clearTimeout(cl)
  return cl=setTimeout(()=>{return ++count,requestAnimationFrame(loop)},ms)
 }
 function entry(_fps,_caller){
  if(_caller) callary.push(_caller)
  if(running)return console.log('already running')
  return fps=_fps||60,ms=1000/fps,loop()
 }
 function getcount(){return count}
 function fpsclear(debugmes){return stopflg=true,console.log(debugmes,'fpsclear')}
 ;
 root.fps=entry
 root.fpsclear=fpsclear
 root.getcount=getcount
})(this); 

/////////////////////////////////////////
var $$l //nowread line
var $$$ //return
var $wk //dump
/////////////////////////////////////////
var $$f //v1.0 footstep address jump history
var $$k //key
var $keyconf=keyconfig('w,a,s,d,j,k,i,l,u,o')
function keyconfig(str){
 //$keyconf={37:'<',39:'>',38:'^',40:'v',70:'A',68:'B',65:'X',83:'Y',82:'R',69:'L'}
 let t="^,<,v,>,A,B,X,Y,L,R".split(',')
 ,k=str.split(',').map(d=>(d.length>1)?d:d.toUpperCase().charCodeAt(0))
 ,keys={}
 k.map((d,i)=>{ keys[d]=t[i] })
 return keys
}
function keycall(caller){
 $$k=''//oldkey reset
 let el=document.documentElement,del=()=>{el.onkeydown=void 0}
 //caller(k,del) //if use end, need the del()
 el.onkeydown=function(ev){
  if(/*$waitcount||*/!$keyconf[ev.which])return;
  $$k=$keyconf[ev.which],caller($$k,del)
 }
}
/*keycall((k,del)=>{
 fn.q('pre').textContent=k
 if(k==='X')del();
})*/
/////////////////////////////////////////
;(function(root){
  //MRK JMP FNC EVM EVL  
 let ma={
  group:/#.*|{.*}>>>(#.*|{.*}|\d.*)|([\w\d].*)>.*|{{{([\s\S]*?)}}}|\$.*=.*/g
  ,trim:/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm
  ,types:'MRK,JMP,EVM,FNC,EVL,CMM'.split(',')
  ,MRK:/^#.*/
  ,JMP:/^{.*}>>>(#.*|{.*}|\d.*)/ //jump
  ,EVL:/^\$.*=.*/ //eval javascript
  ,EVM:/^{{{([\s\S]*?)}}}/ //eval message
  ,FNC:/^([\w\d].*)>.*/
  ,CMM:/^.*/
 }
 function lexs(text,offset){
  let oi=offset||0,jumps={}
  let lists=text.replace(ma.trim,'').replace(ma.trim2,'').match(ma.group)  //v1.5 %{{{}}} cut
  .map((d,i)=>{
   let type='CMM';
   for(type of ma.types)
    if(ma[type].test(d))break;
   if(type==='MRK') jumps[d]=i+oi
   return {str:d,type:type,line:i+oi}
  })
  return {jumps:jumps,lists:lists}
 }
 ;
 root.lexs=lexs
})(this);
/////////////////////////////////////////
;(function(root){
 let lexs=root.lexs
 function entry(){
  let o={}
  o.lists=[], o.jumps={}, o.line=0, o.block=0, o.end=0, o.lexs=lexs
  ;
  o.add=(text)=>{
   let x=o.lexs(text,o.lists.length)
   o.lists=o.lists.concat(x.lists)
   o.jumps=Object.assign(o.jumps,x.jumps)
   return o;
  }
  ;
  o.get=()=>{
   let s=o.block?void 0:o.lists[o.line]
   if(s) o.block=1;
   return s;
  }
  o.next=(d)=>{
   ;(d!=null)?o.line=d:o.line++;
   o.end=(o.lists.length-1<o.line)?1:0;
   return o.block=0
  }
  o.reload=(_list)=>{
   return o.block=1,o.line=999999,o.lists=_list||[],o.line=0,o.block=0;
  }
  o.isend=()=>{return o.end}
  o.isEnd=o.isend
  return o;
 }
 root.reader=entry;
})(this);
/////////////////////////////////////////
;(function(root){
 let fn={}
 fn.toSmall=(str)=>{
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
   return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  }) 
 }
 fn.toBig=(str)=>{
  return str.replace(/[A-Za-z0-9]/g, function(s) {
   return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
  });
 }
 root.toSmall=fn.toSmall;
 root.toBig=fn.toBig
})(this);
///////////////////////////////////////////
;(function(root){
 let toBig=root.toBig
 ;
 //comment trim 
 function _c(d){return d.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm,'')}
 //eval
 function _(obj){return Function('return (' + obj + ')')()}
 //message rep
 function _m(obj,bigflg){return obj.replace(/{(.*?)}/g,(d,dd)=>{return $$$=_(dd),bigflg?toBig(''+$$$):$$$})}
 //trim { and }
 function _t(obj){return obj.replace(/{|}/g,'')}
 function _t2(obj){return obj.replace(/{{{|}}}/g,'').trim()}
 root._c=_c
 root._=_
 root._m=_m
 root._t=_t
 root._t2=_t2 
})(this);
//////////////////////////////////////////////
;(function(root){
  //MRK JMP FNC EVM EVL 
 let vlib=root.vlib 
 vlib.CMM=(str,o)=>{return o.next()}
 vlib.EVL=(str,o)=>{return $$$ = _(_t(str)),o.next()}
 vlib.EVM=(str,o)=>{return $$$ =_m(_t2(str)),o.next()}
 vlib.JMP=(str,o)=>{
  let a=str.split('>>>'),addr=_m(a[1]),i=/^\d+$/.test(addr)?parseInt(i):o.search(addr)
  //console.log(a)
  if($MRK!=addr)o.setjumpback() //v0.9
  let flg = _(_t(a[0]));
  $$$ =flg;
  //console.log('!jump!',i)
  if(!flg || i==void 0)return o.next()
  else return $JMP=i,o.next(i)
 }
 vlib.MRK=(str,o)=>{
  $$$ = o.line////////
  $MRK =str;//v0.9
  let n=$$f[str]
  if(n||n===0) $$f[str]=n+1
  return o.next();
 }
 vlib.FNC=(str,o)=>{
  let a=str.split('>'),cmd=a[0],_str=a[1]
  if(!vlib[cmd])return vlib.CMM(str,o),console.log('vlib cmd not found',cmd)
  //
  if(root['$'+cmd]===undefined) root['$'+cmd]=void 0 //create valiable
  return vlib[cmd](_str,o) //call next() is top function
 }
 root.vlib=vlib
})(this);
//////////////////////////////////
;(function(root){
  let vlib=root.vlib
  vlib.k=(str,o)=>{
  $k=$$k=void 0
  keycall((k,del)=>{
   if(k) $k=k,del(),o.next();
  })
  return;
 } 
 root.vlib=vlib
})(this);
//////////////////////////////////  
;(function(root){
 let vlib=root.vlib,fps=root.fps
 function entry(text,userlib,_fps,debugflg){
  let o=reader();
  o.keyset='w,a,s,d,j,k,i,l,u,o'
  o._fps=_fps||60
  o.cmds=Object.assign(vlib,userlib)
  o.jumpback=0
  o.setjumpback=()=>{return o.jumpback=o.line+1}  //v0.9
  o.search=(d)=>{return (d==='###')?o.jumpback:o.jumps[d]}
  o.makefootstep=()=>{
   //v1.0 if footstep input like a save, $$f is exist.   
   if(!$$f) $$f={},Object.keys(o.jumps).map(k=>$$f[k]=0);
  }
  o.cmd=(list)=>{//{str,type,line}
   return (o.cmds[list.type]||o.cmds['CMM'])(list.str,o)
  }
  o.lop=()=>{
   if(o.isend())return console.log('endline') /////
   $$l=o.line //v0.9
   let list=o.get();
   if(list) o.cmd(list)
   if(list&&debugflg)console.log(list)
  }
  o.run=()=>{
   let isstring = function(obj){return toString.call(obj) === '[object String]'}
   isstring(text)?o.add(text):text.map(d=>o.add(d))//v1.0 multi text
   o.makefootstep()//v1.0
   if(debugflg)console.log(o.lists)   
   fps(_fps,o.lop)
   return o;
  }
  ;
  return o.run();
 }
 root.vit=entry;
})(this);


///////////
//seln
///////////
///////////
//seln
///////////
;(function(root){
 let is=root.is||{},fn=root.fn||{}
 ;
 is.is=function(d){return (d||d===0)}
 is.string = function(obj){return toString.call(obj) === '[object String]'} //
 fn.deep=d=>JSON.parse(JSON.stringify(d));
 fn.clone=fn.deep
 ;
 
function entry(text,w,maxlen){
 ;
 let o={};
 o.w=w //if null is no limit.
 o.strempty=fn.fstr(' ',o.w)
 o.maxlen=maxlen||2
 o.c='*'
 o._c=' '
 o.baseary=text.split('\n') //is.string(text)?text.split('\n'):fn.clone(text) 
 o.tableflg=/|/.test(text)
 o.strpage='01/01'
 o.strhead=void 0
 o.strfoot=void 0
 o.pageflg=false
 o.helpflg=false
 o.a=[]
 o.n=0
 o.cn=0
 o.val=''
 o._page=(n,max)=>{return o.strpage=('000'+n).slice(-2)+'/'+('000'+max).slice(-2),o }
 o.head=(text,pageflg)=>{return o.strhead=text,o.pageflg=pageflg,o }
 o.foot=(text,helpflg)=>{return o.strfoot=text,o.helpflg=helpflg,o }
 o.calc=()=>{
  let f=(i)=>{return o.cn===i?o.c:o._c}
  let f2=(a,b)=>{return fn.ostr(fn.rpad(a,o.w,' '),b)}
  let now=o.n-o.cn
  o.val=o.baseary[o.n]
  o.a=o.baseary.slice(now,now+o.maxlen).map((d,i)=>f(i)+d)
  //
  o._page(o.n+1,o.baseary.length)
  //
  let wkh=[''],wkf=['']
  if(o.strhead){
   wkh=[ (o.pageflg)?f2(o.strhead,o.strpage):o.strhead ,' '];   
  }
  if(o.strfoot){
   if(o.helpflg) o.strfoot=o.val.split('|').pop()
   wkf=['',o.strfoot]
  }
  //
  if(o.w) o.a=o.a.map(d=>d.slice(0,o.w))  
  if(o.tableflg) o.a=o.a.map(d=>{
   let x=d.split('|')
   return f2(x[0],x[1]||'')
  })
  o.a=[].concat(wkh,o.a,wkf)
  return o;
 }
 o.key=(k)=>{
  if(!(k==='^'||k==='v'))return o
  ;
  let n=o.n,cn=o.cn
  if(k==='^'){
   n=Math.max(--n,0)
   cn=Math.max(--cn,0)      
  }
  if(k==='v'){
   n=Math.min(++n,o.baseary.length-1)
   cn=Math.min(++cn,o.maxlen-1)
  }
  ;
  return o.set(n,cn)
 }
 o.cursor=(a,b)=>{return o.c=a,o._c=b,o}
 o.set=(n,cn)=>{return o.n=n,o.cn=cn,o.calc() }
 o.get=(stringflg,calc)=>{
  let f=calc||function (d){return d}
  return f( (stringflg)?o.a.join('\n'):o.a )
 }
 ;
 return o;
}
 //
 root.seln=entry;
 //
 /*
$00=seln($$$,30,2).cursor('＊','　').set(1,1)
$wk=d3.select('#x').text($00.get(1))
#aaa.loop
k>
$wk=d3.select('#x').text( $00.key($k).get(1) ) 
 */
})(this);
