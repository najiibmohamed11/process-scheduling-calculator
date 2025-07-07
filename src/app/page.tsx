"use client"

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import {  DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";


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
    brustTime:number|string,
    waitingTime:number|string,
    TurnAroundTime:number|string
}

export default function Home() {
  const [fcfs,setFcfs]=useState<FCFS[]>( [ {
    id:0,
    name:"",
    brustTime:"",
    waitingTime:"",
    TurnAroundTime:""
  }])

  const onChangeTheInputValue=(e:ChangeEvent<HTMLInputElement>,id:number)=>{
    if(isNaN(Number(e.target.value))&&e.target.name!="name"){
      return;
    }
    setFcfs((pref)=>pref.map((process)=>process.id==id?{...process,[e.target.name]:e.target.value}:process))
  }
  const addNewRow=()=>{
    setFcfs(pref=>[...pref,({id:fcfs.length,name:"",brustTime:"",TurnAroundTime:"",waitingTime:""})])
  }

  const calculateFCFS=()=>{
    console.log(fcfs)
  }
  return (
   <div className="flex flex-col justify-center mx-96 h-screen  ">
    {/* <div className="w-10 h-10 bg-red-400">

    </div>
    <h1>hellow world</h1> */}
    <DropdownMenuLabel>hi whats up</DropdownMenuLabel>
    {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
                  <DropdownMenuContent className="w-56" align="start">
                  </DropdownMenuContent>

        </DropdownMenuTrigger>

    </DropdownMenu> */}

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
                  value={process.brustTime} 
                   />
                       </TableCell>
                  <TableCell>
                      <Input
                           readOnly={true}

                          name="waitingTime"
                  onChange={(e)=>onChangeTheInputValue(e,process.id)}
                        value={process.waitingTime} 
                          />
                   </TableCell>
                  <TableCell>
                 <Input 
                     readOnly={true}


                    name="TurnAroundTime"
                  onChange={(e)=>onChangeTheInputValue(e,process.id)}
                  value={process.TurnAroundTime} 
                   />
                       </TableCell>
                </TableRow>
              )
            })
          }
          <Button variant="outline" className="mt-4" onClick={addNewRow}>+</Button>
        </TableBody>
      </Table>
      <Button className="mt-4" onClick={calculateFCFS}>Calclulate</Button>
   </div>
  );
}
