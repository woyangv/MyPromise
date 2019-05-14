const asap = require('asap')
const PADDING = Symbol('PADDING')
const FULFILLED = Symbol('FULFILLED')
const REJECTED = Symbol('REJECTED')

function noop() {
}

function collectChild(stepfather, father) {
    stepfather.onResolve = father.onResolve
    stepfather.onReject = father.onReject
    stepfather._nextPromise = father._nextPromise
}

class MyPromise {
    constructor(executer) {
        this._state = PADDING
        this.onResolve = undefined
        this.onReject = undefined
        this._nextPromise = undefined
        this._value = undefined

        executer(this.resolve.bind(this), this.reject.bind(this))
    }

    resolve(value) {
        asap(() => {
            if (!this._nextPromise) return
            if (this._state === PADDING) {
                this._state = FULFILLED
                this._value = this.onResolve(value)

                if (this._value instanceof MyPromise) {
                    // console.log('rp1', this._value) // rp1
                    // console.log('p', this)  //p
                    // console.log('p1',this._nextPromise)
                    // console.log('p2', this._nextPromise._nextPromise)
                    collectChild(this._value, this._nextPromise)
                } else {
                    this._nextPromise.resolve(this._value)
                }
            }
        })

    }

    reject(err) {
        asap(() => {
            if (this._state === PADDING) {
                this._state = REJECTED
                this.onReject(err)
            }
        })

    }

    then(onResolve, onReject) {
        let father = {
            onResolve: onResolve ? onResolve : noop,
            onReject: onReject ? onReject : noop,
            _nextPromise: new MyPromise(noop)
        }
        collectChild(this, father)
        return this._nextPromise
    }
}

module.exports = MyPromise
