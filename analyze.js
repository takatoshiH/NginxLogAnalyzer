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

        page = page.replace(/\?[^ ]* /, ' ');

        const m = pages.find(x => x.page === page);
        if (m) {
            m.count += 1;
        } else {
            pages.push({page, count: 1});
        }
    }

    pages = removeApiAndResourceAccess(pages);
    return pages;
}

function removeApiAndResourceAccess(result) {
    result.forEach(page => {
        if(page.page.includes('/api/')
            || page.page.includes('/img/')
            || page.page.includes('/image')
            || page.page.includes('/js/')
            || page.page.includes('/css/')
            || page.page.includes('.json')
            || page.page.includes('.png')) {
            page.count = 0;
        }
    });

    return result;
}

function countUPTotalPageView(result) {
    let totalPageView = 0;
    result.forEach(page => {
        if(page.count != 0) totalPageView += page.count;
    });

    return totalPageView;
}
