function yomico(b){function a(b){let c=[];for(b=b.firstChild;b;b=b.nextSibling)b.tagName=="TEMPLATE"&&(b=b.content),b.nodeType==3?c.push(b):c=c.concat(a(b));return c}function c(c,e){let b=a(document);e&&(b=b.filter(a=>e(a))),b.forEach(a=>{c=d(a,c)})}function d(f,d){const c=document.createElement("span");let a=0,b=f.textContent;while(!0){if(a>=d.length)break;const[g,h]=d[a],f=b.indexOf(g);if(f==-1)break;if(a+=1,f!=0){const a=document.createElement("span");a.textContent=b.slice(0,f),c.appendChild(a)}const i=e(g,h);c.appendChild(i),b=b.slice(f+g.length)}if(a!=0){const a=document.createElement("span");a.textContent=b,c.appendChild(a),f.replaceWith(c)}return d.slice(a)}function e(c,d){const a=document.createElement("ruby");a.textContent=c;const b=document.createElement("rt");return b.textContent=d,a.appendChild(b),a}fetch(b).then(a=>a.text()).then(b=>{const a=[];b.trimEnd().split("\n").forEach(b=>{const[c,d,e]=b.split(",");a.push([c,d])}),c(a)})}export{yomico}