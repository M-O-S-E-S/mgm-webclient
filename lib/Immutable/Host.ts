import { Record } from 'immutable';
import { IHost } from '../Types';

const HostClass = Record({
  id: 0,
  address: '',
  port: 0,
  name: '',
  slots: '',
  public_ip: '',
  status: ''
})

export class Host extends HostClass implements IHost {
  id: number
  address: string
  port: number
  name: string
  slots: string
  status: string
  public_ip: string

  set(key: string, value: string | number): Host {
    return <Host>super.set(key, value);
  }
}