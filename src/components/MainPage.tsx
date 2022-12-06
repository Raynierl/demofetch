import React from 'react';
import {useEffect, useState} from 'react';
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
} from "@material-tailwind/react";
type User = any;
const Capitalize = (str:string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
  }
const getData = async (): Promise<[]> => {
  const data = await fetch(process.env.REACT_APP_API_STRING as string).then((data)=> {
    return data.json();
  }).catch((e)=> {console.error(e); return [];});

  console.log(data);
  return data;
}

const parseTableData = (user:User,tableKey:any) : JSX.Element => {
  console.log(tableKey);
  let tableData;
  if(tableKey == 'address' || tableKey == 'company'){
    tableData = tableKey
  }
  else if( tableKey === 'website') {
    tableData = showPopOver(user[tableKey as keyof typeof user]);
  }
  else {
    tableData = user[tableKey as keyof typeof user];
  }
  return (
  <td key={`${user.id + ' '+ tableKey}-cell`} className="text-center border-2 border-gray-300">
   <p>{tableData}</p>
    </td>
  )
}

const showPopOver = (website:string) => {
  console.log(`>>> ${website}`);
  // debugger;
  return(
  <Popover>
      <PopoverHandler>
        {/* <Button variant="gradient">{website}</Button> */}
        <span className='bg-gradient-to-tl from-indigo-200 via-cyan-600 to-blue-700 w-full h-full'>{website}</span>
      </PopoverHandler>
      <PopoverContent>
        <div className="w-64 h-64 p-1 bg-gray-500">
        <iframe src={'http://'+website} title="Table Website" className='w-full h-full'/>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default function MainPage() {
  let tableHeaders:string[] = [];

    const [users,setUsers] = useState([]);
    const [header,setHeaders]: [any[],any] = useState([]);
    useEffect(()=>{
        console.log("USEEFFECT with [] called")
      getData().then( (data: any[]) => {
        // data.forEach(e=> {console.log(e)})
        if(!header.length){
        Object.keys(data[0]).forEach( key => {
          console.log(key)
          header.push(key);
        })
        }
        setUsers(data as any);
      }).catch(e => {console.log(e);})
    },[])

    useEffect(()=>{ console.log('USE EFFECT WITHOUT deps called')});

    const UserTable = () => (
      <table className='table-auto border-separate bg-slate-50 w-full'>
      <thead>
        <tr>
          {header.map((each, i) => (<th key={i}>{Capitalize(each)}</th>))}
        </tr>
      </thead>
      <tbody>
      {

      users.map((user:User) =>(
      <tr key={user.id}>
        {Object.keys(user).map((key)=> (parseTableData(user,key)))}
        </tr>))
      }
      </tbody>
    </table>
    ) 
    useEffect(()=> () => {console.log('USEEFFECT COMPONENTDIDUNMOUNT CALLED --')})
    return (
    <div className='bg-[#323133] h-full w-full'>
      <UserTable />
    </div>
  );
}

// export default MainPage;
