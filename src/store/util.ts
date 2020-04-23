export const sendEventGenerator = (socket: WebSocket, to: string) =>
  (event: string, data?: IKeyValueMap) => socket.send(JSON.stringify({
    event,
    to,
    ...data
  }));

export const combine = (...rest: Function[]) =>
  (store: any) => rest.map(inject => inject(store))
    .reduce((previes, current) => ({ ...previes, ...current }), {});
