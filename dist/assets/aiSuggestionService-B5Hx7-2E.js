import{O as u}from"./index-DU3xAm2I.js";var y=(t=>(t.Critical="critical",t.High="high",t.Medium="medium",t.Low="low",t.Info="info",t))(y||{}),d=(t=>(t.Functionality="functionality",t.Accessibility="accessibility",t.Performance="performance",t.SEO="seo",t.Security="security",t.BestPractice="best-practice",t.Visual="visual",t.UX="ux",t))(d||{}),f=(t=>(t.Links="links",t.Buttons="buttons",t.Forms="forms",t.Responsive="responsive",t.SEO="seo",t.Accessibility="accessibility",t.Performance="performance",t.Console="console",t.Images="images",t.Security="security",t))(f||{});class b{constructor(){this.apiKey=null}async initialize(){const e=await chrome.storage.local.get(["openai_api_key"]);this.apiKey=e.openai_api_key}async enhanceIssue(e,a){if(!this.apiKey)return e;try{const s=new u({apiKey:this.apiKey,dangerouslyAllowBrowser:!0}),o=`You are a web development expert. A bug was detected on a webpage.

Page: ${a.title} (${a.url})

Issue Type: ${e.type}
Severity: ${e.severity}
Problem: ${e.description}
Location: ${e.location}

Provide:
1. A clear explanation of WHY this is problematic (2-3 sentences)
2. The business/UX impact
3. A specific, actionable fix (step-by-step)

Be concise and practical.`,r=(await s.chat.completions.create({model:"gpt-4o-mini",messages:[{role:"system",content:"You are an expert web developer helping to fix bugs. Provide clear, actionable advice."},{role:"user",content:o}],max_tokens:300,temperature:.7})).choices[0].message.content||"";return{...e,suggestion:r,resources:[...e.resources||[],"✨ Enhanced with AI suggestions"]}}catch(s){return console.error("AI enhancement failed:",s),e}}async generateExecutiveSummary(e){if(!this.apiKey)return this.getBasicSummary(e);try{const a=new u({apiKey:this.apiKey,dangerouslyAllowBrowser:!0}),s=e.allIssues.filter(n=>n.severity==="critical"),o=e.allIssues.filter(n=>n.severity==="high"),c=`Analyze this webpage quality report and provide an executive summary:

URL: ${e.url}
Overall Health Score: ${e.healthScore.overall}/100

Key Metrics:
- Functionality: ${e.healthScore.functionality}/100
- Accessibility: ${e.healthScore.accessibility}/100
- Performance: ${e.healthScore.performance}/100
- SEO: ${e.healthScore.seo}/100
- Security: ${e.healthScore.security}/100

Total Issues: ${e.summary.totalIssues}
- Critical: ${e.summary.criticalCount}
- High: ${e.summary.highCount}
- Medium: ${e.summary.mediumCount}

Top Issues:
${s.slice(0,3).map(n=>`- ${n.title}: ${n.description}`).join(`
`)}
${o.slice(0,2).map(n=>`- ${n.title}: ${n.description}`).join(`
`)}

Provide:
1. Overall assessment (1 paragraph)
2. Top 3 priorities to fix
3. Estimated impact if fixed

Be professional and concise.`;return(await a.chat.completions.create({model:"gpt-4o-mini",messages:[{role:"system",content:"You are a web quality consultant providing executive summaries."},{role:"user",content:c}],max_tokens:400,temperature:.7})).choices[0].message.content||this.getBasicSummary(e)}catch(a){return console.error("AI summary generation failed:",a),this.getBasicSummary(e)}}async enhanceCriticalIssues(e,a){if(!this.apiKey||e.length===0)return e;const s=e.filter(o=>o.severity==="critical"||o.severity==="high");if(s.length===0)return e;try{const o=new u({apiKey:this.apiKey,dangerouslyAllowBrowser:!0}),c=s.slice(0,5),r=c.map((i,l)=>`Issue ${l+1}: ${i.title}
Type: ${i.type}
Severity: ${i.severity}
Description: ${i.description}
Location: ${i.location}`).join(`

`),n=`You are a web development expert. Multiple bugs were detected on a webpage.

Page: ${a.title} (${a.url})

${r}

For each issue, provide a concise fix suggestion (2-3 sentences each). Format as:

Issue 1: [fix suggestion]
Issue 2: [fix suggestion]
...`,h=((await o.chat.completions.create({model:"gpt-4o-mini",messages:[{role:"system",content:"You are an expert web developer. Provide concise, actionable fixes."},{role:"user",content:n}],max_tokens:500,temperature:.7})).choices[0].message.content||"").split(/Issue \d+:/g).slice(1),g=c.map((i,l)=>{var m;return{...i,suggestion:((m=h[l])==null?void 0:m.trim())||i.suggestion,resources:[...i.resources||[],"✨ AI-Enhanced Fix"]}}),p=new Map(g.map(i=>[i.id,i]));return e.map(i=>p.get(i.id)||i)}catch(o){return console.error("Batch AI enhancement failed:",o),e}}getBasicSummary(e){const a=e.healthScore.overall;let s="";return a>=80?s="Excellent! Your page is in great shape with minimal issues.":a>=60?s="Good foundation, but several areas need attention.":a>=40?s="Significant issues detected. Prioritize critical and high severity fixes.":s="Critical attention required. Multiple serious issues affecting quality.",`${s}

Total Issues: ${e.summary.totalIssues} (${e.summary.criticalCount} critical, ${e.summary.highCount} high priority)`}}export{b as A,d as I,y as S,f as T};
