"use client"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import Drower from "./components/drower";
import { algorithums, proccess } from "../../types/types";

const Data=[
  {
    name:"p1",
    brustTime:20,
    waitingTime:0,
    TurnAroundTime:0
  }
]




export default function Home() {
  const [processes,setProcesses]=useState<proccess[]>( [ {
    id:0,
    name:"",
    brustTime:null,
    waitingTime:null,
    TurnAroundTime:null,
    

  }])
  const [currentAlgo,setCurrentAlgo]=useState<algorithums>(algorithums.FCFS)
  const [quantum,setQuantum]=useState<number>()
  const [showCalculation,seShowCalculation]=useState(false)

  const onChangeTheInputValue=(e:ChangeEvent<HTMLInputElement>,id:number)=>{
    if(isNaN(Number(e.target.value))&&e.target.name!="name"){
      return;
    }
    console.log(typeof e.target.value)
    setProcesses((prev)=>prev.map((process)=>process.id==id?{...process,[e.target.name]:e.target.value}:process))
  }
  const addNewRow=()=>{
    if(!processes[processes.length-1].name||!processes[processes.length-1].brustTime){
      return;
    }
    setProcesses(pref=>[...pref,{id:processes[processes.length-1].id+1,name:"",brustTime:null,TurnAroundTime:null,waitingTime:null}])
    seShowCalculation(false)
  }



  const handleMenuChange=(algo:algorithums)=>{
    setCurrentAlgo(algo)
    seShowCalculation(false)
  }

  const removerow=(id:number)=>{
    if(processes.length==1){
      return
    }
    setProcesses((prev)=>prev.filter((process)=>process.id!=id))
  }


  const calculate=()=>{
    if(currentAlgo===algorithums.FCFS){
      // w=bt[i-1]+wt[i-1]
      let fcfs:proccess[]=[...processes];//shallow copy of process
      
      
      for(let i=0; i<fcfs.length; i++){
        //validation

        if(!fcfs[i].name||!fcfs[i].brustTime){
          return
        }
        //check if the process is first process cause first process doesent wait anything
        if(i==0){
          fcfs[i].waitingTime=0;
          fcfs[i].TurnAroundTime=Number(fcfs[i].brustTime);
        }else{
          //calculating waiting time and turnaround time
          const waitingTime= Number(fcfs[i-1].brustTime??0) + (fcfs[i-1].waitingTime??0);
          const turnaroundTime= Number(fcfs[i].brustTime??0)+waitingTime
          fcfs[i].waitingTime=waitingTime;
          fcfs[i].TurnAroundTime=turnaroundTime;

        }

      
      }

      setProcesses(fcfs)
      seShowCalculation(true)

    }else if(currentAlgo===algorithums.SJF){
      let sjf=[...processes]
     
      sjf.sort((a,b)=>(a.brustTime??0)-(b.brustTime??0))


      for(let i =0; i<sjf.length;i++){
        console.log(sjf[i])

        if(!sjf[i].name||!sjf[i].brustTime){
          return;
        }
        
        if(i==0){
          sjf[i].waitingTime=0
           sjf[i].TurnAroundTime=Number(sjf[i].brustTime)

        }else{
          const waitingTime= Number(sjf[i-1].brustTime??0) + (sjf[i-1].waitingTime??0);
          const turnaroundTime= Number(sjf[i].brustTime??0)+waitingTime
          sjf[i].waitingTime=waitingTime;
          sjf[i].TurnAroundTime=turnaroundTime;
        }

      }
      setProcesses(sjf)
      seShowCalculation(true)


    }else if(currentAlgo===algorithums.priority){
      let  priority=[...processes];
      console.log(priority)
      priority.sort((a,b)=>(a.priority??0)-(b.priority??0))
      for(let i =0; i<priority.length;i++){
        console.log('wtf are you there',i,priority[i])

        if(!priority[i].name||!priority[i].brustTime||!priority[i].priority){
          console.log('index.......',i)
          return;
        }

        if(i==0){
           console.log('0 index one before',priority[i])

          priority[i].waitingTime=0;
          priority[i].TurnAroundTime=Number(priority[i].brustTime)
          console.log('0 index one after',i)
        }else{
          const waitingTime= Number(priority[i-1].brustTime??0) + (priority[i-1].waitingTime??0);
          const turnaroundTime= Number(priority[i].brustTime??0)+waitingTime
          priority[i].waitingTime=waitingTime;
          priority[i].TurnAroundTime=turnaroundTime;
          console.log(i)

        }
      }
      setProcesses(priority);
       seShowCalculation(true)


    }else if(currentAlgo===algorithums.RR){
      if(!quantum){
        return;
      }
      let rr=[...processes];
      let curentQuantom=0;
      let completionTime:{name:string,compilation:number}[]=[];
      let remainingProcess=rr.length;      
      let remainingBrustTime:number[]=rr.map((processes)=>Number(processes.brustTime??0))
           
      while(remainingProcess>0){      
       for(let j=0;j<rr.length;j++){

        if(remainingBrustTime[j]>0){
        
        if(remainingBrustTime[j]>quantum){
          // console.log('resualt',resualt)
          // console.log('quantom',quantom)
          curentQuantom+=quantum
          remainingBrustTime[j]-=quantum;
          //  console.log('remaning brust time after ',remainingBrustTime[i])

        }else{
      
          curentQuantom+= remainingBrustTime[j];
          remainingBrustTime[j]=0
          completionTime.push({name:rr[j].name,compilation:curentQuantom})
          rr[j].waitingTime=curentQuantom-(rr[j].brustTime??0)
          rr[j].TurnAroundTime= Number(rr[j].brustTime??0)+ (rr[j].waitingTime??0)
          // completionTime[j].name="rjnkfjen";
          // completionTime[j].compilation=curentQuantom
          remainingProcess--;
          // console.log('done process',j,'with ',curentQuantom)
        }
      }
  

       setProcesses(rr)
      seShowCalculation(true)



       }
        // calculating round robin

     

      }
    }    
    else{
      console.log('just chilling')
    }
    console.log( calculateAvrageWaitingTime())

  }

  const calculateAvrageWaitingTime=():string=>{
    const totalWaitingTime=processes.reduce((accumulator,currentValue)=>{
      return  accumulator+(currentValue.waitingTime??0)
    },0)
    return (totalWaitingTime/processes.length).toFixed(2)



  }
  const calculateAvrageTurnAroundTime=():string=>{
    const totalWaitingTime=processes.reduce((accumulator,currentValue)=>{
      return  accumulator+(currentValue.TurnAroundTime??0)
    },0)
    return (totalWaitingTime/processes.length).toFixed(2)



  }
  return (
   <div className="flex flex-col justify-center mx-96 h-screen my-6 ">
    {/* <div className="w-10 h-10 bg-red-400">

    </div>
    <h1>hellow world</h1> */}
      <div className="flex gap-4 mb-4">

      <DropdownMenuLabel className="text-gray-500">algorithum</DropdownMenuLabel>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-56 cursor-pointer">{currentAlgo}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem onClick={()=>handleMenuChange(algorithums.FCFS)}>{algorithums.FCFS}</DropdownMenuItem>
        <DropdownMenuItem onClick={()=>handleMenuChange(algorithums.SJF)}>{algorithums.SJF}</DropdownMenuItem>
        <DropdownMenuItem onClick={()=>handleMenuChange(algorithums.priority)}>{algorithums.priority}</DropdownMenuItem>
        <DropdownMenuItem onClick={()=>handleMenuChange(algorithums.RR)}>{algorithums.RR}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
         {currentAlgo==algorithums.RR&&<> <DropdownMenuLabel className="text-gray-500">quantum</DropdownMenuLabel>

          <Input
          onChange={(e)=>setQuantum(Number(e.target.value))}
                className="text-center w-56"
                name="waitingTime"
                          />
                          </>
                          }
      </div>
   

      <Table>
        <TableCaption >process  scheduling</TableCaption>
        <TableHeader>
          <TableRow>

          <TableHead>Proceeess</TableHead>
         {algorithums.priority==currentAlgo&& <TableHead>pritority</TableHead>}
          <TableHead>Brust tIME</TableHead>
          <TableHead>Waiting Time</TableHead>
          <TableHead>Turnarount Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-center">
          {
            processes.map((process)=>{
              return(
                <TableRow key={process.id} >
                  <TableCell>
                    <Input 
                    className="text-center"
                    name="name"
                    onChange={(e)=>onChangeTheInputValue(e,process.id)}
                    value={process.name}  
                      />
                   </TableCell>
               { 
                algorithums.priority==currentAlgo&& <TableCell>
                      <Input
                        className="text-center"
                        onChange={(e)=>onChangeTheInputValue(e,process.id)}
                        name="priority"
                        value={process.priority??""} 
                          />
                   </TableCell>}
                  <TableCell>
                 <Input 
                 className="text-center"
                  name="brustTime"
                  onChange={(e)=>onChangeTheInputValue(e,process.id)}
                  value={process.brustTime??""}  />
                       </TableCell>
                  <TableCell>
                      <Input
                        className="text-center"
                        readOnly={true}
                        name="waitingTime"
                        value={process.waitingTime??""} 
                          />
                   </TableCell>
                  <TableCell>
                 <Input 
                     readOnly={true}

                  className="text-center"
                    name="TurnAroundTime"
                  value={process.TurnAroundTime??""}/>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" className="cursor-pointer" onClick={()=>removerow(process.id)}>-</Button>
                  </TableCell>
                </TableRow>
              )
            })
          }
          <TableRow>
         <TableCell className="flex justify-center items-center">
           <Button variant="outline" className="mt-4 cursor-pointer" onClick={addNewRow}>+</Button>
          </TableCell>
          <TableCell className="text-center">avrage</TableCell>
          <TableCell>
            <Input
                readOnly={true}
                className="text-center bg-gray-600 text-white"
                name="waitingTime"
                  value={calculateAvrageWaitingTime()} 
                          />
          </TableCell>
          <TableCell >
             <Input
                readOnly={true}
                className="text-center bg-gray-600 text-white"
                name="waitingTime"
                  value={calculateAvrageTurnAroundTime()}  />
          </TableCell>
          </TableRow>      
        </TableBody>
      </Table>
      <Button className="mt-4" onClick={calculate}>Calclulate</Button>
     {showCalculation&& <Drower algoritum={currentAlgo} processes={processes} quantum={quantum??0}/>}
   </div>
  );
}
