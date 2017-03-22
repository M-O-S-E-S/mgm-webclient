import * as React from "react";
import { Action } from 'redux';
import { Map } from 'immutable';

import { Region, RegionStatus } from '../../lib/Immutable';

import { Col } from 'react-bootstrap';

interface props {
  status: RegionStatus
}

export class RegionStatView extends React.Component<props, {}> {

  shouldComponentUpdate(nextProps: props) {
    return this.props.status !== nextProps.status;
  }

  secondsToUptime(dt: number): string {
    let days = Math.floor(dt / 86400);
    let hours = Math.floor((dt % 86400) / 3600);
    if(days > 0)
      return days + ' days ' + hours + ' hours';
    let minutes = Math.floor(((dt % 86400) % 3600)/ 60);
    return hours + ' hours ' + minutes + ' minutes';
  }

  render() {
    if (!this.props.status)
      return <span>~ no data ~</span>

    let now = new Date().getTime()/1000;
    if(now - this.props.status.timestamp > 60)
      return <span>~ stale data ~</span>

    //CPU
    //MEM
    //UPTIME
    //let mem = status.memKB / 1073741824;
    let mem = this.props.status.memKB / 1048576;

    return (
      <div>
        <Col md={4}>CPU: {this.props.status.cpuPercent}</Col>
        <Col md={4}>RAM: {this.props.status.memPercent.toFixed(2)}% [{mem.toFixed(2)}GiB]</Col>
        <Col md={4}>UP: {this.secondsToUptime(this.props.status.uptime)}</Col>
      </div>
    )
  }
}
