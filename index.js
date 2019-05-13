let MyPromise = require('./MyPromise')

function exe(resolve, reject) {
    let value = Math.trunc(Math.random() * 10)
    setTimeout(function () {
        if (true) {
            resolve('200')
        } else {
            reject('500')
        }
    }, 2000)

}

function exe1(resolve, reject) {
    reject('yes')
}

new MyPromise(exe1).then(function (value) {
    console.log(value)
},function (err) {
    console.log(err)
})



