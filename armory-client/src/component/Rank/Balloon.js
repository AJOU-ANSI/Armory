import React, {Component} from 'react';
import {Tooltip} from 'reactstrap';

const balloonMap = {
  'A': '/images/balloons/purple.png',
  'B': '/images/balloons/blue.png',
  'C': '/images/balloons/lightblue.png',
  'D': '/images/balloons/lime.png',
  'E': '/images/balloons/yellow.png',
  'F': '/images/balloons/orange.png',
  'G': '/images/balloons/red.png',
};

export class Balloon extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltipOpen: false
    };
  }

  toggle = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  render () {
    const {code, strId} = this.props;

    return (
      <span>
        <img src={balloonMap[code]} style={{width: 40, height: 50}} id={`b-${strId}-${code}`} alt={code} />
        <Tooltip placement="top" isOpen={this.state.tooltipOpen} target={`b-${strId}-${code}`} toggle={this.toggle}>
          {code}
        </Tooltip>
      </span>
    );
  }
}

export default Balloon
