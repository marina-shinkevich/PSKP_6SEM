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

        const hsetPromises = []; 

        for (let i = 0; i < 10000; i++) {

            hsetPromises.push(client.hSet(
                'key',
                `${i}`,
                JSON.stringify({ id: i, val: `val-${i}` })
            ));
        }

      
        await Promise.all(hsetPromises);

        let endTime = Date.now(); 
        console.log(`Hset: ${endTime - startTime}ms`);

      
        startTime = Date.now(); 

        const hgetPromises = []; 

        for (let i = 0; i < 10000; i++) {
           
            hgetPromises.push(client.hGet('key', `${i}`));
        }

   
        const values = await Promise.all(hgetPromises); 
      

        endTime = Date.now(); 
        console.log(`Hget: ${endTime - startTime}ms`);

    } catch (err) {
       
        console.error('Ошибка:', err);
    } finally {
  
        await client.quit();
    }
})();