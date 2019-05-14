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
            setTimeout(function () {
                resolve(201)
            }, 3000)
        })
            .then(function (value) {  //rp1
                console.log('in', value)
                return 'xxx'
            })
    })
    .then(function (value) {  //p2
        console.log('a', value)

    })



