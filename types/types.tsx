export interface proccess{
  id:number,
  name:string,
  brustTime:number|null,
  waitingTime:number|null,
  TurnAroundTime:number|null,
  priority?:number|null
}

export enum algorithums{
  FCFS="FCFS",
  SJF="SJF",
  priority="priority",
  RR="RR"
}
