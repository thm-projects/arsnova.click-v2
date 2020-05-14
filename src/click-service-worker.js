try {
  importScripts('./ngsw-worker.js');
} catch {
}

const scope = self;

function messageToClient(client, data) {
  const channel = new MessageChannel();
  client.postMessage(JSON.stringify(data), [channel.port2]);
}

scope.addEventListener('push', async event => {
  if (!event || !event.data) {
    return;
  }

  const data = event.data.json();
  if (!data) {
    return;
  }

  const clientList = await scope.clients.matchAll({type: 'window'});
  if (!clientList || !clientList.length) {
    return;
  }

  clientList.forEach(cl => messageToClient(cl, data));
});
