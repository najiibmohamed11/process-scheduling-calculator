// divimport { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import React from 'react'
import { algorithums, proccess } from '../../../types/types'
import { Button } from '@/components/ui/button';
import { CloudCog } from 'lucide-react';

interface DrowerProp{
    algoritum:algorithums,
    processes:proccess[],
    quantum:number
}

function calculateAvgWaitingTime(processes: proccess[]): string {
  const totalWaitingTime = processes.reduce((acc, curr) => acc + (Number(curr.waitingTime) ?? 0), 0);
  return (totalWaitingTime / processes.length).toFixed(2);
}

function calculateAvgTurnaroundTime(processes: proccess[]): string {
  const totalTurnaroundTime = processes.reduce((acc, curr) => acc + (Number(curr.TurnAroundTime) ?? 0), 0);
  return (totalTurnaroundTime / processes.length).toFixed(2);
}


  function brekDownOfCompletion(processes:proccess[],quantum:number,){
    if(!quantum||!processes){
      return
    }
    let currentQuontum=0;
    let remainingProcess=processes.length;
    let remainingBrustTime=processes.map((process)=>Number(process.brustTime))
    let isComplited=new Array(processes.length).fill(false)
    // let breakDownWork:{[key:string]:[number,number]}[]=[]
    let breakDownWORK:{[key:string]:[number,number,number,number]}[]=[]
    let completionTimes: {[key: string]: number} = {};

//[ round1:{
//   p1:[0,5],
//   p2:[5,10]
// }]
    while(remainingProcess>0){
      let roundBreakDown:{[key:string]:[number,number,number,number]}={}
      for(let i=0;i<processes.length;i++){
        if(!processes[i].waitingTime||!processes[i].TurnAroundTime){
          return;
        }
        if(!isComplited[i]){
          if(remainingBrustTime[i]>quantum){
            currentQuontum+=quantum
            const brustTime=remainingBrustTime[i]//we would use this for showing suptraction related thing
            remainingBrustTime[i]-=quantum
              console.log(processes[i].name,"=",currentQuontum-quantum,"=>",currentQuontum)
            const key=processes[i].name;
            roundBreakDown[key]=[currentQuontum-quantum,currentQuontum,brustTime,remainingBrustTime[i]]
      
          }else{  
            currentQuontum+=remainingBrustTime[i];
            
            const key=processes[i].name;
            roundBreakDown[key]=[currentQuontum-remainingBrustTime[i],currentQuontum,remainingBrustTime[i],0]
            console.log(processes[i].name,"=",currentQuontum-remainingBrustTime[i],"=>",currentQuontum)
            remainingBrustTime[i]=0
            remainingProcess--;
            isComplited[i]=true
            completionTimes[key] = currentQuontum;

          }
        }
      }
      breakDownWORK.push(roundBreakDown)
    }


    console.log(breakDownWORK)
    return {breakDownWORK, completionTimes};
}



function Drower({algoritum,processes,quantum}:DrowerProp) {
  const avgWaitingTime = calculateAvgWaitingTime(processes);
  const avgTurnaroundTime = calculateAvgTurnaroundTime(processes);
  const waitingSum = processes.map(p => Number(p.waitingTime) ?? 0).join(' + ');
  const turnaroundSum = processes.map(p => Number(p.TurnAroundTime) ?? 0).join(' + ');
  const n = processes.length;
  const rrResult = algoritum === algorithums.RR ? brekDownOfCompletion(processes, quantum) : undefined;
  const breakDown = rrResult ? rrResult.breakDownWORK : [];
  const completionTimes = rrResult ? rrResult.completionTimes : {};
  console.log(algorithums.RR===algoritum)
  console.log(breakDown)

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className='mt-6'>Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{algoritum}</DrawerTitle>
          <DrawerDescription>Solution breakdown</DrawerDescription>
        </DrawerHeader>
        <div className="px-4 py-6   flex justify-around  overflow-y-scroll ">
          {/* Waiting Time Breakdown */}
   {algoritum!=algorithums.RR&&       <div className="mb-8 bg-white dark:bg-zinc-900 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-2 text-blue-700 dark:text-blue-300">Waiting Time Breakdown</h2>
            <div className="mb-2 text-gray-700 dark:text-gray-200">
               <span className="font-mono"> WaitingTime =bt[i-1]+wt[i-1] </span>
            </div>
            <div className="mb-2 text-gray-700 dark:text-gray-200">
              <ul className="list-disc ml-8 mt-1">
                {processes.map((p, i) => (
                  i==0?
                    <li key={p.id} className="font-mono">{p.name} =w[0]=0</li>:<div key={p.id}>
                    <li  className="font-mono">{p.name} = bt[{i}-1]+ w[{i}-1]</li>
                    <p  className="font-mono pl-6"> {processes[i-1].brustTime}+{processes[i-1].waitingTime}={p.waitingTime}</p>
                    </div>
                  
                ))}
              </ul>
            </div>
            <div className="mb-2 text-gray-700 dark:text-gray-200">
              <span className="font-semibold">avgWt=</span> SUM(Wt)/# OF PROCESS
              <div className="font-mono text-lg mt-1">({waitingSum}) / {n}</div>
            </div>
            <div className="mb-2 text-gray-700 dark:text-gray-200">
              <div className="font-mono text-lg mt-1">{(processes.reduce((acc, p) => acc + (Number(p.waitingTime) ?? 0), 0))} / {n} = <span className="text-blue-700 dark:text-blue-300 font-bold">{avgWaitingTime}</span></div>
            </div>
          </div>}

          {/* Turnaround Time Breakdown */
          algoritum!=algorithums.RR&& <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-2 text-purple-700 dark:text-purple-300">Turnaround Time Breakdown</h2>
            <div className="mb-2 text-gray-700 dark:text-gray-200">
              <span className="font-semibold">Formula:</span> <span className="font-mono">Turnaround Time = Burst Time + Waiting Time</span>
            </div>
            <div className="mb-2 text-gray-700 dark:text-gray-200">
              <ul className="list-disc ml-8 mt-1">
                {processes.map((p, i) => (
                  <li key={p.id} className="font-mono">{p.name} = {Number(p.brustTime) ?? 0} + {Number(p.waitingTime) ?? 0} = <span className="font-bold">{Number(p.TurnAroundTime) ?? 0}</span></li>
                ))}
              </ul>
            </div>
            <div className="mb-2 text-gray-700 dark:text-gray-200">
              <span className="font-semibold">AVGTT:</span>SUM(TT)/# OF PROCESS
              <div className="font-mono text-lg mt-1">({turnaroundSum}) / {n}</div>
            </div>
            <div className="mb-2 text-gray-700 dark:text-gray-200">
              <div className="font-mono text-lg mt-1">{(processes.reduce((acc, p) => acc + (Number(p.TurnAroundTime) ?? 0), 0))} / {n} = <span className="text-purple-700 dark:text-purple-300 font-bold">{avgTurnaroundTime}</span></div>
            </div>
          </div>}
        {algoritum=== algorithums.RR&&   <div className="flex flex-row gap-6 justify-center items-start w-full mt-4">
            {/* RR Breakdown rounds */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4 min-w-[320px] max-w-[400px] border border-gray-200 dark:border-gray-700 font-mono text-[15px]">
              <div className="font-bold text-lg mb-2 text-green-700 dark:text-green-300">RR Rounds</div>
              {Array.isArray(breakDown) && breakDown.length > 0 ? (
                breakDown.map((round, index) => {
                  const keys = Object.keys(round);
                  return (
                    <div key={index} className="mb-2">
                      {keys.map((key, index2) => {
                        const [start, end, before, after] = round[key];
                        return (
                          <div key={index2} className="pl-2">
                            {key}={start}→{end}={before}-{end-start}={after}{after === 0 && '→done'}
                          </div>
                        );
                      })}
                      <div className="text-gray-400">-----------------------------------</div>
                    </div>
                  );
                })
              ) : (
                <div>No breakdown available.</div>
              )}
            </div>
            {/* Waiting Time Breakdown and Average */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4 min-w-[320px] max-w-[400px] border border-gray-200 dark:border-gray-700 font-mono text-[15px]">
              <div className="font-bold text-lg mb-2 text-blue-700 dark:text-blue-300">Waiting Time</div>
              <div className="mb-1">Waiting Time = Completion Time - Burst Time</div>
              <ul className="mb-2">
                {processes.map((p, i) => (
                  <li key={p.id}>
                    {p.name} = {completionTimes[p.name] ?? '?'} - {Number(p.brustTime) ?? 0} = <span className="font-bold">{completionTimes[p.name] !== undefined ? (completionTimes[p.name] - (Number(p.brustTime) ?? 0)) : '?'}</span>
                  </li>
                ))}
              </ul>
              <div className="mb-1 font-semibold">avgWt = SUM(Wt) / # OF PROCESS</div>
              <div className="mb-1">(
                {processes.map((p, i) => {
                  const wt = completionTimes[p.name] !== undefined ? (completionTimes[p.name] - (Number(p.brustTime) ?? 0)) : '?';
                  return (
                    <span key={p.id}>{wt}{i < processes.length - 1 ? ' + ' : ''}</span>
                  );
                })}
                ) / {n}
              </div>
              <div className="mb-1">
                {(() => {
                  const sum = processes.reduce((acc, p) => acc + (completionTimes[p.name] !== undefined ? (completionTimes[p.name] - (Number(p.brustTime) ?? 0)) : 0), 0);
                  return `${sum} / ${n} = `;
                })()}
                <span className="text-blue-700 dark:text-blue-300 font-bold">{avgWaitingTime}</span>
              </div>
            </div>
            {/* Turnaround Time Breakdown and Average */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4 min-w-[320px] max-w-[400px] border border-gray-200 dark:border-gray-700 font-mono text-[15px]">
              <div className="font-bold text-lg mb-2 text-purple-700 dark:text-purple-300">Turnaround Time</div>
              <div className="mb-1">Turnaround Time = Burst Time + Waiting Time</div>
              <ul className="mb-2">
                {processes.map((p, i) => {
                  const wt = completionTimes[p.name] !== undefined ? (completionTimes[p.name] - (Number(p.brustTime) ?? 0)) : '?';
                  const bt = Number(p.brustTime) ?? 0;
                  const tt = (typeof wt === 'number' && typeof bt === 'number') ? (bt + wt) : '?';
                  return (
                    <li key={p.id}>
                      {p.name} = {bt} + {wt} = <span className="font-bold">{(typeof wt === 'number' && typeof bt === 'number') ? (bt + wt) : '?'}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="mb-1 font-semibold">AVGTT = SUM(TT) / # OF PROCESS</div>
              <div className="mb-1">(
                {processes.map((p, i) => {
                  const wt = completionTimes[p.name] !== undefined ? (completionTimes[p.name] - (Number(p.brustTime) ?? 0)) : 0;
                  const bt = Number(p.brustTime) ?? 0;
                  const tt = (typeof wt === 'number' && typeof bt === 'number') ? (bt + wt) : 0;
                  return (
                    <span key={p.id}>{tt}{i < processes.length - 1 ? ' + ' : ''}</span>
                  );
                })}
                ) / {n}
              </div>
              <div className="mb-1">
                {(() => {
                  const sum = processes.reduce((acc, p) => {
                    const wt = completionTimes[p.name] !== undefined ? (completionTimes[p.name] - (Number(p.brustTime) ?? 0)) : 0;
                    const bt = Number(p.brustTime) ?? 0;
                    const tt = (typeof wt === 'number' && typeof bt === 'number') ? (bt + wt) : 0;
                    return acc + tt;
                  }, 0);
                  return `${sum} / ${n} = `;
                })()}
                <span className="text-purple-700 dark:text-purple-300 font-bold">{avgTurnaroundTime}</span>
              </div>
            </div>
          </div>}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default Drower