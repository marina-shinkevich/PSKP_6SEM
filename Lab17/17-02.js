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

     
        let startTime = Date.now();

        const setPromises = [];
        for (let i = 0; i < 10000; i++) {
            setPromises.push(client.set(String(i), `set${i}`));
        }

  
        await Promise.all(setPromises);

        let endTime = Date.now();
        console.log(`Set: ${endTime - startTime}ms`);

        startTime = Date.now();

        const getPromises = [];
        for (let i = 0; i < 10000; i++) {
            getPromises.push(client.get(String(i)));
        }

        const values = await Promise.all(getPromises);
    
        endTime = Date.now();
        console.log(`Get: ${endTime - startTime}ms`);


        startTime = Date.now();

        const delPromises = [];
        for (let i = 0; i < 10000; i++) {
            delPromises.push(client.del(String(i)));
        }

        await Promise.all(delPromises);

        endTime = Date.now();
        console.log(`Del: ${endTime - startTime}ms`);

    } catch (err) {
        console.error('Ошибка:', err);
    } finally {
     
        await client.quit();
    }
})();