const redis = require('redis')


const subscriber = redis.createClient({
    socket: {
        host: 'redis-18719.c84.us-east-1-2.ec2.cloud.redislabs.com', 
        port: 18719 
    },
    username: 'default', 
    password: 'KpX3znhwdmBZayJoGxIVazKckINjNscA' 
});

subscriber.on('ready',() => {console.log('Ready publisher');});
subscriber.on('error',(err) => console.log('Error publisher: ',err));
subscriber.on('connect',() => console.log('Connect publisher'))
subscriber.on('end',() => console.log('End publisher'));

(async () => {
    try {
        await subscriber.connect();

        await subscriber.subscribe('my_channel', (message)=>{
            console.log(`Полученное сообщение: ${message}`)
        });

        setTimeout(() => {
            subscriber.unsubscribe();
            subscriber.quit()
        }, 30000)

    } catch (err) {
        console.error('Ошибка:', err);
    } finally {
       
    }
})();