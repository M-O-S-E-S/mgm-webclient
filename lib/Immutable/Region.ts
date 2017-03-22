import { Record } from 'immutable';
import { IRegion } from '../Types';

export interface RegionStatus {
  uptime: number
  cpuPercent: number
  isRunning: boolean
  timestamp: number
  memKB: number
  memPercent: number
}

const RegionClass = Record({
  uuid: '',
  name: '',
  x: 1000,
  y: 1000,
  estateName: '',
  status: null,
  node: '',
  port: 9000
})

export class Region extends RegionClass implements IRegion {
  readonly uuid: string
  readonly name: string
  readonly estateName: string
  readonly x: number
  readonly y: number
  readonly node: string
  readonly port: number
  readonly status: RegionStatus

  set(key: string, value: string | number | RegionStatus): Region {
    return <Region>super.set(key, value);
  }

  isRunning(): boolean {
    return this.status && this.status.isRunning;
  }
}