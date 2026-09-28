#!/bin/zsh
# usage: gen.sh <name> <ceiling> <node create args...>
# runs a generation, logs spend, downloads every result to gen/<name>[_i].<ext>
export PATH="$HOME/.local/bin:$PATH"
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

name=$1; ceil=$2; shift 2
dreamina-canvas node create "$@" --title "$name" --run --credit-ceiling $ceil --wait --timeout 25m --non-interactive --format json > gen/$name.json 2>gen/$name.err
python3 - "$name" <<'E'
import json,sys,subprocess,os
n=sys.argv[1]; d=json.load(open(f'gen/{n}.json'))
if not d.get('ok'): print(n,'FAILED',json.dumps(d,ensure_ascii=False)[:600]); sys.exit(1)
dd=d['data']; node=dd['node']['nodeId']; q=dd.get('quote',{}).get('maxCredits'); sub=dd.get('submission',{})
open('spend.log','a').write(f"{n} {node} {q} {sub.get('state')}\n")
print(n,node,'credits',q,'state',sub.get('state'))
for i,r in enumerate(sub.get('resources',[])):
  if r.get('state')!='succeeded': print('  res',r); continue
  out=subprocess.run(['dreamina-canvas','resource','download',r['resourceId'],'-o','gen/','--non-interactive','--format','json'],capture_output=True,text=True).stdout
  p=json.loads(out)['data']['path']; ext=os.path.splitext(p)[1]
  dst=f"gen/{n}{'_'+str(i) if i else ''}{ext}"; os.rename(p,dst); print('  ->',dst,r['resourceId'])
E
