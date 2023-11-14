export class Config {
	static get() {
		if (window.location.hostname.indexOf('localhost') > -1 || window.location.hostname.indexOf('127.') > -1) {
			return lokal;
		} else if (window.location.hostname.indexOf('10.11.1.200') > -1) {
			return publics;
		   
		}else if (window.location.hostname.indexOf('10.10.11.244') > -1) {
			return networkuing;
		} else {
			return lokalDEUI;
		}
	}
	static profile() {
		return {
			namaProfile: "RS POLRI",
			alamat: "",
		}
	}
	static token() { 
		return {
			token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbi5hcG90aWsifQ.3SPSaKTrOnKdr5sVnynYGTe14dKz9QN-z35tSaX_5YwLVHt_ZWyN0tlVuSg1dgeRC5Sg3cVwdbnYYtRgoHO86A",
		}
	}
}

var lokal = {
	apiBackend: "http://localhost:8000/",
	apiNotif: "http://127.0.0.1:8000/",
	socketIO: "http://127.0.0.1:8881",
	page: 0,
	rows: 10
};
var networkuing = {
	apiBackend: "http://10.10.11.244:8000/",
	apiNotif: "http://10.10.11.244:8000/",
	socketIO: "http://10.10.11.244:8881",
	page: 0,
	rows: 10
};
var lokalDEUI = {
	apiBackend: "/",
	apiNotif: "/",
	socketIO: "/",
	page: 0,
	rows: 10
};
var lokaluing = {
	apiBackend: "http://192.168.0.145/",
	apiNotif: "http://127.0.0.1:8000/",
	socketIO: "http://192.168.0.145:8881",
	page: 0,
	rows: 10
};

var publics = {
	apiBackend: "http://10.11.1.200/",
	apiNotif: "http://127.0.0.1:8000/",
	socketIO: "http://10.11.1.200:8881",
	page: 0,
	rows: 10
};
 