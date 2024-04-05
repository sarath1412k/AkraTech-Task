import React, { useEffect, useState } from 'react';

import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import './App.css';

// import Dexie from 'dexie';
// import { useLiveQuery } from 'dexie-react-hooks';
import axios from 'axios';

// export const db = new Dexie("randomData");
// db.version(2).stores({
//   randomData: 'id,text,completed',
// });


const App:React.FC =() => {
  
  const [loading,setLoading] = useState(false)
  // const randomData = useLiveQuery(() => db.table("randomData").toArray(), []);
  const [data,setData] = useState([])


  useEffect(() => {    
    if(localStorage.getItem("randomData")){
      const result:any = localStorage.getItem("randomData")
      setData(JSON.parse(result))
    }
    else{
      setLoading(true)
      axios.get(`https://randomuser.me/api/?results=50`)
      .then(async(res:any) =>{
        setTimeout(async() => {
          //await db.table("randomData").add({ randomData:res.data.results});
          setData(res.data.results)
          localStorage.setItem('randomData',JSON.stringify(res.data.results))
          setLoading(false)
        },1000)
      })
      .catch((err:any) => {
        console.error(err);setLoading(false)
      })
    }

  },[])

  const handleRefresh = async () => {
    setLoading(true) 
    axios.get(`https://randomuser.me/api/?results=50`)
    .then(async(res:any) =>{
      setTimeout(async() => {
        //await db.table("randomData").add({ randomData:res.data.results});
        setData(res.data.results)
        localStorage.setItem('randomData',JSON.stringify(res.data.results))
        setLoading(false)

      },1000)
    })
    .catch((err:any) => {
    console.error(err);setLoading(false)
    })
}

  const onDelete = (index:any) => {
     let filterData = data.filter((e,i) => 
      i !== index
      )
      setData(filterData)
      localStorage.setItem('randomData',JSON.stringify(filterData))
  }


  return (
    <div className="App">
    <button className='refresh-btn' onClick={handleRefresh}>Refresh</button>
    <span className='item-indicator'>Total number of items: {data.length}</span>
    {loading && <div className='mat-spin'><CircularProgress  /></div>}
    <div className='cards-grid'>
    {data.map((obj,index) => {return(
        <div className='card-mat' key={index}>
        <Card className='card-container' sx={{ minWidth: 155,minHeight:200 }}>
        <img className="profile-pic" src={obj["picture"]["large"]} alt="Profile-img" />
        <div className="profile-name">{`${obj["name"]["first"]} ${obj["name"]["last"]}`}</div>
        <button onClick={() => onDelete(index)} className="delete-btn">Delete</button>
        </Card>
        </div>
    )})
   }
    </div>

    </div>
  );
}

export default App;
