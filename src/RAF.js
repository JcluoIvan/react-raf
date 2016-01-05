
/**
 * 參考 JQuery UI (http://robertpenner.com/easing/)
 */
var _easings = {
    linear: p => p,
    easeIn: p => Math.pow(p, 2),
    easeOut: p => 1 - _easings.easeIn(1 - p),
    swing: p => (
        (p < 0.5) ? 
            (_easings.easeIn( p * 2 ) / 2) :
            (1 - _easings.easeIn( p * -2 + 2 ) / 2)
    ),
}

export default function RAF(Component) {
    return class extends Component {
        constructor (props) {
            super(props);
            this._raf = {
                timeout: [],
                lasttime: 0,
            };

            window.requestAnimationFrame = window.requestAnimationFrame || 
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame || 
                window.msRequestAnimationFrame || 
                (callback => {
                    var time = new Date().getTime();
                    var step = Math.max(0, 16 - (time - this._raf.lasttime));
                    this._raf.lasttime = time + step;
                    let timeout = window.setTimeout(() => callback(time + step), step);
                    this._raf.timeout.push(timeout);
                    return timeout;
                });

            window.cancelAnimationFrame = window.cancelAnimationFrame || 
                (id => window.clearTimeout(id));



        }
        componentWillUnmount () {
            this._raf.timeout.forEach(id => window.cancelAnimationFrame(id));
        }

        cancelRAF(id) {
            window.cancelAnimationFrame(id);
        }

        /**
         * [RAF description]
         * @param {Function} callback [description]
         * @param {[type]}   ms       [description]
         * @param {[type]}   easing   [description]
         * @return requestAnimationFrame id 
         */
        RAF (callback, ms, easing) {

            /* 啟始時間 */
            let start = null;

            /* 最後(前一次)執行時間 */
            let last = null;

            /* 總執行時間 */
            let total = null;

            /* 進度 (有傳入 參數 ms 才會用到) */
            let progress = 0;

            var _run = function (timestamp) {
                if (start === null) {
                    start = last = timestamp;
                }

                total = timestamp - start;

                if (ms) {
                    progress = _easings[easing](
                        (total >= ms)? 1 : (total / ms)
                    );
                }

                let result = callback({
                    start,
                    last,
                    total,
                    progress,
                    stamp: timestamp,
                    delta: timestamp - last,
                });
                if (result === true && progress < 1) {
                    last = timestamp;
                    window.requestAnimationFrame(_run);
                }

            }
            window.requestAnimationFrame(_run);
        }
    }
};
