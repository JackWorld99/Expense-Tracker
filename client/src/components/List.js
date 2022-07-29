import React, {useState,useEffect} from 'react'
import 'boxicons'
import DateList from './dateList'
import {default as api} from '../store/apiSlice'

export default function List() {
  const { data, isFetching , isSuccess, isError } = api.useGetLabelsQuery();
  const [deleteTransaction] = api.useDeleteTransactionMutation();
  const [getLists] = api.useGetListsMutation();
  const [tran, setTran] = useState();
  const [click, setClick] = useState(false);
  let Transactions, history;

  const handleClick = (e) => {
    if(!e.target.dataset.id) return 0;
    deleteTransaction({ _id : e.target.dataset.id })
    if(click){
      window.location.reload();
    }
  }

  const handleOnClick = async (e) => {
    if(!e.target.value) return {};
    setClick(true);
    const result = await getLists({data: e.target.value});
    Transactions = result.data.map((v, i) => <Transaction key={i} category={v} handle={handleClick} ></Transaction>);
    setTran(Transactions);
  }

  if(isFetching){
    Transactions = <div>Fetching</div>;
  }else if(isSuccess){
    Transactions = data.map((v, i) => <Transaction key={i} category={v} handle={handleClick} ></Transaction>);
    history = historyHeader(Transactions);
  }else if(isError){
    Transactions = <div>Error</div>
  }

  if(click){
    Transactions = "";
  }

  return (
    <div className="flex flex-col py-6 gap-3">
        {history}
        <DateList onClick={handleOnClick}></DateList>
        {Transactions}
        {tran}
    </div>
  )
}
function Transaction({category, handle}){
    if(!category) return <></>;
    return (
      <div className="item flex justify-center bg-gray-50 py-1 rounded " style={{ borderLeft : `8px solid ${category.color ??  "#e5e5e5"}`}}>
        <span className='block w-full'>{(category.name.length >= 25 ? category.name.substring(0, 25) + "..." : category.name) ?? ''}</span>
        <div className='has-tooltip'>
          <span className='tooltip rounded shadow-lg p-1 px-3 bg-zinc-500 text-white -mt-9'>$ {category.amount}</span>
          <box-icon className='flex' color={category.color ??  "#e5e5e5"} name='dollar-circle'></box-icon>
        </div>
        <button className='px-3' onClick={handle}><box-icon data-id={category._id ?? ''}  color={category.color ??  "#e5e5e5"} name="trash" ></box-icon></button>            
      </div>
    )
}

function historyHeader(data){
  if(data.length == 0 || data == null) return <></>;
  return (
    <h1 className="py-4 font-bold text-xl">History</h1>
  )
}

