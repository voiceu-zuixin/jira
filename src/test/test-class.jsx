import React, { Component } from 'react'

let number_outside = 1

export default class TestClass extends Component {
  constructor() {
    super()
    console.log('constructor', number_outside)
    this.state = {
      param: {
        name: '',
        num: 10
      }
    }
  }

  componentDidMount() {
    this.setState({ param: { num: this.state.param.num + 1 } })
    console.log('didMount', number_outside, this.state.param.num)
  }
  
  onClick = () => {
    this.setState({ param: { name: '22' } })
  }

  componentDidUpdate() {
    console.log('didUpdate', number_outside,this.state.param.num)
  }

  render() {
    number_outside += 1
    console.log('Test', number_outside)

    return <div onClick={this.onClick}>test-class</div>
  }
}
