const PADDING = Symbol()
const FULFILLED = Symbol()
const REJECTED = Symbol()

function noop() {
}

class MyPromise {
    constructor(executer) {
        this._state = PADDING
        this.onResolve
        this.onReject
        this._nextPromise
        this._value
        this._executer = executer

        if (this._state === PADDING) {
            this.handle(this)
        }
    }

    handle(self) {
        this._executer(this.resolve.bind(self), this.reject.bind(self))
    }

    resolve(value) {
        setTimeout(() => {
            if (!this._nextPromise) return
            if (this._state === PADDING) {
                this._state = FULFILLED
                this._value = this.onResolve(value)

                if (this._value === undefined) {
                    if (this._nextPromise._nextPromise) {
                        this._nextPromise.onResolve()
                    }
                } else if (this._value instanceof MyPromise) {
                    this._nextPromise._executer = this._value._executer
                    this._nextPromise.handle(this._nextPromise)
                } else {
                    this._nextPromise.onResolve(this._value)
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
        this._nextPromise.onResolve = onResolve ? onResolve : noop
        this._nextPromise.onReject = onReject ? onReject : noop
        return this._nextPromise
    }
}

// module.exports = MyPromise
