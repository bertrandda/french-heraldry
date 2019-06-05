import axios from 'axios';

export default class Utils {
    static isApp() {
        return !document.URL.startsWith('http') && !document.URL.startsWith('http://localhost:8100');
    }

    static optimizeImageUrl(thumbUrl: string) {
        if (thumbUrl.includes('.svg/')) {
            thumbUrl = thumbUrl.replace(/.svg\/\S*/g, '.svg');
            thumbUrl = thumbUrl.replace(/\/thumb\//g, '/');
        }

        thumbUrl = thumbUrl.replace(/g\/\d*px/g, 'g/80px');
        return thumbUrl;
    }

    static async request(url) {
        if (!this.isApp()) {
            return axios.get(`https://cors-anywhere.herokuapp.com/${url}`, {
                headers: { 'Origin': url }
            });
        }
        
        return axios.get(url);
    }
}