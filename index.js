let MyPromise = require('./MyPromise')

function exe(resolve, reject) {
    setTimeout(function () {
        resolve('200')
    }, 2000)

}

let p = new MyPromise(exe)
p  //p
    .then(function (value) {  //p1
        console.log(value)
        return new MyPromise(function (resolve, reject) {  //rp
            resolve(201)
        })
            .then(function (value) {  //rp1
                console.log('in', value)
                return 'xxx'
            })
    })
    .then(function (value) {  //p2
        console.log('a', value)
        return new MyPromise(function (resolve, reject) {
            setTimeout(function () {
                resolve(202)
            }, 1000)
        }).then(function (value) {
            console.log('qqq',value)
        })
    })
    .then(function (value) {
        console.log(value)
    })



