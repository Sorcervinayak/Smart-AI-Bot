import React, { createContext, useState } from 'react';

// Create the context
export const DataContext = createContext();

export let user = {
  data:null,
  mime_type:null,
  imgUrl:null
}

export let prevUser = {
  data:null,
  mime_type:null,
  prompt:null,
  imgUrl:null
}

function UserContext({ children }) {
  let [startRes,setStartRes] = useState(false); //usestate which passing as a props in Home.jsx in the form of context
  let [popup,setPopUp] = useState(false)
  let [input, setInput] = useState(""); // ✅ Fixed: Added missing state
  let [feature,setFeature] = useState("chat")
  let [prevInput,setPrevInput] = useState("")
  
  let value = {
    startRes,setStartRes,
    popup,setPopUp,
    feature,setFeature,
    input,setInput,
    prevInput,setPrevInput
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export default UserContext;
