
/**
 * 參考 JQuery UI (http://robertpenner.com/easing/)
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

exports["default"] = RAF;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _easings = {
    linear: function linear(p) {
        return p;
    },
    easeIn: function easeIn(p) {
        return Math.pow(p, 2);
    },
    easeOut: function easeOut(p) {
        return 1 - _easings.easeIn(1 - p);
    },
    swing: function swing(p) {
        return p < 0.5 ? _easings.easeIn(p * 2) / 2 : 1 - _easings.easeIn(p * -2 + 2) / 2;
    }
};

function RAF(Component) {
    return (function (_Component) {
        _inherits(_class, _Component);

        function _class(props) {
            var _this = this;

            _classCallCheck(this, _class);

            _get(Object.getPrototypeOf(_class.prototype), "constructor", this).call(this, props);
            this._raf = {
                timeout: [],
                lasttime: 0
            };

            window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
                var time = new Date().getTime();
                var step = Math.max(0, 16 - (time - _this._raf.lasttime));
                _this._raf.lasttime = time + step;
                var timeout = window.setTimeout(function () {
                    return callback(time + step);
                }, step);
                _this._raf.timeout.push(timeout);
                return timeout;
            };

            window.cancelAnimationFrame = window.cancelAnimationFrame || function (id) {
                return window.clearTimeout(id);
            };
        }

        _createClass(_class, [{
            key: "componentWillUnmount",
            value: function componentWillUnmount() {
                this._raf.timeout.forEach(function (id) {
                    return window.cancelAnimationFrame(id);
                });
            }
        }, {
            key: "cancelRAF",
            value: function cancelRAF(id) {
                window.cancelAnimationFrame(id);
            }

            /**
             * [RAF description]
             * @param {Function} callback [description]
             * @param {[type]}   ms       [description]
             * @param {[type]}   easing   [description]
             * @return requestAnimationFrame id 
             */
        }, {
            key: "RAF",
            value: function RAF(callback, ms, easing) {

                /* 啟始時間 */
                var start = null;

                /* 最後(前一次)執行時間 */
                var last = null;

                /* 總執行時間 */
                var total = null;

                /* 進度 (有傳入 參數 ms 才會用到) */
                var progress = 0;

                var _run = function _run(timestamp) {
                    if (start === null) {
                        start = last = timestamp;
                    }

                    total = timestamp - start;

                    if (ms) {
                        progress = _easings[easing](total >= ms ? 1 : total / ms);
                    }

                    var result = callback({
                        start: start,
                        last: last,
                        total: total,
                        progress: progress,
                        stamp: timestamp,
                        delta: timestamp - last
                    });
                    if (result === true && progress < 1) {
                        last = timestamp;
                        window.requestAnimationFrame(_run);
                    }
                };
                window.requestAnimationFrame(_run);
            }
        }]);

        return _class;
    })(Component);
}

;
module.exports = exports["default"];