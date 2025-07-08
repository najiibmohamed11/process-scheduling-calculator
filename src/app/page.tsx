"use client"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Data=[
  {
    name:"p1",
    brustTime:20,
    waitingTime:0,
    TurnAroundTime:0
  }
]

interface FCFS{
  id:number,
  name:string,
    brustTime:number|null,
    waitingTime:number|null,
    TurnAroundTime:number|null
}

enum algorithums{
  FCFS="FCFS",
  SJF="SJF",
  priority="priority",
  RR="RR"
}

export default function Home() {
  const [fcfs,setFcfs]=useState<FCFS[]>( [ {
    id:0,
    name:"",
    brustTime:null,
    waitingTime:null,
    TurnAroundTime:null
  }])
  const [currentAlgo,setCurrentAlgo]=useState<algorithums>(algorithums.FCFS)

  const onChangeTheInputValue=(e:ChangeEvent<HTMLInputElement>,id:number)=>{
    if(isNaN(Number(e.target.value))&&e.target.name!="name"){
      return;
    }
    console.log(typeof e.target.value)
    setFcfs((prev)=>prev.map((process)=>process.id==id?{...process,[e.target.name]:e.target.value}:process))
    console.log(fcfs)
  }
  const addNewRow=()=>{
    setFcfs(pref=>[...pref,{id:fcfs[fcfs.length-1].id+1,name:"",brustTime:null,TurnAroundTime:null,waitingTime:null}])
  }



  const handleMenuChange=(algo:algorithums)=>{
    setCurrentAlgo(algo)
  }

  const removerow=(id:number)=>{
    setFcfs((prev)=>prev.filter((process)=>process.id!=id))
  }


  const calculate=()=>{
    if(currentAlgo===algorithums.FCFS){
      // w=bt[i-1]+wt[i-1]
      let fcfsUpdatedData:FCFS[]=[...fcfs];
      
      for(let i=0; i<fcfs.length; i++){
        //validation
        if(!fcfs[i].name||!fcfs[i].brustTime){
          return
        }
        //check if the process is first process
        if(i==0){
          const waitingTime= 0;
          fcfsUpdatedData[i].waitingTime=0;
          fcfsUpdatedData[i].TurnAroundTime=Number(fcfs[i].brustTime);
        }else{
            const waitingTime= Number(fcfs[i-1].brustTime??0) + (fcfs[i-1].waitingTime??0);
          const turnaroundTime= Number(fcfs[i].brustTime??0)+waitingTime
          fcfsUpdatedData[i].waitingTime=waitingTime;
          fcfsUpdatedData[i].TurnAroundTime=turnaroundTime;

        }
        console.log(fcfs)

        //calculate waiting time 
      
      }

      setFcfs(fcfsUpdatedData)

    }else{
      console.log('just chilling')
    }

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
      </div>
   

      <Table>
        <TableCaption >process  scheduling</TableCaption>
        <TableHeader>
          <TableRow>

          <TableHead>Proceeess</TableHead>
          <TableHead>Brust tIME</TableHead>
          <TableHead>Waiting Time</TableHead>
          <TableHead>Turnarount Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            fcfs.map((process)=>{
              return(
                <TableRow key={process.id}>
                  <TableCell>
                    <Input 
                    name="name"
                    onChange={(e)=>onChangeTheInputValue(e,process.id)}
                    value={process.name}  
                      />
                   </TableCell>
                  <TableCell>
                 <Input 
                  name="brustTime"
                  onChange={(e)=>onChangeTheInputValue(e,process.id)}
                  value={process.brustTime??""}  />
                       </TableCell>
                  <TableCell>
                      <Input
                           readOnly={true}

                          name="waitingTime"
                        value={process.waitingTime??""} 
                          />
                   </TableCell>
                  <TableCell>
                 <Input 
                     readOnly={true}


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
          <Button variant="outline" className="mt-4 cursor-pointer" onClick={addNewRow}>+</Button>
        </TableBody>
      </Table>
      <Button className="mt-4" onClick={calculate}>Calclulate</Button>
   </div>
  );
}
