
const api = 'y0_AgAAAABukr7nAArhjQAAAADy71owRDIlq5olSkmKtlXfYwQvCqZy-rk';
let url = 'https://api-metrika.yandex.net/stat/v1/data';

const params = {
    'date1': '2020-01-01',
    'id': 95613565,
    'metrics': 'ym:pv:pageviews',
    'dimensions': 'ym:pv:URLPath',
}
url += '?' + (new URLSearchParams(params)).toString();

export function request(page) {
    return fetch(url, {
        headers: {
            "Authorization": "OAuth " + api,
        }
    }).then(r => r.json()).then(d => {
        return ({totalViews: d.totals[0] + 41908,
            currentViews: d.data.filter(p => p.dimensions[0].name === page)[0].metrics[0]})
    });
}