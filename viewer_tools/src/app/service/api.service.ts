import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap, finalize } from 'rxjs/operators';
 
import { Config } from '../config';
// import * as CryptoJS from 'crypto-js';  
@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private totalRequests = 0;
	baseApi = 'service/medifirst2000/'
	listSucces = [200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210]
	listError = [500, 401, 404, 400]
	constructor(private http: HttpClient ) { }

	get(url: string): Observable<any> { 
		url = Config.get().apiBackend + this.baseApi + url
		let token = Config.token().token;
		const header= new HttpHeaders({
		'X-AUTH-TOKEN': token,
		'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, DELETE',
		'Access-Control-Allow-Origin': '*'
		})
		return this.http.get<any>(url,{headers:header});
			 
	}

	 

}
