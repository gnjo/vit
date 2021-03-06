/////////////////////////////////////////
var $$m //mode
var $$n //select number -1 is cancel
var $$s //select list
var $$o //output
var $$a //nowaddress
var $$l //nowread line
var $$j //jumpback line
var $$$ //return
/////////////////////////////////////////
var $$f //v1.0 footstep address jump history
var $$b //v1.1 background image
var $$c //v1.2 center image
/////////////////////////////////////////
var $$r //v1.5 resource 
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
/*
keycall((k,del)=>{
 fn.q('pre').textContent=k
 if(k==='X')del();
})
*/
/////////////////////////////////////////
;(function(root){
 let ma={
  group:/#.*|\!.*|{.*}>>>(#.*|{.*})|k>.*|(|\*|\?|[ims][0-9])>.*|\*[^>].*|{{{([\s\S]*?)}}}|{.*}|.*/g
  ,trim:/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm
  ,trim2:/%{{{([\s\S]*?)}}}/gm //trim2
  ,types:'MRK,MOD,KWT,SEL,MES,WIT,JMP,EVM,EVL,CMM'.split(',')
  ,MRK:/^#.*/
  ,MOD:/^\!.*/
  ,JMP:/^{.*}>>>(#.*|{.*})/ //jump
  ,MES:/^>.*/ //message input
  ,SEL:/^\?>.*/ //select
  ,EVL:/^{.*}/ //eval javascript
  ,EVM:/^{{{([\s\S]*?)}}}/ //eval message
  ,KWT:/^k>.*/ //key wait
  ,WIT:/^\*/ //increase the wait
  ,CMM:/^.*/
 }
 function lexs(text,offset){
  let oi=offset||0
  let jumps={}
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
  o.lists=[] //lists
  o.jumps={}
  o.line=0 //count
  o.block=0 //flg
  o.end=0 //flg
  o.lexs=lexs
  ;
  o.add=(text)=>{
   let l=o.lists.length
   let x=o.lexs(text,l)
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
   (d!=null)?o.line=d:o.line++;
   o.end=(o.lists.length-1<o.line)?1:0;
   return o.block=0
  }
  o.reload=(_list)=>{
   o.block=1;
   o.line=999999;
   o.lists=_list||[]
   o.line=0;
   o.block=0;
   return;
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
 const arrayChunk = ([...array], size = 1) => {
  return array.reduce((acc, value, index) => index % size ? acc : [...acc, array.slice(index, index + size)], []);
 }
 function sel6(ary,_n,head,_cur,_smax){
  let smax=_smax||6
  ,n=_n%ary.length
  ,cur=_cur||'＊'
  ,a=arrayChunk(ary,smax)
  ,pmax=a.length
  ,pnow=Math.floor(n/smax)
  ,b=a[pnow]
  ,m=n%smax
  ,mes1=`${head} [${pnow+1}/${pmax}]`+'\n'
  ,mes2=b.map((d,i)=>(m===i)?cur+d:'　'+d).join('\n')
  ;
  return mes1+mes2
 }
 root.sel6=sel6
 root.selnum=sel6
 //
})(this);
///////////////////////////////////////
;(function(root){
 //'MRK,MOD,KWT,SEL,MES,WIT,JMP,EVM,EVL,CMM'
 let cmds={}
 cmds.MOD=(str,o)=>{
  $$m=str.slice(1)
  return o.next()
 }
 cmds.CMM=(str,o)=>{
  //comment
  return o.next()
 }
 cmds.EVL=(str,o)=>{
  $$$ = _(_t(str));
  return o.next();
 }
 cmds.EVM=(str,o)=>{
  $$$ =_m(_t2(str));///
  return o.next();
 }
 cmds.JMP=(str,o)=>{
  let a=str.split('>>>'),addr=_m(a[1]),i=o.search(addr)
  //console.log(a)
  if($$a!=addr)o.setjumpback() //v0.9
  let flg = _(_t(a[0]));
  $$$ =flg;
  //console.log('!jump!',i)
  return (!flg || i==void 0)?o.next():o.next(i)
 }
 cmds.MRK=(str,o)=>{
  $$$ = o.line////////
  $$a =str;//v0.9
  let n=$$f[str]
  if(n||n===0) $$f[str]=n+1
  return o.next();
 }
 cmds.WIT=(str,o)=>{
  let time=o.waitms*str.length
  let cl=setTimeout(()=>{clearTimeout(cl),o.next()},time)
  return;
 }
 cmds.KWT=(str,o)=>{
  $$k=void 0
  keycall((k,del)=>{
   if(k) del(),o.next();
  })
  return;
 } 
 cmds.SEL=(str,o)=>{
  //...
  let a=str.split('>')
  ,list=_(_t(a[1]));
  let se=list.split('\n')
  ,head=$$o//=se[n]
  $$n=0;
  $$s=se;
  $$o=selnum(se,$$n,head,'＊',4);  
  keycall((k,del)=>{
   if(k==='B')return $$n=-1,del(),o.next();
   if(k==='A')return $$$=se[$$n],del(),o.next();
   if(k==='^') $$n--,$$n=($$n<0)?se.length-1:$$n
   if(k==='v') $$n++,$$n=$$n%se.length;
   $$o=selnum(se,$$n,head,'＊',4);   
  })
 }
 cmds.MES=(str,o)=>{
  let a=str.split('>'),mes=_m(a[1],1)
  $$$=$$o=mes,o.next()
  return o.next()
 }

 root.cmds=cmds
})(this);
//////////////////////////////////  
;(function(root){
 //if vairable not include stab
 let variableRead=root.variableRead || function(){return console.log('variable.js not include')} //v1.5
 
 function entry(text,debugflg){
  let o=reader();
  o.fps=60//20
  o.interval=1000/o.fps
  o.waitms=50
  o.keyset='w,a,s,d,j,k,i,l,u,o'
  o.cmds=cmds
  o.variable=variableRead //v1.5
  o.jumpback=0
  o.setjumpback=()=>{return $$j=o.jumpback=o.line+1}  //v0.9
  o.search=(d)=>{return (d==='###')?o.jumpback:o.jumps[d]}
  o.makefootstep=()=>{
   //v1.0 if footstep input like a save, $$f is exist.   
   if(!$$f) $$f={},Object.keys(o.jumps).map(k=>$$f[k]=0);
  }
  o.cmd=(list)=>{
   //{str,type,line}
   return (o.cmds[list.type]||o.cmds['CMM'])(list.str,o)
  }
  o.lop=()=>{
   if(o.isend())return clearInterval(o.cl),console.log('endline') /////
   $$l=o.line //v0.9
   let list=o.get();
   if(list) o.cmd(list)
   if(list&&debugflg)console.log(list)
   if(vit)return vit($$o,o)    
  }
  o.run=()=>{
   if(!$$r) $$r={}
   let isstring = function(obj){return toString.call(obj) === '[object String]'}
   isstring(text)?o.variable(text,$$r):text.map(d=>o.variable(d,$$r))//v1.5 multi text
   isstring(text)?o.add(text):text.map(d=>o.add(d))//v1.0 multi text
   //o.add(text)
   o.makefootstep()//v1.0
   if(debugflg)console.log(o.lists)
   o.cl=setInterval(o.lop,o.interval)
   return o;
  }
  ;
  //
  return o.run();
 }
 root.vitRead=entry;
 root.vit=function vit(mes){
  //user function
 }
})(this);
