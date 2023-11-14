define([], function() {
    'use strict';
		return {
			rabbitMQHost : 'amqp://rsab:rsab@127.0.0.1',
			mode : 'http',
			mssql:{
				user: 'sa',
				password: 'j4s4medik4',
				//server: '172.16.0.92', 
				server: '103.93.160.56',
				port:1435,
				database: 'HR3000Negara' 
			},
			pgsql:{
				user: 'postgres',
				password: '@dbrssumed4ng@',
				//server: '172.16.0.92', 
				server: '192.168.0.8',
				port:5432,
				database: 'db_sumedang_live' 
			}
		};
 
});
