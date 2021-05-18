const logfile = process.argv[2];
const fs = require("fs");
const arr = fs.readFileSync(logfile).toString().trim().split("\n");
const regex = /^(.+) - (.+) \[(.+)\] "([^\"]+)" (\d+) (\d+) "([^\"]+)" "([^\"]+)"$/;

// 解析
let result = analyze(arr);

let totalPageView = countUPTotalPageView(result);
console.log('全体のPVは' + totalPageView + '回');

/**  それぞれのURLに対するPVを取得　*/
function analyze(arr) {
    let pages = [];
    for (let len = arr.length, i = 0; i < len; i++) {
        const line = arr[i].trim();
        let [
            src, // 元々の入力データ
            ip, // リモートIPアドレス
            user, // リモートユーザ
            time, // 日時
            page, // HTTPメソッドとアクセスされたパス
            code, // ステータスコード
            size, // データサイズ
            referer, // Referer
            ua, // User-Agent
        ] = line.match(regex);

        page = removeQueryParameters(page);

        const m = pages.find(x => x.page === page);
        if (m) {
            m.count += 1;
        } else {
            pages.push({page, count: 1});
        }
    }
    return removeApiAndResourceAccess(pages);
}

function removeApiAndResourceAccess(result) {
    const wantToExcludeStrings = ['/api/', '/img/', '/image', '/js/', '/css/','.json', '.png'];
    result.forEach(page => {
        wantToExcludeStrings.forEach(string => {
            if(page.page.includes(string)) page.count = 0;
        });
    });

    return result;
}

function countUPTotalPageView(result) {
    let totalPageView = 0;
    result.forEach(page => {
        if(!page.count) totalPageView += page.count;
    });
    return totalPageView;
}

function removeQueryParameters(url) {
    return url.replace(/\?[^ ]* /, ' ');
}
