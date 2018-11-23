export default class Utils {
    static isApp() {
        return !document.URL.startsWith('http') && !document.URL.startsWith('http://localhost:8100');
    }
}