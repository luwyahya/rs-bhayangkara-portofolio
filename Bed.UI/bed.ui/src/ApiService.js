import Vue from 'vue'
import axios from 'axios'

const client = axios.create({
    baseURL: process.env.BASE_URL,
    json: true
})

export default {
    async execute(method, resource, data) {
        return client({
            method,
            url: resource,
            data
        }).then(req => {
            return req.data
        })
    },
    get(url) {
        return this.execute('get', url)
    },
}