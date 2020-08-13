/**
 * const p = new Promise((res, rej) => {
 * 
 * });
 * p.then().catch().finally
 * 
 * Promise 构造函数，入参 function
 * 返回一个 Promise 对象
 * 原型方法
 * then
 * catch
 * finally
 * 能链式调用
 * 静态方法
 * resolve
 * reject
 */

 // Promise 状态机
enum STATE {
    PENDING = 'pending',
    REJECTED = 'rejected',
    FULFILLED = 'fulfilled'
};


class PromiseMoc {
    // pending rejected fulfilled
    private state: string;
    private val: any;
    private thenCb: Function;
    private catchCb: Function;
    private finallyCb: Function;
    private thenPromise;

    static resolve(val) {
        let p = new PromiseMoc((res, rej) => {
            if (val instanceof PromiseMoc) {
                val.then(newVal => {
                    res(newVal)
                });
                val.catch(err => {
                    rej(err)
                })
            } else {
                res(val)
            }
        });
        return p;
    }

    static reject(val) {
        let p = new PromiseMoc((res, rej) => {
            rej(val);
        });
        return p;
    }

    private resolve(val) {
        const resolveImp = (value) => {
            if (value instanceof PromiseMoc) {
                val.then(value => {
                    resolveImp(value);
                });
                val.catch(err => {
                    this.val = null;
                    this.reject(err);
                })
            } else {
                this.val = value;
                this.state = STATE.FULFILLED;
            }
        }
        resolveImp(val);
    }

    private reject(err) {
        this.state = STATE.REJECTED;
        this.val = err;
    }


    private checkTimer = () => {
        const checker = (res, rej) => {
            const cb = null;
            setTimeout(() => {
                if (this.state === STATE.FULFILLED) {
                    let result = this.val;
                    if (this.thenCb) {
                        result = this.thenCb(this.val);
                    }else if (this.finallyCb) {
                        result = this.finallyCb();
                    }
                    res(result);
                } else if (this.state === STATE.REJECTED) {
                    let result = this.val;
                    if (this.catchCb) {
                        result = this.catchCb(this.val);
                        res(result);
                    }else if (this.finallyCb) {
                        result = this.finallyCb();
                    }
                    rej(result);
                }else {
                    checker(res, rej);
                }
            }, 0)
        }

        if (!this.thenPromise) {
            this.thenPromise = new PromiseMoc(checker);
        }
        return this.thenPromise;
    }

    then(cb) {
        this.thenCb = cb;
        return this.checkTimer();
    }

    catch(cb) {
        this.catchCb = cb;
        return this.checkTimer();
    }

    finally(cb) {
        this.finallyCb = cb;
        return this.checkTimer();
    }

    constructor(cb) {
        this.state = STATE.PENDING;
        cb(this.resolve.bind(this), this.reject.bind(this));
    }
}

export default PromiseMoc;