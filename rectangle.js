class Rectangle {
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }

    // クラス変数
    static className = 'Rectangle';

    // クラスメソッド
    static name () {
        return this.className;
    }

    // ゲッター
    get area() {
        return this.calcArea();
    }

    // メソッド
    calcArea() {
        return this.height * this.width;
    }
}

const square = new Rectangle(10, 10);

console.log(square.area);