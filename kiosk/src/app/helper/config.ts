export class Configuration {
  static get() {
    if (window.location.hostname.indexOf('112.109') > -1) {
      return {
        apiBackend: 'http://112.109.19.170:9000/service/',
        headerToken: 'X-AUTH-TOKEN',
        authLogin: ':9000',
      }
    } else if (window.location.hostname.indexOf('localhost') > -1) {
      return {
        apiBackend: 'http://localhost:8000/service/',
        headerToken: 'X-AUTH-TOKEN',
        authLogin: ':8000',
      }
    } else if (window.location.hostname.indexOf('10.10.20.167') > -1) {
      return {
        apiBackend: 'http://10.10.20.167:9000/service/',
        headerToken: 'X-AUTH-TOKEN',
        authLogin: ':9000',
      }
    } else if (window.location.hostname.indexOf('202.51.105.98') > -1) {
      return {
        apiBackend: 'http://202.51.105.98:9000/service/',
        headerToken: 'X-AUTH-TOKEN',
        authLogin: ':9000',
      }
    } else if (window.location.hostname.indexOf('36.93.6.186') > -1) {
      return {
        apiBackend: 'http://36.93.6.186/service/',
        headerToken: 'X-AUTH-TOKEN',
        authLogin: ':8000',
      }
    } else {
      return {
        apiBackend: 'http://192.168.100.209/service/',
        headerToken: 'X-AUTH-TOKEN',
        authLogin: ':8000',
      }
    }
  }
}
