const MESES=["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
const M={mean:[77.84858333333334,1012.0756666666665,2.1969666666666665,-0.005849364905389027,0.011547005383792464],
scale:[6.801280369145373,2.443752146915796,0.82874400886053,0.7070825870647668,0.7070124939961576],
coef:[-0.7549487789597203,-0.4513556420499276,-0.28997196263976577,1.4811200430692864,0.37430032314304085],b:24.58350000000003};
const MAE=0.73,FAIXA={um:[52.2,98.3,"Umidade (%)"],pr:[1004.2,1019.7,"Pressão (hPa)"],ve:[0.76,7.14,"Vento (m/s)"]};
const LIM={um:[0,100,"Umidade (%)"],pr:[900,1100,"Pressão (hPa)"],ve:[0,40,"Vento (m/s)"]};
const $=id=>document.getElementById(id);
$("mes").innerHTML=MESES.map((m,i)=>`<option value="${i+1}">${m}</option>`).join("");
function prever(mes,um,pr,ve){const x=[um,pr,ve,Math.sin(2*Math.PI*mes/12),Math.cos(2*Math.PI*mes/12)];
return M.b+x.reduce((s,v,i)=>s+M.coef[i]*(v-M.mean[i])/M.scale[i],0)}
const f1=n=>n.toFixed(1).replace(".",",");
function chart(d){const W=640,H=260,l=44,r=12,t=14,b=56;
const lo=Math.min(...d)-.5,hi=Math.max(...d)+.5,X=i=>l+i*(W-l-r)/11,Y=v=>t+(hi-v)*(H-t-b)/(hi-lo);
let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" style="min-width:420px">`;
for(let k=0;k<=4;k++){const v=lo+(hi-lo)*k/4;s+=`<line x1="${l}" x2="${W-r}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--bd)"/><text x="${l-6}" y="${Y(v)+4}" text-anchor="end">${v.toFixed(1)}</text>`}
s+=`<polyline fill="none" stroke="var(--ac)" stroke-width="2.5" points="${d.map((v,i)=>X(i)+","+Y(v)).join(" ")}"/>`;
d.forEach((v,i)=>{s+=`<circle cx="${X(i)}" cy="${Y(v)}" r="4" fill="var(--ac)"><title>${MESES[i]}: ${f1(v)} °C</title></circle><text transform="translate(${X(i)+4},${H-b+14}) rotate(45)">${MESES[i].slice(0,3)}</text>`});
return s+"</svg>"}
function run(){const out=$("out"),erros=[],v={};
for(const k of ["um","pr","ve"]){const n=parseFloat($(k).value.replace(",","."));const [lo,hi,nome]=LIM[k];
if(!isFinite(n)||$(k).value.trim()==="")erros.push(nome+": informe um número.");else if(n<lo||n>hi)erros.push(`${nome}: deve estar entre ${lo} e ${hi}.`);else v[k]=n}
if(erros.length){out.innerHTML=erros.map(e=>`<div class="err">${e}</div>`).join("");return}
const mes=+$("mes").value,t=prever(mes,v.um,v.pr,v.ve);let av="";
for(const k in FAIXA){const[lo,hi,nome]=FAIXA[k];if(v[k]<lo||v[k]>hi){av=`<div class="warn">${nome} está fora da faixa vista no treino (${lo} a ${hi}); a previsão pode ser menos confiável.</div>`;break}}
const anual=MESES.map((_,i)=>prever(i+1,v.um,v.pr,v.ve));
out.innerHTML=`<div class="res"><div>Temperatura prevista</div><div class="big">${f1(t)} °C</div>
<div>Erro típico (MAE): <b>±${f1(MAE)} °C</b>. Ou seja, o valor real costuma ficar entre ${f1(t-MAE)} °C e ${f1(t+MAE)} °C.</div></div>${av}
<p class="cap" style="margin-top:16px">Mesmas condições de umidade, pressão e vento, em cada mês do ano:</p><div class="sc">${chart(anual)}</div>`}
$("go").onclick=run;
for(const k of ["um","pr","ve"])$(k).addEventListener("keydown",e=>{if(e.key==="Enter")run()});
function tab(n){$("p1").classList.toggle("hide",n!=1);$("p2").classList.toggle("hide",n!=2);$("t1").classList.toggle("on",n==1);$("t2").classList.toggle("on",n==2)}
$("t1").onclick=()=>tab(1);$("t2").onclick=()=>tab(2);