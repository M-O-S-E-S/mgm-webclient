import * as React from "react";
import { Store } from 'redux'
import { Estate, Region } from '../../lib/Immutable';
import shallowequal = require('shallowequal');
import Promise = require('bluebird');

import { BusyButton } from '../BusyButton';

import { ClientStack } from '../../lib/ClientStack';

import { Grid, Row, Col, Button } from 'react-bootstrap';
import { RegionStatView } from './RegionStatView';
import { Control } from './Control';

interface regionProps {
  region: Region,
  onManage: () => void,
  onContent: () => void,
  onLog: () => void,
  isAdmin: boolean
}

export class RegionView extends React.Component<regionProps, {}> {

  shouldComponentUpdate(nextProps: regionProps) {
    return !shallowequal(this.props, nextProps);
  }

  handleStart(): Promise<void> {
    if (!this.props.region.node || this.props.region.node == '') {
      alertify.error(this.props.region.name + " is not assigned to a host");
      return Promise.resolve();
    }
    if (this.props.region.isRunning()) {
      alertify.error(this.props.region.name + " is already running");
      return Promise.resolve();
    }
    return ClientStack.Region.Start(this.props.region).then(() => {
      alertify.success(this.props.region.name + ' signalled START');
    }).then(() => {
      // extra delay to keep users from spamming start Button
      // a started process takes many seconds to filter through the system
      return Promise.delay(20 * 1000);
    }).catch((err: Error) => {
      alertify.error('Could not start ' + this.props.region.name + ': ' + err.message);
    })
  }

  handleStop(): Promise<void> {
    if (!this.props.region.isRunning()) {
      alertify.error('Cannot stop a region that is not running');
      return Promise.resolve();
    }
    return ClientStack.Region.Stop(this.props.region).then(() => {
      alertify.success(this.props.region.name + ' signalled STOP');
    }).catch((err: Error) => {
      alertify.error('Could not stop ' + this.props.region.name + ': ' + err.message);
    });
  }

  handleKill(): Promise<void> {
    if (!this.props.region.isRunning()) {
      alertify.error('Cannot kill a region that is not running');
      return Promise.resolve();
    }
    return ClientStack.Region.Kill(this.props.region).then(() => {
      alertify.success(this.props.region.name + ' signalled KILL');
    }).catch((err: Error) => {
      alertify.error('Could not kill ' + this.props.region.name + ': ' + err.message);
    })
  }

  render() {
    let statView = <span>~ not running ~</span>;
    if (this.props.region.isRunning()) {
      statView = <RegionStatView status={this.props.region.status} />;
    }

    return (
      <Row>
        <Col xs={6} sm={6} md={6} lg={2}>
          <Row>
            <Col xs={1}>
              {this.props.isAdmin ?
                <Button bsSize="xsmall" disabled={this.props.region.isRunning()} onClick={this.props.onManage}>
                  <i className="fa fa-cog" aria-hidden="true" ></i>
                </Button> :
                <span />
              }
            </Col>
            <Col xs={8}>{this.props.region.name}</Col>
            <Col xs={1}>
              <Button bsSize="xsmall" onClick={this.props.onLog}>
                <i className="fa fa-file-text-o" aria-hidden="true" ></i>
              </Button>
            </Col>
          </Row>
        </Col>
        <Col xs={6} sm={6} md={6} lg={2}>
          <Control
            isRunning={this.props.region.isRunning()}
            hasHost={this.props.region.node !== ''}
            start={this.handleStart.bind(this)}
            stop={this.handleStop.bind(this)}
            content={this.props.onContent}
            kill={this.handleKill.bind(this)} />
        </Col>
        <Col xs={12} md={8} lg={8}>{statView}</Col>
      </Row>
    )
  }
}