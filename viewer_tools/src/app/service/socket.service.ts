import { Injectable } from '@angular/core';
import { Config } from '../config';
// import { io }  from 'socket.io-client';

import * as io from 'socket.io-client';
// import {} from "socket.io-client";
// import { NotifInfo } from './notification.interface';
// class CallBackWrapper {

// 	private iCallBack : (ob : any, res : string) => any = null;

// 	constructor(callBack : (ob : any, res : string) => any = null, private ob : any){
// 		this.iCallBack = callBack;
// 	}	

// 	callBackOn(data){
// 		console.log('data  asli ' + data);
// 		this.iCallBack(this.ob, data);
// 	}
// }

@Injectable()
export class SocketService {

	private socket: any;
	//wrapper : CallBackWrapper[]; 

	private callBack: (data: string) => any = null

	constructor() {
		 
			this.socket = io(Config.get().socketIO,
			{
				transports: ['websocket', 'polling'],
			});
		console.log('socket connect');
	}



	on(stat, callBack: (data: string) => any = null) {
		//this.wrapper[ob] = new CallBackWrapper(callBack, ob);
		this.callBack = callBack;
		this.socket.on(stat, function (data) {
			//console.log('data  asli ' + data);
			callBack(data);
		});
	}

	emit(info, message) {
		this.socket.emit(info, message);
	}

	 


}

