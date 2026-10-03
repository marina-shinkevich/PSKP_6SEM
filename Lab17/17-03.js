const redis = require('redis');

const client = redis.createClient({
    socket: {
        host: 'redis-18719.c84.us-east-1-2.ec2.cloud.redislabs.com',
        port: 18719
    },
    username: 'default',
    password: 'KpX3znhwdmBZayJoGxIVazKckINjNscA'
});


client.on('ready', () => console.log('Ready'));
client.on('connect', () => console.log('Connect'));
client.on('error', (err) => console.log('Error: ', err));
client.on('end', () => console.log('End'));

(async () => {
    try {

        await client.connect();

        await client.del('incr');


        let startTime = Date.now();

        const incrPromises = [];
        for (let i = 0; i < 10000; i++) {
        
            incrPromises.push(client.incr('incr'));
        }

        await Promise.all(incrPromises);

        let endTime = Date.now();
        console.log(`Incr: ${endTime - startTime}ms`);
        startTime = Date.now();

        const decrPromises = [];
        for (let i = 0; i < 10000; i++) {
            decrPromises.push(client.decr('incr'));
        }

        await Promise.all(decrPromises);

        endTime = Date.now();
        console.log(`Decr: ${endTime - startTime}ms`);

    } catch (err) {
        console.error('Ошибка:', err);
    } finally {
      
        await client.quit();
    }
})();