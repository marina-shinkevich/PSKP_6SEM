const redis = require('redis');


const client = redis.createClient({
    socket: {
        host: 'redis-18719.c84.us-east-1-2.ec2.cloud.redislabs.com', 
        port: 18719 
    },
    username: 'default',           
    password: 'KpX3znhwdmBZayJoGxIVazKckINjNscA'       
});


client.on('ready', () => console.log('Redis Ready'));
client.on('connect', () => console.log('Redis Connect'));
client.on('error', (err) => console.log('Redis Error: ', err));
client.on('end', () => console.log('Redis End'));


async function run() {
    try {
        await client.connect();         
        console.log('Connected to Redis');

        
        await client.set('foo', 'bar');
        const value = await client.get('foo');
        console.log('Value of foo:', value);
        await client.quit();             
    } catch (err) {
        console.log('Error:', err);
    }
}

run();