import { v4 as uuidv4 } from 'uuid';

export class Url {
  constructor(
    public urlId: string = uuidv4(),
    public path: string,
    public key: string
  ) {}
}

