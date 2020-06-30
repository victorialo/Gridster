import React from 'react';
import styled from "styled-components";

const BoxStyle = styled.div`
    //height: 1/rows * 100 %;
    //width: 1/rows * 100 %;
    border: 1px solid gray;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    width: ${props => props.size};
    height: ${props => props.size};
    
    &.filled {
      background-color: lightgray;
    }
    &.clear {
      background-color: white;
    }
    &.start {
      background-color: orange;
    }
    &.end {
      background-color: green;
    }
    &.shortest {
      background-color: yellow;
    }
  `

class Box extends React.Component {

  render() {
    return <BoxStyle id={this.props.id} size={this.props.size} className={this.props.status} onClick={this.props.onClick}/>;
  }
}
export default Box;