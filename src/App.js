import { useState, useEffect } from 'react';
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BsSearch, BsPersonSquare } from "react-icons/bs";


function App() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');
  const [load, setLoad] = useState(100);

  useEffect(() => {
    const getContacts = async () => {
        const response = await fetchContacts()
        setContacts(response)
    }
    getContacts()
  }, [])

  useEffect(() => {
    console.log(`IDs of selected contacts: `)
    contacts.map(c => c.isChecked === true && console.log(c.id))
  }, [contacts])

  const fetchContacts = async () => { 
    const response = await fetch(`https://teacode-recruitment-challenge.s3.eu-central-1.amazonaws.com/users.json`, {
        method: 'GET'
    })
    const contactsData = await response.json()
    return contactsData.map((contact) => ({...contact, isChecked: false}))
  }

  const setIsChecked = (id) => {
    setContacts(contacts.map((contact) => (contact.id === id ? {...contact, isChecked: !contact.isChecked} : contact)))
  }

  const returnFullName =(x) => {
    return `${x.first_name} ${x.last_name}`
  }

  return (
    <div className="App">
      <div className="AppContainer">

      <h1 style={{color: '#FA5530'}}>CONTACTS</h1>

      <div className="input-group mb-3">
        <span className="input-group-text"><BsSearch/></span>
        <input type="text" className="form-control" placeholder="Filter contacts" onChange={(e) => setFilter(e.target.value)}/>
      </div>

      <ul className="list-group mb-3">
        {contacts.filter(contact => returnFullName(contact).toLowerCase().includes(filter.toLowerCase())).sort((a, b) => a.last_name >  b.last_name ? 1 : -1).slice(0,load).map((contact) => ( 
          
          <li className="list-group-item" key={contact.id} style={{cursor: 'pointer', height: '60px'}} onClick = {() => setIsChecked(contact.id)}>  
            <span style={{minWidth: '50px'}}>{contact.avatar !== null ? <img alt="" src={contact.avatar}/> : <BsPersonSquare style={{fontSize: '40px', color: '#7A473C'}}/>}</span>
            <span style={{minWidth: '200px'}}>{contact.first_name} {contact.last_name}</span>
            <span style={{minWidth: '30px'}}><input style={{ cursor: 'pointer'}} type="checkbox" className="form-check-input" checked={contact.isChecked} readOnly/></span>
          </li>

        ))}
      </ul>

      {load < 1000 ? <button type="button" className="btn mb-3" style={{background: '#FA5530', color: '#7A2917'}} onClick={() => setLoad(load+100)}>Load more</button> : ''}

      </div>
    </div>
  );
}

export default App;
