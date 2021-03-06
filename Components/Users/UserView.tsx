import * as React from "react";
import shallowequal = require('shallowequal');
import { Action } from 'redux';

import { User } from '../../lib/Immutable';

import { Row, Col, Button } from 'react-bootstrap'

import { BusyButton } from '../BusyButton';

interface props {
    user: User,
    manage: () => void,
    groups: () => void,
    isAdmin: boolean
}

interface state {
    showManage?: boolean
    showGroups?: boolean
}

export class UserView extends React.Component<props, state> {

    constructor(props: props) {
        super(props);
        this.state = {
            showManage: false,
            showGroups: false
        }
    }

    shouldComponentUpdate(nextProps: props) {
        return !shallowequal(this.props, nextProps);
    }

    render() {
        let userType = '';
        switch (this.props.user.godLevel) {
            case 0:
                userType = 'suspended';
                break;
            case 1:
                userType = 'temporary';
                break;
            case 2:
                userType = 'resident';
                break;
            case 50:
                userType = 'Group Owner';
                break;
            case 200:
                userType = 'Grid God';
                break;
            case 250:
                userType = 'Administrator';
                break;
        }
        return (
            <Row>
                <Col md={3}>{this.props.user.name()}</Col>
                <Col md={3}>{this.props.user.email}</Col>
                <Col md={2}>{userType}</Col>

                {this.props.isAdmin ?
                    <Col md={4}>
                        <Button bsSize="small" onClick={this.props.manage}>Manage</Button>
                        <Button bsSize="small" onClick={this.props.groups}>Groups</Button>
                    </Col> :
                    <span />
                }

            </Row>
        )
    }
}