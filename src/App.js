import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Input, Card, Spin } from 'antd'
import 'antd/dist/antd.css';
import './App.css';

const { Meta } = Card;

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch()
  }, [])

  const fetch = async (key = '') => {
    setLoading(true)
    await axios.get(`/services/feeds/photos_public.gne?tags=${key}&format=json&nojsoncallback=true`)
      .then((response) => {
        setData(response.data.items);
      })
      .catch((err) => {
        console.log(err)
      })
    setLoading(false)
  }

  const handleSearch = debounce(fetch, 300);

  const getAuthor = (item) => {
    return item.split('"')[1];
  }

  const handleClick = (link) => {
    window.location.assign(link);
  }

  return (
    <div className="App" style={{ width: 1100, margin: '20px auto' }}>
      <Input
        style={{ width: 200, margin: '20px 0' }}
        onChange={e => {
          e.persist();
          handleSearch(e.target.value);
        }}
        placeholder="Search ..."
      />
      <Spin spinning={loading}>
        <div style={{
          columnCount: 4,
          columnGap: 20,
          lineHeight: 0
        }}>
          {data.map((el,index) => {
            return <Card
              style={{
                marginBottom: 20, width: '100%', height: 'auto !important',
                pageBreakInside: 'avoid'
              }}
              key={index}
              hoverable
              cover={
                <img alt="example"
                     style={{ width: '100%' }}
                     src={el.media.m}
                     onClick={()=>{handleClick(el.link)}}
                />}
            >
              <Meta title={getAuthor(el.author)} description={el.tags} />
            </Card>
          })}
        </div>
      </Spin>
    </div >
  );
}
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this,
      args = arguments;
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    }, wait);
    if (callNow) func.apply(context, args);
  };
}


export default App;
