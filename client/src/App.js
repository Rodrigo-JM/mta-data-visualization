import './App.css';
import axios from 'axios'
import React, { Component } from 'react'
import parse from 'html-react-parser'

class App extends Component {
  constructor() {
    super();
    this.state = {
      status: [],
    }
  }

  async componentDidMount() {
    const { data } = await axios.get('/api/status/subway');
    console.log(data)
    this.setState({
      status: data,
    })
  }

  render() {
    return (
      <div>
        {
          this.state.status.map(stat => (
          <div>
            <h1>{stat.name}</h1>
              <p>{parse(stat.text)}</p>
            
          </div>))
        }
      </div>
    )
  }
}


export default App;
