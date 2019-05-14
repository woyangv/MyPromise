const PADDING = Symbol('PADDING')
const FULFILLED = Symbol('FULFILLED')
const REJECTED = Symbol('REJECTED')

function noop() {
}

class MyPromise {
    constructor(executer) {
        this._state = PADDING
        this.onResolve
        this.onReject
        this._nextPromise
        this._value

        executer(this.resolve.bind(this), this.reject.bind(this))
    }

    resolve(value) {
        setTimeout(() => {
            if (!this._nextPromise) return
            if (this._state === PADDING) {
                this._state = FULFILLED
                this._value = this.onResolve(value)

                if (this._value instanceof MyPromise) {
                    // console.log('rp1', this._value) // rp1
                    // console.log('p', this)  //p
                    // console.log('p1',this._nextPromise)
                    // console.log('p2', this._nextPromise._nextPromise)
                    this._value.onResolve = this._nextPromise.onResolve
                    this._value.onReject = this._nextPromise.onReject
                    this._value._nextPromise = this._nextPromise._nextPromise

                } else {
                    this._nextPromise.resolve(this._value)
                }
            }
        })

    }

    reject(err) {
        setTimeout(() => {
            if (this._state === PADDING) {
                this._state = REJECTED
                this.onReject(err)
            }
        })

    }

    then(onResolve, onReject) {
        this.onResolve = onResolve ? onResolve : noop
        this.onReject = onReject ? onReject : noop

        this._nextPromise = new MyPromise(noop)
        return this._nextPromise
    }
}

module.exports = MyPromise
