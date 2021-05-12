const logfile = process.argv[2];
const fs = require("fs");
const arr = fs.readFileSync(logfile).toString().trim().split("\n");
const regex = /^(.+) - (.+) \[(.+)\] "([^\"]+)" (\d+) (\d+) "([^\"]+)" "([^\"]+)"$/;

// 解析
let result = analyze(arr);

console.log(result);

/**  それぞれのIPに対するアクセス数を表示　*/
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

        const m = pages.find(x => x.ip === ip);
        if (m) {
            m.count += 1;
        } else {
            pages.push({ip, count: 1});
        }
    }

    return pages;
}
