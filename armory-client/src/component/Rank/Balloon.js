import React, {Component} from 'react';
import {Tooltip} from 'reactstrap';
import classnames from 'classnames';

const balloonMap = {
  'A': '/images/balloons/turquoise.png',
  'B': '/images/balloons/brown.png',
  'C': '/images/balloons/pink.png',
  'D': '/images/balloons/blue.png',
  'E': '/images/balloons/red.png',
  'F': '/images/balloons/orange.png',
  'G': '/images/balloons/yellow.png',
  'H': '/images/balloons/gray.png',
  'I': '/images/balloons/deeppink.png',
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
  };

  render () {
    let {code, strId, className, score} = this.props;

    const isLarge = code.endsWith('2');
    const isSmall = code.endsWith('1');

    if (isLarge || isSmall) {
      code = code.substring(0, 1);
    }

    return (
      <span className={classnames(className)} style={{position: 'relative'}}>
        <img src={balloonMap[code]} style={{width: 40, height: 50}} id={`b-${strId}-${code}`} alt={code} />

        {
          isLarge && (
            <span style={{width: 20, overflow: 'hidden', display: 'inline-block', position: 'absolute', left: -1}}>
              <img src={'/images/balloons/white.png'} style={{width: 40, height: 50}} />
            </span>
          )
        }

        {
          isSmall && (
            <span style={{width: 20, overflow: 'hidden', display: 'inline-block', position: 'absolute', left: 20}}>
              <img src={'/images/balloons/white.png'} style={{width: 40, height: 50, position: 'relative', left: -20}} />
            </span>
          )
        }

        <Tooltip placement="top" isOpen={this.state.tooltipOpen} target={`b-${strId}-${code}`} toggle={this.toggle}>
          {code}{isLarge ? '2' : (isSmall ? '1' : '')}: {score}점
        </Tooltip>
      </span>
    );
  }
}

export default Balloon
