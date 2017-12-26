(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("stush", [], factory);
	else if(typeof exports === 'object')
		exports["stush"] = factory();
	else
		root["stush"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("lodash/assignIn");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("lodash/get");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("lodash/has");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("lodash/pick");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isString2 = __webpack_require__(16);

var _isString3 = _interopRequireDefault(_isString2);

exports.default = function () {
  var stushError = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var stripeError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if ((0, _isString3.default)(stushError)) {
    stushError = {
      message: stushError,
      code: 500
    };
  }
  return new Error({ stush: stushError, stripe: stripeError });
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("lodash/set");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("lodash/cloneDeep");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("lodash/omit");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("joi");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("lodash/unset");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("lodash/keys");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _remove2 = __webpack_require__(12);

var _remove3 = _interopRequireDefault(_remove2);

var _has2 = __webpack_require__(2);

var _has3 = _interopRequireDefault(_has2);

var _assignIn2 = __webpack_require__(0);

var _assignIn3 = _interopRequireDefault(_assignIn2);

var _cloneDeep2 = __webpack_require__(6);

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _unset2 = __webpack_require__(9);

var _unset3 = _interopRequireDefault(_unset2);

var _get2 = __webpack_require__(1);

var _get3 = _interopRequireDefault(_get2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by ravindra on 28/11/17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _schema = __webpack_require__(27);

var _schema2 = _interopRequireDefault(_schema);

var _error = __webpack_require__(4);

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Plan = function () {
  function Plan(stushInstance) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Plan);

    this.data = {};
    this._stush = {};
    this._cache = {};

    this._stush = stushInstance;
    this._cache = stushInstance.fetchCacheInstance();
    this.set(data, true);
  }

  /**
   * Fetches all plans.
   * @param stushInstance
   * @param args
   * @returns {Promise.<*>}
   */


  _createClass(Plan, [{
    key: "set",


    /**
     * Setter method for data(Also formats and validates data being set).
     * @param data
     * @param allowImmutable
     */
    value: function set(data) {
      var allowImmutable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var updatedData = (0, _cloneDeep3.default)(this.data);
      (0, _assignIn3.default)(updatedData, data);
      updatedData = (0, _schema.formatPlanData)(updatedData);
      this.data = updatedData;
    }

    /**
     * Attempts to update the plan; falls back to creating one.
     * @returns {Promise.<*>}
     */

  }, {
    key: "save",
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var params, data, _data;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                params = (0, _schema.validator)(this.data);
                _context.next = 4;
                return this._stush.stripe.plans.update(this.data.id, params.value);

              case 4:
                data = _context.sent;

                this._cache.put(data.id, new Plan(this._stush, data), this._stush.fetchCacheLifetime());

                if (this._cache.keys().includes("all_plans")) {
                  _context.next = 11;
                  break;
                }

                _context.next = 9;
                return Plan.fetchAll(this._stush);

              case 9:
                _context.next = 12;
                break;

              case 11:
                this.updateAllPlansCache(data);

              case 12:
                this.set(data, true);
                return _context.abrupt("return", Promise.resolve(this));

              case 16:
                _context.prev = 16;
                _context.t0 = _context["catch"](0);

                if (!((0, _has3.default)(_context.t0, "raw") && _context.t0.raw.param === "plan" && _context.t0.raw.statusCode === 404)) {
                  _context.next = 31;
                  break;
                }

                _context.next = 21;
                return this._stush.stripe.plans.create(this.data);

              case 21:
                _data = _context.sent;

                this._cache.put(_data.id, new Plan(this._stush, _data), this._stush.fetchCacheLifetime());

                if (this._cache.keys().includes("all_plans")) {
                  _context.next = 28;
                  break;
                }

                _context.next = 26;
                return Plan.fetchAll(this._stush);

              case 26:
                _context.next = 29;
                break;

              case 28:
                this.updateAllPlansCache(_data);

              case 29:
                this.set(_data, true);
                return _context.abrupt("return", Promise.resolve(this));

              case 31:
                return _context.abrupt("return", Promise.reject(_context.t0));

              case 32:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 16]]);
      }));

      function save() {
        return _ref.apply(this, arguments);
      }

      return save;
    }()

    /**
     * Populates the local plan from Stripe.
     * @returns {Promise.<*>}
     */

  }, {
    key: "selfPopulate",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var data, cacheKeys;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.data.id) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return", Promise.reject((0, _error2.default)("Please provide a valid plan ID before self populating")));

              case 2:
                _context2.prev = 2;
                data = void 0;
                cacheKeys = this._cache.keys();

                if (!cacheKeys.includes(this.data.id)) {
                  _context2.next = 9;
                  break;
                }

                data = this._cache.get(this.data.id).data;
                _context2.next = 18;
                break;

              case 9:
                _context2.next = 11;
                return this._stush.stripe.plans.retrieve(this.data.id);

              case 11:
                data = _context2.sent;

                if (this._cache.keys().includes("all_plans")) {
                  _context2.next = 17;
                  break;
                }

                _context2.next = 15;
                return Plan.fetchAll(this._stush);

              case 15:
                _context2.next = 18;
                break;

              case 17:
                this.updateAllPlansCache(this.data);

              case 18:
                (0, _assignIn3.default)(this.data, data);
                return _context2.abrupt("return", Promise.resolve(this));

              case 22:
                _context2.prev = 22;
                _context2.t0 = _context2["catch"](2);
                return _context2.abrupt("return", Promise.reject(_context2.t0));

              case 25:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 22]]);
      }));

      function selfPopulate() {
        return _ref2.apply(this, arguments);
      }

      return selfPopulate;
    }()

    /**
     * Deletes the plan.
     * @returns {Promise.<*>}
     */

  }, {
    key: "delete",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var plan;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                plan = this.data.id;
                _context3.next = 4;
                return this._stush.stripe.plans.del(plan);

              case 4:
                this.data = _context3.sent;

                this._cache.del(plan);

                if (this._cache.keys().includes("all_plans")) {
                  _context3.next = 11;
                  break;
                }

                _context3.next = 9;
                return Plan.fetchAll(this._stush);

              case 9:
                _context3.next = 12;
                break;

              case 11:
                this.updateAllPlansCache(plan, true);

              case 12:
                return _context3.abrupt("return", Promise.resolve(this));

              case 15:
                _context3.prev = 15;
                _context3.t0 = _context3["catch"](0);
                return _context3.abrupt("return", Promise.reject(_context3.t0));

              case 18:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 15]]);
      }));

      function _delete() {
        return _ref3.apply(this, arguments);
      }

      return _delete;
    }()

    /**
     * Returns data in JSON format.
     */

  }, {
    key: "toJson",
    value: function toJson() {
      return JSON.parse(JSON.stringify((0, _get3.default)(this, "data")));
    }

    /**
     * Fetches total interval of the plan.
     * @returns {string}
     */

  }, {
    key: "getInterval",
    value: function getInterval() {
      return this.data.interval_count + " " + this.data.interval;
    }

    /**
     * Fetches price of the plan.
     * @returns {schema.amount|{is, then}|*}
     */

  }, {
    key: "getPrice",
    value: function getPrice() {
      return this.data.amount;
    }

    /**
     * Updates the "all_plans" cache key data.
     * @param newPlan
     * @param deletingPlan
     */

  }, {
    key: "updateAllPlansCache",
    value: function updateAllPlansCache(newPlan) {
      var deletingPlan = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var cache = this._stush.fetchCacheInstance();
      var plans = cache.get("all_plans");

      var _loop = function _loop(plan) {
        (0, _remove3.default)(plans, function () {
          return plan.id === newPlan.id;
        });
      };

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = plans[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var plan = _step.value;

          _loop(plan);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (!deletingPlan) {
        plans.push(new Plan(this._stush, newPlan));
      }
    }
  }], [{
    key: "fetchAll",
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(stushInstance) {
        var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var cache, cacheLifetime, cacheKeys, set, plans, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, plan;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                cache = stushInstance.fetchCacheInstance(), cacheLifetime = stushInstance.fetchCacheLifetime(), cacheKeys = cache.keys();
                set = [];

                if (!(cacheKeys.includes("all_plans") && !(0, _get3.default)(args, "refresh_cache", false))) {
                  _context4.next = 7;
                  break;
                }

                set = cache.get("all_plans");
                _context4.next = 31;
                break;

              case 7:
                (0, _unset3.default)(args, "refresh_cache");
                _context4.next = 10;
                return stushInstance.stripe.plans.list(args);

              case 10:
                plans = _context4.sent;
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context4.prev = 14;

                for (_iterator2 = plans.data[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  plan = _step2.value;

                  set.push(new Plan(stushInstance, plan));
                  cache.put((0, _get3.default)(plan, "id"), new Plan(stushInstance, plan), cacheLifetime);
                }
                _context4.next = 22;
                break;

              case 18:
                _context4.prev = 18;
                _context4.t0 = _context4["catch"](14);
                _didIteratorError2 = true;
                _iteratorError2 = _context4.t0;

              case 22:
                _context4.prev = 22;
                _context4.prev = 23;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 25:
                _context4.prev = 25;

                if (!_didIteratorError2) {
                  _context4.next = 28;
                  break;
                }

                throw _iteratorError2;

              case 28:
                return _context4.finish(25);

              case 29:
                return _context4.finish(22);

              case 30:
                cache.put("all_plans", set, cacheLifetime);

              case 31:
                return _context4.abrupt("return", Promise.resolve(set));

              case 34:
                _context4.prev = 34;
                _context4.t1 = _context4["catch"](0);
                return _context4.abrupt("return", Promise.reject(_context4.t1));

              case 37:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 34], [14, 18, 22, 30], [23,, 25, 29]]);
      }));

      function fetchAll(_x5) {
        return _ref4.apply(this, arguments);
      }

      return fetchAll;
    }()
  }]);

  return Plan;
}();

exports.default = Plan;

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("lodash/remove");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _pick2 = __webpack_require__(3);

var _pick3 = _interopRequireDefault(_pick2);

var _has2 = __webpack_require__(2);

var _has3 = _interopRequireDefault(_has2);

var _assignIn2 = __webpack_require__(0);

var _assignIn3 = _interopRequireDefault(_assignIn2);

var _cloneDeep2 = __webpack_require__(6);

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by ravindra on 27/11/17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _error = __webpack_require__(4);

var _error2 = _interopRequireDefault(_error);

var _schema = __webpack_require__(32);

var _schema2 = _interopRequireDefault(_schema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Invoice = function () {
  function Invoice(stushInstance) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Invoice);

    this.data = {};
    this._stush = {};

    this._stush = stushInstance;
    this.set(data, true);
  }

  /**
   * Fetches all invoices.
   * @param stushInstance
   * @param args
   * @returns {Promise.<*>}
   */


  _createClass(Invoice, [{
    key: "set",


    /**
     * Setter method for data(Also formats and validates data being set).
     * @param data
     * @param allowImmutable
     */
    value: function set(data) {
      var allowImmutable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var updatedData = (0, _cloneDeep3.default)(this.data);
      (0, _assignIn3.default)(updatedData, data);
      (0, _schema.validator)(updatedData, allowImmutable);
      this.data = updatedData;
    }

    /**
     * Creates a new Stripe invoice.
     * @returns {Promise.<*>}
     */

  }, {
    key: "save",
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                data = void 0;

                if (!(0, _has3.default)(this, "data.id")) {
                  _context.next = 5;
                  break;
                }

                _context.next = 8;
                break;

              case 5:
                _context.next = 7;
                return this._stush.stripe.invoices.create(this.data);

              case 7:
                data = _context.sent;

              case 8:
                this.set(data, true);
                return _context.abrupt("return", Promise.resolve(this));

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", Promise.reject(_context.t0));

              case 15:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 12]]);
      }));

      function save() {
        return _ref.apply(this, arguments);
      }

      return save;
    }()

    /**
     * Returns data in JSON format.
     */

  }, {
    key: "toJson",
    value: function toJson() {
      return JSON.parse(JSON.stringify((0, _pick3.default)(this, ["data"])));
    }

    /**
     * Populates the local invoice instance from Stripe with upcoming invoice.
     * @param args
     * @returns {Promise.<*>}
     */

  }, {
    key: "populateWithUpcoming",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(args) {
        var params, upcomingInvoice;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if ((0, _has3.default)(args, "customer")) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return", Promise.reject((0, _error2.default)("Please provide a valid customer ID to add a new subscription.")));

              case 2:
                if ((0, _has3.default)(args, "subscription")) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt("return", Promise.reject((0, _error2.default)("Please provide a valid subscription to fetch upcoming invoice.")));

              case 4:
                params = (0, _schema.sanitizePopulateWithUpcoming)(args);
                _context2.next = 7;
                return this._stush.stripe.invoices.retrieveUpcoming(args.customer, args.subscription, params);

              case 7:
                upcomingInvoice = _context2.sent;

                this.set(upcomingInvoice, true);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function populateWithUpcoming(_x3) {
        return _ref2.apply(this, arguments);
      }

      return populateWithUpcoming;
    }()

    /**
     * Calculates and provides proration details.
     * @param proration_date
     * @param changeInBillingCycle
     * @returns {Promise.<{proration_cost: number, proration_items: Array}>}
     */

  }, {
    key: "calculateProration",
    value: function calculateProration(proration_date) {
      var changeInBillingCycle = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var currentProrations = [];
      var cost = 0,
          invoiceItem = {};
      if (changeInBillingCycle) {
        cost = this.data.subtotal;
        currentProrations = this.data.lines.data;
      } else {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.data.lines.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            invoiceItem = _step.value;

            if (invoiceItem.period.start == proration_date) {
              currentProrations.push(invoiceItem);
              cost += invoiceItem.amount;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
      return Promise.resolve({
        proration_cost: cost,
        proration_items: currentProrations
      });
    }
  }], [{
    key: "fetchAll",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(stushInstance) {
        var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var invoices, set, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, invoice;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return stushInstance.stripe.invoices.list(args);

              case 3:
                invoices = _context3.sent;
                set = [];
                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context3.prev = 8;

                for (_iterator2 = invoices.data[Symbol.iterator](); !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  invoice = _step2.value;

                  set.push(new Invoice(stushInstance, invoice));
                }
                _context3.next = 16;
                break;

              case 12:
                _context3.prev = 12;
                _context3.t0 = _context3["catch"](8);
                _didIteratorError2 = true;
                _iteratorError2 = _context3.t0;

              case 16:
                _context3.prev = 16;
                _context3.prev = 17;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 19:
                _context3.prev = 19;

                if (!_didIteratorError2) {
                  _context3.next = 22;
                  break;
                }

                throw _iteratorError2;

              case 22:
                return _context3.finish(19);

              case 23:
                return _context3.finish(16);

              case 24:
                return _context3.abrupt("return", Promise.resolve(set));

              case 27:
                _context3.prev = 27;
                _context3.t1 = _context3["catch"](0);
                return _context3.abrupt("return", Promise.reject(_context3.t1));

              case 30:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 27], [8, 12, 16, 24], [17,, 19, 23]]);
      }));

      function fetchAll(_x6) {
        return _ref3.apply(this, arguments);
      }

      return fetchAll;
    }()
  }]);

  return Invoice;
}();

exports.default = Invoice;

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("lodash/ceil");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("lodash/isString");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("lodash/head");

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _head2 = __webpack_require__(17);

var _head3 = _interopRequireDefault(_head2);

var _unset2 = __webpack_require__(9);

var _unset3 = _interopRequireDefault(_unset2);

var _isArray2 = __webpack_require__(19);

var _isArray3 = _interopRequireDefault(_isArray2);

var _ceil2 = __webpack_require__(14);

var _ceil3 = _interopRequireDefault(_ceil2);

var _startsWith2 = __webpack_require__(33);

var _startsWith3 = _interopRequireDefault(_startsWith2);

var _get2 = __webpack_require__(1);

var _get3 = _interopRequireDefault(_get2);

var _set2 = __webpack_require__(5);

var _set3 = _interopRequireDefault(_set2);

var _omit2 = __webpack_require__(7);

var _omit3 = _interopRequireDefault(_omit2);

var _has2 = __webpack_require__(2);

var _has3 = _interopRequireDefault(_has2);

var _pick2 = __webpack_require__(3);

var _pick3 = _interopRequireDefault(_pick2);

var _assignIn2 = __webpack_require__(0);

var _assignIn3 = _interopRequireDefault(_assignIn2);

var _cloneDeep2 = __webpack_require__(6);

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by ravindra on 21/11/17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _error = __webpack_require__(4);

var _error2 = _interopRequireDefault(_error);

var _schema = __webpack_require__(20);

var _schema2 = _interopRequireDefault(_schema);

var _plan = __webpack_require__(11);

var _plan2 = _interopRequireDefault(_plan);

var _source3 = __webpack_require__(34);

var _source4 = _interopRequireDefault(_source3);

var _refund2 = __webpack_require__(35);

var _refund3 = _interopRequireDefault(_refund2);

var _invoice = __webpack_require__(13);

var _invoice2 = _interopRequireDefault(_invoice);

var _subscription = __webpack_require__(21);

var _subscription2 = _interopRequireDefault(_subscription);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Customer = function () {
  function Customer(stushInstance, customerData) {
    _classCallCheck(this, Customer);

    this.data = {};
    this._stush = {};

    this._stush = stushInstance;
    this.set(customerData, true);
  }

  /**
   * Fetches all customers.
   * @param stushInstance
   * @param args
   * @returns {Promise.<*>}
   */


  _createClass(Customer, [{
    key: "set",


    /**
     * Setter method for data(Also formats and validates data being set).
     * @param data
     * @param allowImmutable
     */
    value: function set(data) {
      var allowImmutable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var updatedData = (0, _cloneDeep3.default)(this.data);
      (0, _assignIn3.default)(updatedData, data);
      updatedData = (0, _schema.formatCustomerData)(updatedData);
      (0, _schema.validator)(updatedData, allowImmutable);
      this.data = updatedData;
    }

    /**
     * Returns data in JSON format.
     */

  }, {
    key: "toJson",
    value: function toJson() {
      return JSON.parse(JSON.stringify((0, _pick3.default)(this, ["data"])));
    }

    /**
     * Creates a new Stripe customer if ID not present; otherwise, updates the customer.
     * @returns {Promise.<*>}
     */

  }, {
    key: "save",
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var data, params;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                data = {};

                if (!(0, _has3.default)(this.data, "id")) {
                  _context.next = 9;
                  break;
                }

                params = (0, _schema.validator)(this.data);
                _context.next = 6;
                return this._stush.stripe.customers.update(this.data.id, params.value);

              case 6:
                data = _context.sent;
                _context.next = 12;
                break;

              case 9:
                _context.next = 11;
                return this._stush.stripe.customers.create(this.data);

              case 11:
                data = _context.sent;

              case 12:
                this.set(data, true);
                return _context.abrupt("return", Promise.resolve(this));

              case 16:
                _context.prev = 16;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", Promise.reject(_context.t0));

              case 19:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 16]]);
      }));

      function save() {
        return _ref.apply(this, arguments);
      }

      return save;
    }()

    /**
     * Deletes the customer.
     * @returns {Promise.<*>}
     */

  }, {
    key: "delete",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.data.id) {
                  _context2.next = 2;
                  break;
                }

                throw (0, _error2.default)("Valid customer ID is required to delete the customer");

              case 2:
                _context2.prev = 2;
                _context2.next = 5;
                return this._stush.stripe.customers.del(this.data.id);

              case 5:
                this.data = _context2.sent;
                return _context2.abrupt("return", Promise.resolve(this));

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](2);
                return _context2.abrupt("return", Promise.reject(_context2.t0));

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 9]]);
      }));

      function _delete() {
        return _ref2.apply(this, arguments);
      }

      return _delete;
    }()

    /**
     * Populates the local customer from Stripe.
     * @returns {Promise.<*>}
     */

  }, {
    key: "selfPopulate",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
        var stripeCustomer;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.data.id) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return", Promise.reject((0, _error2.default)("Please provide a valid customer ID before self populating")));

              case 2:
                _context3.prev = 2;
                _context3.next = 5;
                return this._stush.stripe.customers.retrieve(this.data.id);

              case 5:
                stripeCustomer = _context3.sent;

                (0, _assignIn3.default)(this.data, stripeCustomer);
                return _context3.abrupt("return", Promise.resolve(this));

              case 10:
                _context3.prev = 10;
                _context3.t0 = _context3["catch"](2);
                return _context3.abrupt("return", Promise.reject(_context3.t0));

              case 13:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[2, 10]]);
      }));

      function selfPopulate() {
        return _ref3.apply(this, arguments);
      }

      return selfPopulate;
    }()
  }, {
    key: "fetchAllSources",
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var sources, sourcesArray, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, source;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this.data.id) {
                  _context4.next = 2;
                  break;
                }

                throw (0, _error2.default)("Please provide a valid customer ID to add a new subscription.");

              case 2:
                _context4.prev = 2;
                _context4.next = 5;
                return this._stush.stripe.customers.listSources(this.data.id, args);

              case 5:
                sources = _context4.sent;

                // Creating an array of Source instances.
                sourcesArray = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context4.prev = 10;

                for (_iterator = sources.data[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  source = _step.value;

                  sourcesArray.push(new _source4.default(this._stush, source));
                }
                _context4.next = 18;
                break;

              case 14:
                _context4.prev = 14;
                _context4.t0 = _context4["catch"](10);
                _didIteratorError = true;
                _iteratorError = _context4.t0;

              case 18:
                _context4.prev = 18;
                _context4.prev = 19;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 21:
                _context4.prev = 21;

                if (!_didIteratorError) {
                  _context4.next = 24;
                  break;
                }

                throw _iteratorError;

              case 24:
                return _context4.finish(21);

              case 25:
                return _context4.finish(18);

              case 26:
                return _context4.abrupt("return", Promise.resolve(sourcesArray));

              case 29:
                _context4.prev = 29;
                _context4.t1 = _context4["catch"](2);
                return _context4.abrupt("return", Promise.reject(_context4.t1));

              case 32:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[2, 29], [10, 14, 18, 26], [19,, 21, 25]]);
      }));

      function fetchAllSources() {
        return _ref4.apply(this, arguments);
      }

      return fetchAllSources;
    }()

    /**
     * Adds a source to customer.
     * @param sourceId
     * @returns {Promise.<*>}
     */

  }, {
    key: "attachSource",
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(sourceId) {
        var source;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return this._stush.stripe.customers.createSource(this.data.id, {
                  source: sourceId
                });

              case 3:
                source = _context5.sent;
                return _context5.abrupt("return", Promise.resolve(new _source4.default(this._stush, source)));

              case 7:
                _context5.prev = 7;
                _context5.t0 = _context5["catch"](0);
                return _context5.abrupt("return", Promise.reject(_context5.t0));

              case 10:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 7]]);
      }));

      function attachSource(_x3) {
        return _ref5.apply(this, arguments);
      }

      return attachSource;
    }()
  }, {
    key: "updateSource",
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(sourceId) {
        var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var sourceParams, source, sourceExcludes, _sourceParams, _source;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                sourceParams = {
                  metadata: (0, _omit3.default)(params, ["owner"])
                };

                if ((0, _has3.default)(params, "owner")) {
                  (0, _set3.default)(sourceParams, "owner", (0, _get3.default)(params, "owner", ""));
                }
                _context6.next = 5;
                return this._stush.stripe.sources.update(sourceId, sourceParams);

              case 5:
                source = _context6.sent;
                return _context6.abrupt("return", Promise.resolve(new _source4.default(this._stush, source)));

              case 9:
                _context6.prev = 9;
                _context6.t0 = _context6["catch"](0);

                if (!((0, _has3.default)(_context6.t0, "raw") && (0, _startsWith3.default)(_context6.t0.raw.message, "No such source"))) {
                  _context6.next = 19;
                  break;
                }

                sourceExcludes = ["address_city", "address_country", "address_line1", "address_line2", "address_state", "address_zip", "exp_month", "exp_year", "name"];
                _sourceParams = {
                  metadata: (0, _omit3.default)(params, sourceExcludes)
                };

                (0, _assignIn3.default)(_sourceParams, (0, _pick3.default)(params, sourceExcludes));
                _context6.next = 17;
                return this._stush.stripe.customers.updateCard(this.data.id, sourceId, _sourceParams);

              case 17:
                _source = _context6.sent;
                return _context6.abrupt("return", Promise.resolve(new _source4.default(this._stush, _source)));

              case 19:
                return _context6.abrupt("return", Promise.reject(_context6.t0));

              case 20:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 9]]);
      }));

      function updateSource(_x5) {
        return _ref6.apply(this, arguments);
      }

      return updateSource;
    }()

    /**
     * Removes a source from customer. Falls back to removing card if source not found.
     * @param sourceId
     * @returns {Promise.<*>}
     */

  }, {
    key: "detachSource",
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(sourceId) {
        var source, _source2;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                _context7.next = 3;
                return this._stush.stripe.customers.deleteSource(this.data.id, {
                  source: sourceId
                });

              case 3:
                source = _context7.sent;
                return _context7.abrupt("return", Promise.resolve(new _source4.default(this._stush, source)));

              case 7:
                _context7.prev = 7;
                _context7.t0 = _context7["catch"](0);

                if (!((0, _has3.default)(_context7.t0, "raw") && _context7.t0.raw.param === "id" && (0, _startsWith3.default)(_context7.t0.raw.message, "No such source"))) {
                  _context7.next = 14;
                  break;
                }

                _context7.next = 12;
                return this._stush.stripe.customers.deleteCard(this.data.id, sourceId);

              case 12:
                _source2 = _context7.sent;
                return _context7.abrupt("return", Promise.resolve(new _source4.default(this._stush, _source2)));

              case 14:
                return _context7.abrupt("return", Promise.reject(_context7.t0));

              case 15:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 7]]);
      }));

      function detachSource(_x6) {
        return _ref7.apply(this, arguments);
      }

      return detachSource;
    }()

    /**
     * Returns whether customer has any subscriptions.
     * @returns {boolean}
     */

  }, {
    key: "isSubscribed",
    value: function isSubscribed() {
      return (0, _get3.default)(this.data, "subscriptions.data.length", 0) !== 0;
    }

    /**
     * Returns the latest subscription of local customer instance if no argument is passed.
     * @param subscriptionId
     * @returns {Promise.<Subscription>}
     */

  }, {
    key: "fetchSubscription",
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
        var subscriptionId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        var subscriptions, requiredSubscription, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, value;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.selfPopulate();

              case 2:
                subscriptions = (0, _get3.default)(this.data, "subscriptions");
                requiredSubscription = void 0;

                if (!subscriptionId) {
                  _context8.next = 34;
                  break;
                }

                _iteratorNormalCompletion2 = true;
                _didIteratorError2 = false;
                _iteratorError2 = undefined;
                _context8.prev = 8;
                _iterator2 = subscriptions.data[Symbol.iterator]();

              case 10:
                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                  _context8.next = 18;
                  break;
                }

                value = _step2.value;

                if (!(subscriptionId === value.id)) {
                  _context8.next = 15;
                  break;
                }

                requiredSubscription = value;
                return _context8.abrupt("break", 18);

              case 15:
                _iteratorNormalCompletion2 = true;
                _context8.next = 10;
                break;

              case 18:
                _context8.next = 24;
                break;

              case 20:
                _context8.prev = 20;
                _context8.t0 = _context8["catch"](8);
                _didIteratorError2 = true;
                _iteratorError2 = _context8.t0;

              case 24:
                _context8.prev = 24;
                _context8.prev = 25;

                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }

              case 27:
                _context8.prev = 27;

                if (!_didIteratorError2) {
                  _context8.next = 30;
                  break;
                }

                throw _iteratorError2;

              case 30:
                return _context8.finish(27);

              case 31:
                return _context8.finish(24);

              case 32:
                _context8.next = 39;
                break;

              case 34:
                if (!(this._stush.fetchModel() === "multiple")) {
                  _context8.next = 38;
                  break;
                }

                throw (0, _error2.default)("Subscription ID needs to be specified in Multiple Subscription Model.");

              case 38:
                requiredSubscription = (0, _get3.default)(this.data, "subscriptions.data.[0]", null);

              case 39:
                if (requiredSubscription) {
                  _context8.next = 41;
                  break;
                }

                throw (0, _error2.default)("Specified customer is not subscribed to subscription with provided ID.");

              case 41:
                return _context8.abrupt("return", Promise.resolve(new _subscription2.default(this._stush, requiredSubscription)));

              case 42:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[8, 20, 24, 32], [25,, 27, 31]]);
      }));

      function fetchSubscription() {
        return _ref8.apply(this, arguments);
      }

      return fetchSubscription;
    }()

    /**
     * Fetches a subscription by plan ID for the customer.
     * @param planId
     * @returns {Promise.<*>}
     */

  }, {
    key: "fetchSubscriptionByPlan",
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(planId) {
        var subscriptions, requiredSubscription, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, subscription, subscriptionItems, _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, value;

        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (planId) {
                  _context9.next = 2;
                  break;
                }

                throw (0, _error2.default)("Plan ID is required to fetch subscription by plan.");

              case 2:
                _context9.prev = 2;

                if ((0, _get3.default)(this, "data.object", null)) {
                  _context9.next = 6;
                  break;
                }

                _context9.next = 6;
                return this.selfPopulate();

              case 6:
                subscriptions = (0, _get3.default)(this.data, "subscriptions");
                requiredSubscription = void 0;
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context9.prev = 11;
                _iterator3 = subscriptions.data[Symbol.iterator]();

              case 13:
                if (_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done) {
                  _context9.next = 48;
                  break;
                }

                subscription = _step3.value;
                subscriptionItems = (0, _get3.default)(subscription, "items.data");
                _iteratorNormalCompletion4 = true;
                _didIteratorError4 = false;
                _iteratorError4 = undefined;
                _context9.prev = 19;
                _iterator4 = subscriptionItems[Symbol.iterator]();

              case 21:
                if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
                  _context9.next = 29;
                  break;
                }

                value = _step4.value;

                if (!(planId === (0, _get3.default)(value, "plan.id"))) {
                  _context9.next = 26;
                  break;
                }

                requiredSubscription = subscription;
                return _context9.abrupt("break", 29);

              case 26:
                _iteratorNormalCompletion4 = true;
                _context9.next = 21;
                break;

              case 29:
                _context9.next = 35;
                break;

              case 31:
                _context9.prev = 31;
                _context9.t0 = _context9["catch"](19);
                _didIteratorError4 = true;
                _iteratorError4 = _context9.t0;

              case 35:
                _context9.prev = 35;
                _context9.prev = 36;

                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }

              case 38:
                _context9.prev = 38;

                if (!_didIteratorError4) {
                  _context9.next = 41;
                  break;
                }

                throw _iteratorError4;

              case 41:
                return _context9.finish(38);

              case 42:
                return _context9.finish(35);

              case 43:
                if (!requiredSubscription) {
                  _context9.next = 45;
                  break;
                }

                return _context9.abrupt("break", 48);

              case 45:
                _iteratorNormalCompletion3 = true;
                _context9.next = 13;
                break;

              case 48:
                _context9.next = 54;
                break;

              case 50:
                _context9.prev = 50;
                _context9.t1 = _context9["catch"](11);
                _didIteratorError3 = true;
                _iteratorError3 = _context9.t1;

              case 54:
                _context9.prev = 54;
                _context9.prev = 55;

                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }

              case 57:
                _context9.prev = 57;

                if (!_didIteratorError3) {
                  _context9.next = 60;
                  break;
                }

                throw _iteratorError3;

              case 60:
                return _context9.finish(57);

              case 61:
                return _context9.finish(54);

              case 62:
                if (requiredSubscription) {
                  _context9.next = 64;
                  break;
                }

                throw (0, _error2.default)("Customer is not subscribed to subscription with specified plan.");

              case 64:
                return _context9.abrupt("return", Promise.resolve(new _subscription2.default(this._stush, requiredSubscription)));

              case 67:
                _context9.prev = 67;
                _context9.t2 = _context9["catch"](2);
                return _context9.abrupt("return", Promise.reject(_context9.t2));

              case 70:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this, [[2, 67], [11, 50, 54, 62], [19, 31, 35, 43], [36,, 38, 42], [55,, 57, 61]]);
      }));

      function fetchSubscriptionByPlan(_x8) {
        return _ref9.apply(this, arguments);
      }

      return fetchSubscriptionByPlan;
    }()

    /**
     * Fetches all the subscriptions on local customer instance.
     * @returns {Set}
     */

  }, {
    key: "fetchAllSubscriptions",
    value: function fetchAllSubscriptions() {
      var subscriptions = (0, _get3.default)(this.data, "subscriptions.data");
      var set = new Set();
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = subscriptions[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var subscription = _step5.value;

          set.add(new _subscription2.default(this._stush, subscription));
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }

      return set;
    }

    /**
     * Adds a new subscription to customer.
     * @param subscriptionObj
     * @returns {Promise.<*>}
     */

  }, {
    key: "addSubscription",
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(subscriptionObj) {
        var subscription;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;

                if (this.data.id) {
                  _context10.next = 3;
                  break;
                }

                return _context10.abrupt("return", Promise.reject((0, _error2.default)("Please provide a valid customer ID to add a new subscription.")));

              case 3:
                subscription = subscriptionObj.clone();

                (0, _set3.default)(subscription, "data.customer", this.data.id);
                _context10.next = 7;
                return subscription.save();

              case 7:
                _context10.next = 9;
                return this.selfPopulate();

              case 9:
                return _context10.abrupt("return", Promise.resolve(subscription));

              case 12:
                _context10.prev = 12;
                _context10.t0 = _context10["catch"](0);
                return _context10.abrupt("return", Promise.reject(_context10.t0));

              case 15:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this, [[0, 12]]);
      }));

      function addSubscription(_x9) {
        return _ref10.apply(this, arguments);
      }

      return addSubscription;
    }()

    /**
     * Cancels a subscription.
     * @param subscription
     * @returns {Promise.<*>}
     */

  }, {
    key: "endSubscription",
    value: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11() {
        var subscription = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var stripeSubscription, response;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;

                if (!(!subscription && this._stush.fetchModel() === "multiple")) {
                  _context11.next = 3;
                  break;
                }

                return _context11.abrupt("return", Promise.reject({
                  isJoi: true,
                  details: [{
                    message: "Valid subscription is required in Multiple Subscription Model.",
                    code: 500
                  }]
                }));

              case 3:
                if (!(!subscription || !(0, _has3.default)(subscription, "data.id"))) {
                  _context11.next = 10;
                  break;
                }

                _context11.next = 6;
                return this.selfPopulate();

              case 6:
                _context11.next = 8;
                return this.fetchSubscription();

              case 8:
                stripeSubscription = _context11.sent;

                (0, _assignIn3.default)(subscription.data, stripeSubscription.data);

              case 10:
                _context11.next = 12;
                return subscription.cancel();

              case 12:
                response = _context11.sent;
                return _context11.abrupt("return", Promise.resolve(response));

              case 16:
                _context11.prev = 16;
                _context11.t0 = _context11["catch"](0);
                return _context11.abrupt("return", Promise.reject(_context11.t0));

              case 19:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this, [[0, 16]]);
      }));

      function endSubscription() {
        return _ref11.apply(this, arguments);
      }

      return endSubscription;
    }()

    /**
     * Changes a subscription(upgrades or downgrades).
     * @param toSubscription
     * @param fromSubscription
     * @returns {Promise.<*>}
     */

  }, {
    key: "changeSubscription",
    value: function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(toSubscription) {
        var fromSubscription = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var subscription;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0;
                _context12.next = 3;
                return this.selfPopulate();

              case 3:
                if (!(this._stush.fetchModel() === "multiple" && !fromSubscription)) {
                  _context12.next = 5;
                  break;
                }

                return _context12.abrupt("return", Promise.reject({
                  isJoi: true,
                  details: [{
                    message: "Valid subscription is required in Multiple Subscription Model.",
                    code: 500
                  }]
                }));

              case 5:
                if (fromSubscription) {
                  _context12.next = 9;
                  break;
                }

                _context12.next = 8;
                return this.fetchSubscription();

              case 8:
                fromSubscription = _context12.sent;

              case 9:
                subscription = fromSubscription.clone();
                _context12.next = 12;
                return subscription.change(toSubscription);

              case 12:
                return _context12.abrupt("return", Promise.resolve(subscription));

              case 15:
                _context12.prev = 15;
                _context12.t0 = _context12["catch"](0);
                return _context12.abrupt("return", Promise.reject(_context12.t0));

              case 18:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this, [[0, 15]]);
      }));

      function changeSubscription(_x12) {
        return _ref12.apply(this, arguments);
      }

      return changeSubscription;
    }()

    /**
     * Previews cancellation or change of plan proration details.
     * @param toSubscription
     * @param fromSubscription
     * @returns {Promise.<*>}
     */

  }, {
    key: "previewProration",
    value: function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(toSubscription) {
        var fromSubscription = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var params, subscriptionItem, upcomingInvoice, planToChange, newPlan, changeInBillingCycle, prorationData;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                if (!(!(0, _get3.default)(toSubscription, "data.cancellation_proration", false) && (0, _has3.default)(toSubscription, "data.id"))) {
                  _context13.next = 2;
                  break;
                }

                throw (0, _error2.default)("Existing subscription cannot be passed to preview plan change proration.");

              case 2:
                _context13.prev = 2;
                _context13.next = 5;
                return this.selfPopulate();

              case 5:
                if (!(this._stush.fetchModel() === "multiple" && !(0, _has3.default)(fromSubscription, "data.id") && !(0, _get3.default)(toSubscription, "data.cancellation_proration", false))) {
                  _context13.next = 7;
                  break;
                }

                return _context13.abrupt("return", Promise.reject({
                  isJoi: true,
                  details: [{
                    message: "Valid subscription is required in Multiple Subscription Model.",
                    code: 500
                  }]
                }));

              case 7:
                if (fromSubscription) {
                  _context13.next = 15;
                  break;
                }

                if (!(0, _get3.default)(toSubscription, "data.cancellation_proration", false)) {
                  _context13.next = 12;
                  break;
                }

                fromSubscription = toSubscription.clone();
                _context13.next = 15;
                break;

              case 12:
                _context13.next = 14;
                return this.fetchSubscription();

              case 14:
                fromSubscription = _context13.sent;

              case 15:
                if (!(0, _has3.default)(fromSubscription, "data.id")) {
                  _context13.next = 18;
                  break;
                }

                _context13.next = 18;
                return fromSubscription.selfPopulate();

              case 18:
                params = {}, subscriptionItem = fromSubscription.fetchSubscriptionItem();

                (0, _set3.default)(params, "value.subscription", fromSubscription);
                (0, _set3.default)(params, "value.prorate_from", (0, _get3.default)(toSubscription, "data.prorate_from", (0, _ceil3.default)(new Date() / 1000)));
                (0, _set3.default)(toSubscription, "data.items[0].id", (0, _get3.default)(subscriptionItem, "id"));
                (0, _set3.default)(params, "value.items", (0, _get3.default)(toSubscription, "data.items"));
                if (!(0, _has3.default)(toSubscription, "data.items") || !(0, _isArray3.default)((0, _get3.default)(toSubscription, "data.items"))) {
                  (0, _set3.default)(params, "value.plan_to_change", (0, _get3.default)(subscriptionItem, "plan.id"));
                  (0, _set3.default)(params, "value.items", [{
                    id: subscriptionItem.id,
                    plan: (0, _get3.default)(toSubscription, "data.items[0].plan", (0, _get3.default)(toSubscription, "data.items.data[0].plan.id"))
                  }]);
                }
                if ((0, _get3.default)(toSubscription, "data.cancellation_proration")) {
                  (0, _set3.default)(params, "value.preview_cancellation_refund", true);
                } else {
                  (0, _set3.default)(params, "value.preview_proration", true);
                }
                (0, _unset3.default)(params, "value.cancellation_proration");
                _context13.next = 28;
                return this.fetchUpcomingInvoice(params.value);

              case 28:
                upcomingInvoice = _context13.sent;


                // Check if there is a change in billing period.
                planToChange = new _plan2.default(this._stush, {
                  id: (0, _get3.default)(subscriptionItem, "plan.id")
                });
                _context13.next = 32;
                return planToChange.selfPopulate();

              case 32:
                newPlan = new _plan2.default(this._stush, {
                  id: (0, _get3.default)(params, "value.items[0].plan")
                });
                _context13.next = 35;
                return newPlan.selfPopulate();

              case 35:
                changeInBillingCycle = planToChange.getInterval() !== newPlan.getInterval() || (0, _get3.default)(planToChange, "data.amount") === 0 && (0, _get3.default)(newPlan, "data.amount") !== 0;
                _context13.next = 38;
                return upcomingInvoice.calculateProration((0, _get3.default)(params, "value.prorate_from"), changeInBillingCycle);

              case 38:
                prorationData = _context13.sent;

                (0, _set3.default)(prorationData, "upcoming_invoice", upcomingInvoice.toJson());
                return _context13.abrupt("return", Promise.resolve(prorationData));

              case 43:
                _context13.prev = 43;
                _context13.t0 = _context13["catch"](2);
                return _context13.abrupt("return", Promise.reject(_context13.t0));

              case 46:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this, [[2, 43]]);
      }));

      function previewProration(_x14) {
        return _ref13.apply(this, arguments);
      }

      return previewProration;
    }()

    /**
     * Refunds on the specified charge.
     * @param args
     * @returns {Promise.<*>}
     */

  }, {
    key: "refund",
    value: function () {
      var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(args) {
        var _refund;

        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.prev = 0;
                _context14.next = 3;
                return this._stush.stripe.refunds.create(args);

              case 3:
                _refund = _context14.sent;
                return _context14.abrupt("return", Promise.resolve(new _refund3.default(this._stush, _refund)));

              case 7:
                _context14.prev = 7;
                _context14.t0 = _context14["catch"](0);
                return _context14.abrupt("return", Promise.reject(_context14.t0));

              case 10:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this, [[0, 7]]);
      }));

      function refund(_x15) {
        return _ref14.apply(this, arguments);
      }

      return refund;
    }()

    /**
     * Fetches all invoices for the customer.
     * @param args
     * @returns {Promise.<*>}
     */

  }, {
    key: "fetchAllInvoices",
    value: function () {
      var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
        var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var invoices;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.prev = 0;

                (0, _assignIn3.default)(args, {
                  customer: this.data.id
                });
                _context15.next = 4;
                return _invoice2.default.fetchAll(this._stush, args);

              case 4:
                invoices = _context15.sent;
                return _context15.abrupt("return", Promise.resolve(invoices));

              case 8:
                _context15.prev = 8;
                _context15.t0 = _context15["catch"](0);
                return _context15.abrupt("return", Promise.reject(_context15.t0));

              case 11:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this, [[0, 8]]);
      }));

      function fetchAllInvoices() {
        return _ref15.apply(this, arguments);
      }

      return fetchAllInvoices;
    }()

    /**
     * Fetches upcoming invoice for the customer.
     * @param args
     * @returns {Promise.<*>}
     */

  }, {
    key: "fetchUpcomingInvoice",
    value: function () {
      var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(args) {
        var subscription, subscriptionItems, invoice, params;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.prev = 0;

                if (this.data.id) {
                  _context16.next = 3;
                  break;
                }

                return _context16.abrupt("return", Promise.reject((0, _error2.default)("Please provide a valid customer ID to add a new subscription.")));

              case 3:
                subscription = void 0, subscriptionItems = void 0, invoice = new _invoice2.default(this._stush), params = {
                  customer: this.data.id
                };

                if (!((0, _has3.default)(args, "preview_cancellation_refund") || (0, _has3.default)(args, "preview_proration"))) {
                  _context16.next = 15;
                  break;
                }

                subscription = (0, _get3.default)(args, "subscription");

                if (!(typeof subscription === "string")) {
                  _context16.next = 10;
                  break;
                }

                _context16.next = 9;
                return this.fetchSubscription((0, _get3.default)(args, "subscription"));

              case 9:
                subscription = _context16.sent;

              case 10:
                subscriptionItems = (0, _get3.default)(args, "items", []);
                if (!(0, _has3.default)(args, "items")) {
                  subscriptionItems = [{
                    id: subscription.data.items.data[0].id,
                    plan: subscription.data.items.data[0].plan.id
                  }];
                }
                (0, _set3.default)(params, "subscription_items", subscriptionItems);
                (0, _set3.default)(params, "subscription_proration_date", (0, _get3.default)(args, "refund_value_from", (0, _get3.default)(args, "prorate_from")));
                if ((0, _get3.default)(args, "preview_cancellation_refund", false)) {
                  (0, _set3.default)(params, "subscription_items[0].quantity", 0);
                }

              case 15:
                if ((0, _has3.default)(args, "subscription")) {
                  if (typeof (0, _get3.default)(args, "subscription") === "string") {
                    (0, _set3.default)(params, "subscription", (0, _get3.default)(args, "subscription"));
                  } else {
                    (0, _set3.default)(params, "subscription", (0, _get3.default)(args, "subscription.data.id"));
                  }
                }
                _context16.next = 18;
                return invoice.populateWithUpcoming(params);

              case 18:
                return _context16.abrupt("return", Promise.resolve(invoice));

              case 21:
                _context16.prev = 21;
                _context16.t0 = _context16["catch"](0);
                return _context16.abrupt("return", Promise.reject(_context16.t0));

              case 24:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this, [[0, 21]]);
      }));

      function fetchUpcomingInvoice(_x17) {
        return _ref16.apply(this, arguments);
      }

      return fetchUpcomingInvoice;
    }()

    /**
     * Fetches an invoice for the customer.
     * @param args
     * @returns {Promise.<*>}
     */

  }, {
    key: "fetchAnInvoice",
    value: function () {
      var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17() {
        var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var params, invoice;
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _context17.prev = 0;
                params = {
                  limit: 1,
                  customer: this.data.id
                };

                (0, _assignIn3.default)(params, args);
                _context17.next = 5;
                return this._stush.stripe.invoices.list(params);

              case 5:
                invoice = _context17.sent;
                return _context17.abrupt("return", Promise.resolve(new _invoice2.default(this._stush, (0, _head3.default)(invoice.data))));

              case 9:
                _context17.prev = 9;
                _context17.t0 = _context17["catch"](0);
                return _context17.abrupt("return", Promise.reject(_context17.t0));

              case 12:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this, [[0, 9]]);
      }));

      function fetchAnInvoice() {
        return _ref17.apply(this, arguments);
      }

      return fetchAnInvoice;
    }()

    /**
     * Fetches the latest subscribed or modified plan(This operation is performed on subscription).
     * @param subscriptionId
     * @returns {Promise.<Plan>}
     */

  }, {
    key: "fetchLatestPlan",
    value: function () {
      var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
        var subscriptionId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var subscription, planId, plan;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                _context18.next = 2;
                return this.fetchSubscription(subscriptionId);

              case 2:
                subscription = _context18.sent;
                planId = subscription.fetchLatestPlan();
                plan = new _plan2.default(this._stush, {
                  id: planId
                });
                _context18.next = 7;
                return plan.selfPopulate();

              case 7:
                return _context18.abrupt("return", plan);

              case 8:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function fetchLatestPlan() {
        return _ref18.apply(this, arguments);
      }

      return fetchLatestPlan;
    }()
  }], [{
    key: "fetchAll",
    value: function () {
      var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(stushInstance) {
        var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var customers, set, _iteratorNormalCompletion6, _didIteratorError6, _iteratorError6, _iterator6, _step6, customer;

        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.prev = 0;
                _context19.next = 3;
                return stushInstance.stripe.customers.list(args);

              case 3:
                customers = _context19.sent;
                set = [];
                _iteratorNormalCompletion6 = true;
                _didIteratorError6 = false;
                _iteratorError6 = undefined;
                _context19.prev = 8;

                for (_iterator6 = customers.data[Symbol.iterator](); !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                  customer = _step6.value;

                  set.push(new Customer(stushInstance, customer));
                }
                _context19.next = 16;
                break;

              case 12:
                _context19.prev = 12;
                _context19.t0 = _context19["catch"](8);
                _didIteratorError6 = true;
                _iteratorError6 = _context19.t0;

              case 16:
                _context19.prev = 16;
                _context19.prev = 17;

                if (!_iteratorNormalCompletion6 && _iterator6.return) {
                  _iterator6.return();
                }

              case 19:
                _context19.prev = 19;

                if (!_didIteratorError6) {
                  _context19.next = 22;
                  break;
                }

                throw _iteratorError6;

              case 22:
                return _context19.finish(19);

              case 23:
                return _context19.finish(16);

              case 24:
                return _context19.abrupt("return", Promise.resolve(set));

              case 27:
                _context19.prev = 27;
                _context19.t1 = _context19["catch"](0);
                return _context19.abrupt("return", Promise.reject(_context19.t1));

              case 30:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this, [[0, 27], [8, 12, 16, 24], [17,, 19, 23]]);
      }));

      function fetchAll(_x21) {
        return _ref19.apply(this, arguments);
      }

      return fetchAll;
    }()
  }]);

  return Customer;
}();

exports.default = Customer;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("lodash/isArray");

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelSubscriptionValidator = exports.previewProrationValidator = exports.formatCustomerData = exports.validator = exports.cancelSubscriptionSchema = exports.previewProrationSchema = undefined;

var _unset2 = __webpack_require__(9);

var _unset3 = _interopRequireDefault(_unset2);

var _get2 = __webpack_require__(1);

var _get3 = _interopRequireDefault(_get2);

var _assignIn2 = __webpack_require__(0);

var _assignIn3 = _interopRequireDefault(_assignIn2);

var _has2 = __webpack_require__(2);

var _has3 = _interopRequireDefault(_has2);

var _omit2 = __webpack_require__(7);

var _omit3 = _interopRequireDefault(_omit2);

var _keys2 = __webpack_require__(10);

var _keys3 = _interopRequireDefault(_keys2);

var _pick2 = __webpack_require__(3);

var _pick3 = _interopRequireDefault(_pick2);

var _set2 = __webpack_require__(5);

var _set3 = _interopRequireDefault(_set2);

var _ceil2 = __webpack_require__(14);

var _ceil3 = _interopRequireDefault(_ceil2);

var _joi = __webpack_require__(8);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _joi2.default.object().keys({
  id: _joi2.default.string(),
  object: _joi2.default.string(),
  created: _joi2.default.number().positive(),
  currency: _joi2.default.string().allow(null),
  delinquent: _joi2.default.boolean(),
  discount: _joi2.default.object().allow(null),
  livemode: _joi2.default.boolean(),
  sources: _joi2.default.object(),
  subscriptions: _joi2.default.object(),
  email: _joi2.default.string().email().when("id", { is: !_joi2.default.exist(), then: _joi2.default.required() }),
  metadata: _joi2.default.object(),
  source: _joi2.default.string().token(),
  default_source: _joi2.default.string().token().allow(null),
  account_balance: _joi2.default.number().min(0),
  business_vat_id: _joi2.default.string().allow(null),
  coupon: _joi2.default.string().allow(null),
  description: _joi2.default.string().allow(null),
  shipping: _joi2.default.object().keys({
    name: _joi2.default.string().required(),
    phone: _joi2.default.string(),
    address: _joi2.default.object().keys({
      line1: _joi2.default.string().required(),
      city: _joi2.default.string(),
      country: _joi2.default.string(),
      line2: _joi2.default.string(),
      postal_code: _joi2.default.string(),
      state: _joi2.default.string()
    }).required()
  }).allow(null)
});

var previewProrationSchema = exports.previewProrationSchema = _joi2.default.object().keys({
  subscription: _joi2.default.alternatives([_joi2.default.string().token(), _joi2.default.object()]),
  cancellation_proration: _joi2.default.boolean().default(false),
  plan_to_change: _joi2.default.string(),
  plan: _joi2.default.string().when("cancellation_proration", { is: false, then: _joi2.default.required() }),
  prorate_from: _joi2.default.number().positive().when("cancellation_proration", { is: false, then: _joi2.default.required() })
});

var cancelSubscriptionSchema = exports.cancelSubscriptionSchema = _joi2.default.object().keys({
  subscription: _joi2.default.string().token(),
  cancel: _joi2.default.string().valid("now", "after_billing_cycle").default("now"),
  refund: _joi2.default.number().positive(),
  refund_value_from: _joi2.default.number().positive().default((0, _ceil3.default)(new Date().getTime() / 1000)).when("refund", { is: _joi2.default.exist(), then: _joi2.default.strip() })
});

var validator = exports.validator = function validator(input) {
  var allowImmutable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  // process the input
  var options = {};
  if (allowImmutable) {
    (0, _set3.default)(options, "allowUnknown", true);
  }
  var output = _joi2.default.validate(input, schema, options);
  if (output.error) {
    throw output.error;
  }
  if (!allowImmutable) {
    var mutableFields = ["metadata", "name", "statement_descriptor"];
    (0, _set3.default)(output, "value", stripEmptyObjects((0, _pick3.default)(input, mutableFields)));
  }
  return output;
};

var formatCustomerData = exports.formatCustomerData = function formatCustomerData(input) {
  var stripeCustomerKeys = ["id", "object", "email", "source", "default_source", "account_balance", "business_vat_id", "coupon", "description", "metadata", "created", "currency", "delinquent", "discount", "livemode", "shipping", "sources", "subscriptions"];
  console.log("First ", (0, _pick3.default)(input, (0, _keys3.default)((0, _omit3.default)(input, stripeCustomerKeys))));
  console.log("Remastered ", (0, _omit3.default)(input, stripeCustomerKeys));
  var metadata = (0, _pick3.default)(input, (0, _keys3.default)((0, _omit3.default)(input, stripeCustomerKeys)));
  if (!(0, _has3.default)(input, "metadata")) (0, _set3.default)(input, "metadata", {});
  (0, _assignIn3.default)((0, _get3.default)(input, "metadata"), metadata);
  deleteProperties(input, (0, _keys3.default)((0, _omit3.default)(input, stripeCustomerKeys)));
  return input;
};

var previewProrationValidator = exports.previewProrationValidator = function previewProrationValidator(input) {
  var output = _joi2.default.validate(input, previewProrationSchema);
  if (output.error) {
    throw output.error;
  }
  var subscription = (0, _get3.default)(input, "subscription"),
      subscriptionItem = subscription.fetchSubscriptionItem((0, _get3.default)(input, "plan_to_change", null));
  (0, _set3.default)(output, "value.plan_to_change", (0, _get3.default)(subscriptionItem, "plan.id"));
  (0, _set3.default)(output, "value.items", [{
    id: subscriptionItem.id,
    plan: (0, _get3.default)(input, "plan")
  }]);
  if ((0, _get3.default)(input, "cancellation_proration")) {
    (0, _set3.default)(output, "value.preview_cancellation_refund", true);
  } else {
    (0, _set3.default)(output, "value.preview_proration", true);
  }
  (0, _unset3.default)(output, "value.cancellation_proration");

  return output;
};

var cancelSubscriptionValidator = exports.cancelSubscriptionValidator = function cancelSubscriptionValidator(input) {
  if ((0, _has3.default)(input, "id")) {
    (0, _set3.default)(input, "subscription", (0, _get3.default)(input, "id"));
  }
  var output = _joi2.default.validate(input, cancelSubscriptionSchema, { stripUnknown: true });
  if (output.error) {
    throw output.error;
  }
  return output;
};

exports.default = schema;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _ceil2 = __webpack_require__(14);

var _ceil3 = _interopRequireDefault(_ceil2);

var _set2 = __webpack_require__(5);

var _set3 = _interopRequireDefault(_set2);

var _get2 = __webpack_require__(1);

var _get3 = _interopRequireDefault(_get2);

var _pick2 = __webpack_require__(3);

var _pick3 = _interopRequireDefault(_pick2);

var _has2 = __webpack_require__(2);

var _has3 = _interopRequireDefault(_has2);

var _assignIn2 = __webpack_require__(0);

var _assignIn3 = _interopRequireDefault(_assignIn2);

var _cloneDeep2 = __webpack_require__(6);

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by ravindra on 22/11/17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _schema = __webpack_require__(36);

var _schema2 = _interopRequireDefault(_schema);

var _schema3 = __webpack_require__(20);

var _schema4 = _interopRequireDefault(_schema3);

var _error = __webpack_require__(4);

var _error2 = _interopRequireDefault(_error);

var _plan = __webpack_require__(11);

var _plan2 = _interopRequireDefault(_plan);

var _invoice = __webpack_require__(13);

var _invoice2 = _interopRequireDefault(_invoice);

var _customer = __webpack_require__(18);

var _customer2 = _interopRequireDefault(_customer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Subscription = function () {
  function Subscription(stushInstance, subscriptionData) {
    _classCallCheck(this, Subscription);

    this.data = {};
    this._stush = {};

    this._stush = stushInstance;
    this.set(subscriptionData);
  }

  /**
   * Fetches all subscriptions.
   * @param stushInstance
   * @param args
   * @returns {Promise.<*>}
   */


  _createClass(Subscription, [{
    key: "set",


    /**
     * Setter method for data(Also formats and validates data being set).
     * @param data
     * @param allowImmutable
     */
    value: function set(data) {
      var allowImmutable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var updatedData = (0, _cloneDeep3.default)(this.data);
      (0, _assignIn3.default)(updatedData, data);
      debug(updatedData);
      updatedData = (0, _schema.formatSubscriptionData)(updatedData);
      debug(updatedData);
      (0, _schema.validator)(updatedData, allowImmutable);
      debug(updatedData);
      this.data = updatedData;
    }

    /**
     * Creates a new subscription if ID not present; otherwise, updates the subscription.
     * @returns {Promise.<*>}
     */

  }, {
    key: "save",
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var data, params;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                data = {};

                (0, _schema.stripConfigOptions)(this.data);

                if (!(0, _has3.default)(this.data, "id")) {
                  _context.next = 10;
                  break;
                }

                params = (0, _schema.validator)(this.data);
                _context.next = 7;
                return this._stush.stripe.subscriptions.update(this.data.id, params.value);

              case 7:
                data = _context.sent;
                _context.next = 13;
                break;

              case 10:
                _context.next = 12;
                return this._stush.stripe.subscriptions.create(this.data);

              case 12:
                data = _context.sent;

              case 13:
                this.set(data, true);
                return _context.abrupt("return", Promise.resolve(this));

              case 17:
                _context.prev = 17;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", Promise.reject(_context.t0));

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 17]]);
      }));

      function save() {
        return _ref.apply(this, arguments);
      }

      return save;
    }()

    /**
     * Populates the local subscription from Stripe.
     * @returns {Promise.<*>}
     */

  }, {
    key: "selfPopulate",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var stripeSubscription;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (this.data.id) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return", Promise.reject((0, _error2.default)("Please provide a valid subscription ID before self populating.")));

              case 2:
                _context2.prev = 2;
                _context2.next = 5;
                return this._stush.stripe.subscriptions.retrieve(this.data.id);

              case 5:
                stripeSubscription = _context2.sent;

                (0, _assignIn3.default)(this.data, stripeSubscription);
                return _context2.abrupt("return", Promise.resolve(this));

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](2);
                return _context2.abrupt("return", Promise.reject(_context2.t0));

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[2, 10]]);
      }));

      function selfPopulate() {
        return _ref2.apply(this, arguments);
      }

      return selfPopulate;
    }()

    /**
     * Creates a clone of the subscription instance.
     * @returns {Subscription}
     */

  }, {
    key: "clone",
    value: function clone() {
      return new Subscription(this._stush, (0, _cloneDeep3.default)(this.data));
    }

    /**
     * Returns data in JSON format.
     */

  }, {
    key: "toJson",
    value: function toJson() {
      return JSON.parse(JSON.stringify((0, _pick3.default)(this, ["data"])));
    }

    /**
     * Fetches a subscription item.
     * @param planId
     * @returns {*}
     */

  }, {
    key: "fetchSubscriptionItem",
    value: function fetchSubscriptionItem() {
      var planId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var subscriptionItems = (0, _get3.default)(this.data, "items.data");
      var requiredSubscriptionItem = void 0;
      if (planId) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = subscriptionItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var value = _step.value;

            if (planId === value.plan.id) {
              requiredSubscriptionItem = value;
              break;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (!requiredSubscriptionItem) {
          throw (0, _error2.default)("Specified customer is not subscribed to subscription with provided plan.");
        }
      } else {
        requiredSubscriptionItem = (0, _get3.default)(this.data, "items.data.[0]", {});
      }
      return requiredSubscriptionItem;
    }

    /**
     * Fetches the latest subscribed or modified plan.
     * @returns {Promise.<T>}
     */

  }, {
    key: "fetchLatestPlan",
    value: function fetchLatestPlan() {
      var subscriptionItems = (0, _get3.default)(this.data, "items.data");
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = subscriptionItems[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var value = _step2.value;

          if ((0, _has3.default)(value, "plan")) {
            return Promise.resolve((0, _get3.default)(value, "plan.id"));
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    /**
     * Changes the subscription(upgrades or downgrades).
     * @param subscription
     * @returns {Promise.<*>}
     */

  }, {
    key: "change",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(subscription) {
        var params, subscriptionItem, prorationEnabled, planToChange, newPlan, changeInBillingCycle, freeToPaid, upgradingPlan, chargeInstantly, invoice;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (subscription) {
                  _context3.next = 2;
                  break;
                }

                throw (0, _error2.default)("Subscription to change to is required.");

              case 2:
                _context3.prev = 2;
                params = {}, subscriptionItem = this.fetchSubscriptionItem();

                (0, _set3.default)(params, "items", (0, _get3.default)(subscription, "data.items"));
                (0, _set3.default)(params, "items[0].id", (0, _get3.default)(subscriptionItem, "id"));
                if ((0, _has3.default)(subscription, "data.tax_percent")) {
                  (0, _set3.default)(params, "tax_percent", (0, _get3.default)(subscription, "data.tax_percent", ""));
                }
                if ((0, _has3.default)(subscription, "data.billing")) {
                  (0, _set3.default)(params, "billing", (0, _get3.default)(subscription, "data.billing", "charge_automatically"));
                }
                if ((0, _has3.default)(subscription, "data.days_until_due")) {
                  (0, _set3.default)(params, "days_until_due", (0, _get3.default)(subscription, "data.days_until_due", 30));
                }
                prorationEnabled = this._stush.fetchProrationSetting();

                if (!(prorationEnabled === "all" || prorationEnabled === "change_subscription")) {
                  _context3.next = 14;
                  break;
                }

                (0, _set3.default)(params, "proration_date", (0, _get3.default)(subscription, "data.prorate_from", (0, _ceil3.default)(new Date() / 1000)));
                _context3.next = 17;
                break;

              case 14:
                if (!(0, _has3.default)(subscription, "data.prorate_from")) {
                  _context3.next = 16;
                  break;
                }

                return _context3.abrupt("return", Promise.reject({
                  isJoi: true,
                  details: [{
                    message: "Proration is disabled in configuration options.",
                    code: 500
                  }]
                }));

              case 16:
                (0, _set3.default)(params, "prorate", false);

              case 17:
                // Check if there is a change in billing period.
                planToChange = new _plan2.default(this._stush, {
                  id: (0, _get3.default)(this, "data.items.data[0].plan.id")
                });
                _context3.next = 20;
                return planToChange.selfPopulate();

              case 20:
                newPlan = new _plan2.default(this._stush, {
                  id: (0, _get3.default)(subscription, "data.items[0].plan", (0, _get3.default)(subscription, "data.items.data[0].plan.id"))
                });
                _context3.next = 23;
                return newPlan.selfPopulate();

              case 23:
                changeInBillingCycle = planToChange.getInterval() !== newPlan.getInterval(), freeToPaid = (0, _get3.default)(planToChange, "data.amount") === 0, upgradingPlan = (0, _get3.default)(newPlan, "data.amount") > (0, _get3.default)(planToChange, "data.amount"), chargeInstantly = this._stush.chargesInstantly();
                // Update the subscription.

                debug("Final params >>>>>>>>>>>>>>>>>>.  ", params);
                _context3.next = 27;
                return this._stush.stripe.subscriptions.update(this.data.id, params);

              case 27:
                this.data = _context3.sent;

                if (!(!changeInBillingCycle && !freeToPaid && upgradingPlan && chargeInstantly)) {
                  _context3.next = 33;
                  break;
                }

                // Create an invoice to initiate payment collection instantly.
                debug("Generating a new invoice.");
                invoice = new _invoice2.default(this._stush, {
                  customer: (0, _get3.default)(this, "data.customer"),
                  subscription: (0, _get3.default)(this, "data.id")
                });
                _context3.next = 33;
                return invoice.save();

              case 33:
                return _context3.abrupt("return", Promise.resolve(this));

              case 36:
                _context3.prev = 36;
                _context3.t0 = _context3["catch"](2);
                return _context3.abrupt("return", Promise.reject(_context3.t0));

              case 39:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[2, 36]]);
      }));

      function change(_x3) {
        return _ref3.apply(this, arguments);
      }

      return change;
    }()

    /**
     * Cancels the subscription.
     * @returns {Promise.<*>}
     */

  }, {
    key: "cancel",
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
        var response, refundParams, input, atPeriodEnd, customer, prorationEnabled, invoice, upcomingInvoice, refundData, prorationCost, params, refund;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if ((0, _has3.default)(this, "data.id")) {
                  _context4.next = 2;
                  break;
                }

                throw (0, _error2.default)("Please populate the Subscription instance before attempting to cancel it.");

              case 2:
                _context4.prev = 2;
                response = {}, refundParams = {}, input = (0, _schema3.cancelSubscriptionValidator)((0, _get3.default)(this, "data", {}));
                atPeriodEnd = input.value.cancel === "after_billing_cycle";

                if ((0, _has3.default)(this, "data.customer")) {
                  _context4.next = 8;
                  break;
                }

                _context4.next = 8;
                return this.selfPopulate();

              case 8:
                customer = new _customer2.default(this._stush, {
                  id: (0, _get3.default)(this, "data.customer")
                });
                _context4.next = 11;
                return customer.selfPopulate();

              case 11:
                // Check input with stush configuration options.
                prorationEnabled = this._stush.fetchProrationSetting();

                if (!(prorationEnabled && !atPeriodEnd && ((0, _has3.default)(input, "value.refund") || (0, _has3.default)(input, "value.refund_value_from")))) {
                  _context4.next = 27;
                  break;
                }

                _context4.next = 15;
                return customer.fetchAnInvoice({
                  subscription: this.data.id
                });

              case 15:
                invoice = _context4.sent;

                (0, _set3.default)(refundParams, "charge", (0, _get3.default)(invoice, "data.charge"));

                if (!(0, _has3.default)(input, "value.refund")) {
                  _context4.next = 21;
                  break;
                }

                (0, _set3.default)(refundParams, "amount", (0, _get3.default)(input, "value.refund"));
                _context4.next = 27;
                break;

              case 21:
                _context4.next = 23;
                return customer.fetchUpcomingInvoice({
                  preview_cancellation_refund: true,
                  customer: (0, _get3.default)(this, "data.id"),
                  subscription: (0, _get3.default)(this, "data.id"),
                  refund_value_from: (0, _get3.default)(input, "value.refund_value_from")
                });

              case 23:
                upcomingInvoice = _context4.sent;
                refundData = upcomingInvoice.calculateProration((0, _get3.default)(input, "value.refund_value_from"));
                prorationCost = (0, _get3.default)(refundData, "proration_cost");

                if (Math.sign(prorationCost) === -1 || Math.sign(prorationCost) === -0) {
                  (0, _set3.default)(refundParams, "amount", Math.abs(prorationCost));
                }

              case 27:
                params = {};

                if (atPeriodEnd) {
                  (0, _set3.default)(params, "at_period_end", true);
                }
                _context4.next = 31;
                return this._stush.stripe.subscriptions.del(this.data.id, params);

              case 31:
                this.data = _context4.sent;


                (0, _set3.default)(response, "subscription", this.toJson());
                (0, _set3.default)(response, "refund", null);

                if (!(!atPeriodEnd && ((0, _has3.default)(input, "value.refund") || (0, _has3.default)(input, "value.refund_value_from")))) {
                  _context4.next = 39;
                  break;
                }

                _context4.next = 37;
                return customer.refund(refundParams);

              case 37:
                refund = _context4.sent;

                (0, _set3.default)(response, "refund", refund.toJson());

              case 39:
                return _context4.abrupt("return", Promise.resolve(response));

              case 42:
                _context4.prev = 42;
                _context4.t0 = _context4["catch"](2);
                return _context4.abrupt("return", Promise.reject(_context4.t0));

              case 45:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[2, 42]]);
      }));

      function cancel() {
        return _ref4.apply(this, arguments);
      }

      return cancel;
    }()
  }], [{
    key: "fetchAll",
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(stushInstance) {
        var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var subscriptions, set, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, subscription;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return stushInstance.stripe.subscriptions.list(args);

              case 3:
                subscriptions = _context5.sent;
                set = [];
                _iteratorNormalCompletion3 = true;
                _didIteratorError3 = false;
                _iteratorError3 = undefined;
                _context5.prev = 8;

                for (_iterator3 = subscriptions.data[Symbol.iterator](); !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  subscription = _step3.value;

                  set.push(new _invoice2.default(stushInstance, subscription));
                }
                _context5.next = 16;
                break;

              case 12:
                _context5.prev = 12;
                _context5.t0 = _context5["catch"](8);
                _didIteratorError3 = true;
                _iteratorError3 = _context5.t0;

              case 16:
                _context5.prev = 16;
                _context5.prev = 17;

                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }

              case 19:
                _context5.prev = 19;

                if (!_didIteratorError3) {
                  _context5.next = 22;
                  break;
                }

                throw _iteratorError3;

              case 22:
                return _context5.finish(19);

              case 23:
                return _context5.finish(16);

              case 24:
                return _context5.abrupt("return", Promise.resolve(set));

              case 27:
                _context5.prev = 27;
                _context5.t1 = _context5["catch"](0);
                return _context5.abrupt("return", Promise.reject(_context5.t1));

              case 30:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 27], [8, 12, 16, 24], [17,, 19, 23]]);
      }));

      function fetchAll(_x5) {
        return _ref5.apply(this, arguments);
      }

      return fetchAll;
    }()
  }]);

  return Subscription;
}();

exports.default = Subscription;


module.exports = Subscription;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(15);
module.exports = __webpack_require__(23);


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _has2 = __webpack_require__(2);

var _has3 = _interopRequireDefault(_has2);

var _assignIn2 = __webpack_require__(0);

var _assignIn3 = _interopRequireDefault(_assignIn2);

var _get2 = __webpack_require__(1);

var _get3 = _interopRequireDefault(_get2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stripe = __webpack_require__(24);

var _stripe2 = _interopRequireDefault(_stripe);

var _memoryCache = __webpack_require__(25);

var _memoryCache2 = _interopRequireDefault(_memoryCache);

var _validations = __webpack_require__(26);

var _validations2 = _interopRequireDefault(_validations);

var _plan = __webpack_require__(11);

var _plan2 = _interopRequireDefault(_plan);

var _coupon = __webpack_require__(31);

var _coupon2 = _interopRequireDefault(_coupon);

var _invoice = __webpack_require__(13);

var _invoice2 = _interopRequireDefault(_invoice);

var _customer = __webpack_require__(18);

var _customer2 = _interopRequireDefault(_customer);

var _subscription = __webpack_require__(21);

var _subscription2 = _interopRequireDefault(_subscription);

var _error = __webpack_require__(4);

var _error2 = _interopRequireDefault(_error);

var _utils = __webpack_require__(38);

var _betterQueue = __webpack_require__(42);

var _betterQueue2 = _interopRequireDefault(_betterQueue);

var _worker = __webpack_require__(43);

var _worker2 = _interopRequireDefault(_worker);

var _events = __webpack_require__(44);

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

if (!global._babelPolyfill) {
  __webpack_require__(15);
}


(0, _utils.makeUtilsGlobal)();

var Stush = function () {
  function Stush(options) {
    _classCallCheck(this, Stush);

    this.userOptions = {
      subscription_model: "multiple",
      proration: "change_subscription",
      charge_instantly: false,
      worker_instances: 1,
      cache: new _memoryCache2.default.Cache(),
      cache_plans: 24 * 3600
    };
    this.stripe = {};
    this._queue = new _betterQueue2.default(function (task, cb) {
      _worker2.default.process(task, cb);
    }, {
      concurrent: (0, _get3.default)(this, "userOptions.worker_instances", 1)
    });
    this._emitter = new _events2.default();

    this.validator = new _validations2.default();
    this.validator.validateStushOptions(options);
    (0, _assignIn3.default)(this.userOptions, options);
    this.stripe = new _stripe2.default((0, _get3.default)(this.userOptions, "secret"));
  }

  /**
   * Fetches webhook secret key for the Stush instance.
   */


  _createClass(Stush, [{
    key: "fetchWebhookSecret",
    value: function fetchWebhookSecret() {
      return (0, _get3.default)(this, "userOptions.webhook_secret", null);
    }

    /**
     * Fetches subscription model type for the Stush instance.
     */

  }, {
    key: "fetchModel",
    value: function fetchModel() {
      return (0, _get3.default)(this, "userOptions.subscription_model");
    }

    /**
     * Fetches proration setting for the Stush instance.
     */

  }, {
    key: "fetchProrationSetting",
    value: function fetchProrationSetting() {
      return (0, _get3.default)(this, "userOptions.proration");
    }

    /**
     * Fetches "charge_instantly" setting for the Stush instance.
     */

  }, {
    key: "chargesInstantly",
    value: function chargesInstantly() {
      return (0, _get3.default)(this, "userOptions.charge_instantly");
    }

    /**
     * Fetches cache instance for the Stush instance.
     */

  }, {
    key: "fetchCacheInstance",
    value: function fetchCacheInstance() {
      return (0, _get3.default)(this, "userOptions.cache");
    }

    /**
     * Fetches cache lifetime setting for the Stush instance.
     */

  }, {
    key: "fetchCacheLifetime",
    value: function fetchCacheLifetime() {
      return (0, _get3.default)(this, "userOptions.cache_plans");
    }

    /**
     * Creates a new plan.
     * @param args
     * @returns {Promise.<*>}
     */

  }, {
    key: "createPlan",
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(args) {
        var input, plan;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                input = this.validator.createPlanInput(args);
                plan = new _plan2.default(this, input.value);
                _context.next = 5;
                return plan.save();

              case 5:
                return _context.abrupt("return", Promise.resolve(plan));

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](0);

                if (!(0, _get3.default)(_context.t0, "isJoi", null)) {
                  _context.next = 12;
                  break;
                }

                return _context.abrupt("return", Promise.reject((0, _error2.default)(_context.t0.details)));

              case 12:
                return _context.abrupt("return", Promise.reject((0, _error2.default)(null, _context.t0)));

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 8]]);
      }));

      function createPlan(_x) {
        return _ref.apply(this, arguments);
      }

      return createPlan;
    }()

    /**
     * Deletes a plan.
     * @param planId
     * @returns {Promise.<*>}
     */

  }, {
    key: "deletePlan",
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(planId) {
        var plan;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                plan = new _plan2.default(this, { id: planId });
                _context2.next = 4;
                return plan.delete();

              case 4:
                return _context2.abrupt("return", Promise.resolve(plan));

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);

                if (!(0, _get3.default)(_context2.t0, "isJoi", null)) {
                  _context2.next = 11;
                  break;
                }

                return _context2.abrupt("return", Promise.reject((0, _error2.default)(_context2.t0.details)));

              case 11:
                return _context2.abrupt("return", Promise.reject((0, _error2.default)(null, _context2.t0)));

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 7]]);
      }));

      function deletePlan(_x2) {
        return _ref2.apply(this, arguments);
      }

      return deletePlan;
    }()

    /**
     * Fetches all plans.
     * @param args
     * @returns {Promise.<*>}
     */

  }, {
    key: "fetchAllPlans",
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(args) {
        var plans;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return _plan2.default.fetchAll(this, args);

              case 3:
                plans = _context3.sent;
                return _context3.abrupt("return", Promise.resolve(plans));

              case 7:
                _context3.prev = 7;
                _context3.t0 = _context3["catch"](0);

                if (!(0, _get3.default)(_context3.t0, "isJoi", null)) {
                  _context3.next = 11;
                  break;
                }

                return _context3.abrupt("return", Promise.reject((0, _error2.default)(_context3.t0.details)));

              case 11:
                return _context3.abrupt("return", Promise.reject((0, _error2.default)(null, _context3.t0)));

              case 12:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 7]]);
      }));

      function fetchAllPlans(_x3) {
        return _ref3.apply(this, arguments);
      }

      return fetchAllPlans;
    }()

    /**
     * Creates a new customer.
     * @param customerData
     * @returns {Promise.<*>}
     */

  }, {
    key: "createCustomer",
    value: function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(customerData) {
        var customer;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                customer = new _customer2.default(this, customerData);
                _context4.next = 4;
                return customer.save();

              case 4:
                return _context4.abrupt("return", Promise.resolve(customer));

              case 7:
                _context4.prev = 7;
                _context4.t0 = _context4["catch"](0);

                if (!(0, _get3.default)(_context4.t0, "isJoi", null)) {
                  _context4.next = 11;
                  break;
                }

                return _context4.abrupt("return", Promise.reject((0, _error2.default)(_context4.t0.details)));

              case 11:
                return _context4.abrupt("return", Promise.reject((0, _error2.default)(null, _context4.t0)));

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[0, 7]]);
      }));

      function createCustomer(_x4) {
        return _ref4.apply(this, arguments);
      }

      return createCustomer;
    }()

    /**
     * Fetches a customer.
     * @param customerId
     * @returns {Promise.<*>}
     */

  }, {
    key: "getCustomer",
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(customerId) {
        var customer;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                customer = new _customer2.default(this, { id: customerId });
                _context5.next = 4;
                return customer.selfPopulate();

              case 4:
                return _context5.abrupt("return", Promise.resolve(customer));

              case 7:
                _context5.prev = 7;
                _context5.t0 = _context5["catch"](0);
                return _context5.abrupt("return", Promise.reject(_context5.t0));

              case 10:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this, [[0, 7]]);
      }));

      function getCustomer(_x5) {
        return _ref5.apply(this, arguments);
      }

      return getCustomer;
    }()

    /**
     * Deletes a customer.
     * @param customerId
     * @returns {Promise.<*>}
     */

  }, {
    key: "deleteCustomer",
    value: function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(customerId) {
        var customer;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                customer = new _customer2.default(this, { id: customerId });
                _context6.next = 4;
                return customer.delete();

              case 4:
                return _context6.abrupt("return", Promise.resolve(customer));

              case 7:
                _context6.prev = 7;
                _context6.t0 = _context6["catch"](0);
                return _context6.abrupt("return", Promise.reject(_context6.t0));

              case 10:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[0, 7]]);
      }));

      function deleteCustomer(_x6) {
        return _ref6.apply(this, arguments);
      }

      return deleteCustomer;
    }()

    /**
     * Creates a new subscription (and customer, based on the arguments).
     * @param args
     * @returns {Promise.<*>}
     */

  }, {
    key: "createSubscription",
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(args) {
        var input, subscription, customer, resolved;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                input = this.validator.createSubscriptionInput(args);
                // debug("Vanguard validation: ", input.value);process.exit();

                if (input.error) {
                  _context7.next = 31;
                  break;
                }

                _context7.prev = 2;
                subscription = new _subscription2.default(this, (0, _get3.default)(input, "value.subscription")), customer = new _customer2.default(this, (0, _get3.default)(input, "value.customer"));

                if (!(0, _has3.default)(input, "value.customer.id")) {
                  _context7.next = 15;
                  break;
                }

                _context7.next = 7;
                return customer.selfPopulate();

              case 7:
                if (!(this.fetchModel() === "single")) {
                  _context7.next = 10;
                  break;
                }

                if (!customer.isSubscribed()) {
                  _context7.next = 10;
                  break;
                }

                return _context7.abrupt("return", Promise.reject((0, _error2.default)("Only one subscription is allowed per user in \"single subscription model\"")));

              case 10:
                _context7.next = 12;
                return customer.addSubscription(subscription);

              case 12:
                subscription = _context7.sent;
                _context7.next = 20;
                break;

              case 15:
                _context7.next = 17;
                return customer.save();

              case 17:
                _context7.next = 19;
                return customer.addSubscription(subscription);

              case 19:
                subscription = _context7.sent;

              case 20:
                resolved = {
                  data: {
                    customer: customer,
                    subscription: subscription
                  },
                  code: 200
                };
                return _context7.abrupt("return", Promise.resolve(resolved));

              case 24:
                _context7.prev = 24;
                _context7.t0 = _context7["catch"](2);

                if (!(0, _get3.default)(_context7.t0, "isJoi", null)) {
                  _context7.next = 28;
                  break;
                }

                return _context7.abrupt("return", Promise.reject((0, _error2.default)(_context7.t0.details)));

              case 28:
                return _context7.abrupt("return", Promise.reject((0, _error2.default)(null, _context7.t0)));

              case 29:
                _context7.next = 32;
                break;

              case 31:
                return _context7.abrupt("return", Promise.reject((0, _error2.default)(input.error.details)));

              case 32:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[2, 24]]);
      }));

      function createSubscription(_x7) {
        return _ref7.apply(this, arguments);
      }

      return createSubscription;
    }()

    /**
     * Changes a susbcription (upgrades or downgrades).
     * @param toSubscription
     * @param fromSubscription
     * @returns {Promise.<*>}
     */

  }, {
    key: "changeSubscription",
    value: function () {
      var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(toSubscription, fromSubscription) {
        var subscription;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (fromSubscription) {
                  _context8.next = 2;
                  break;
                }

                throw (0, _error2.default)("Subscription to change is required.");

              case 2:
                _context8.prev = 2;

                if ((0, _get3.default)(fromSubscription, "data.object", null)) {
                  _context8.next = 8;
                  break;
                }

                debug(fromSubscription);process.exit();
                _context8.next = 8;
                return fromSubscription.selfPopulate();

              case 8:
                subscription = fromSubscription.clone();
                _context8.next = 11;
                return subscription.change(toSubscription);

              case 11:
                return _context8.abrupt("return", Promise.resolve(subscription));

              case 14:
                _context8.prev = 14;
                _context8.t0 = _context8["catch"](2);

                if (!(0, _get3.default)(_context8.t0, "isJoi", null)) {
                  _context8.next = 18;
                  break;
                }

                return _context8.abrupt("return", Promise.reject((0, _error2.default)(_context8.t0.details)));

              case 18:
                return _context8.abrupt("return", Promise.reject((0, _error2.default)(null, _context8.t0)));

              case 19:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this, [[2, 14]]);
      }));

      function changeSubscription(_x8, _x9) {
        return _ref8.apply(this, arguments);
      }

      return changeSubscription;
    }()

    /**
     * Cancels a subscription.
     * @param subscription
     * @returns {Promise.<*>}
     */

  }, {
    key: "cancelSubscription",
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
        var subscription = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var subObj, response;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (subscription) {
                  _context9.next = 2;
                  break;
                }

                throw (0, _error2.default)("Subscription is required for cancellation.");

              case 2:
                _context9.prev = 2;

                if (!(typeof subscription === "string")) {
                  _context9.next = 8;
                  break;
                }

                subObj = new _subscription2.default(this, {
                  id: subscription
                });
                _context9.next = 7;
                return subObj.selfPopulate();

              case 7:
                subscription = subObj.clone();

              case 8:
                _context9.next = 10;
                return subscription.cancel();

              case 10:
                response = _context9.sent;
                return _context9.abrupt("return", Promise.resolve(response));

              case 14:
                _context9.prev = 14;
                _context9.t0 = _context9["catch"](2);

                if (!(0, _get3.default)(_context9.t0, "isJoi", null)) {
                  _context9.next = 18;
                  break;
                }

                return _context9.abrupt("return", Promise.reject((0, _error2.default)(_context9.t0.details)));

              case 18:
                return _context9.abrupt("return", Promise.reject((0, _error2.default)(null, _context9.t0)));

              case 19:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this, [[2, 14]]);
      }));

      function cancelSubscription() {
        return _ref9.apply(this, arguments);
      }

      return cancelSubscription;
    }()
  }, {
    key: "validateCoupon",
    value: function () {
      var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(couponCode) {
        var coupons, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, value;

        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.prev = 0;
                coupons = _coupon2.default.fetchAll(this);
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context10.prev = 5;
                _iterator = coupons[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context10.next = 14;
                  break;
                }

                value = _step.value;

                if (!(couponCode === (0, _get3.default)(value, "data.id"))) {
                  _context10.next = 11;
                  break;
                }

                return _context10.abrupt("return", Promise.resolve(value));

              case 11:
                _iteratorNormalCompletion = true;
                _context10.next = 7;
                break;

              case 14:
                _context10.next = 20;
                break;

              case 16:
                _context10.prev = 16;
                _context10.t0 = _context10["catch"](5);
                _didIteratorError = true;
                _iteratorError = _context10.t0;

              case 20:
                _context10.prev = 20;
                _context10.prev = 21;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 23:
                _context10.prev = 23;

                if (!_didIteratorError) {
                  _context10.next = 26;
                  break;
                }

                throw _iteratorError;

              case 26:
                return _context10.finish(23);

              case 27:
                return _context10.finish(20);

              case 28:
                return _context10.abrupt("return", Promise.reject({
                  isJoi: true,
                  details: {
                    message: "Invalid coupon code!",
                    code: 404
                  }
                }));

              case 31:
                _context10.prev = 31;
                _context10.t1 = _context10["catch"](0);
                return _context10.abrupt("return", Promise.reject(_context10.t1));

              case 34:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this, [[0, 31], [5, 16, 20, 28], [21,, 23, 27]]);
      }));

      function validateCoupon(_x11) {
        return _ref10.apply(this, arguments);
      }

      return validateCoupon;
    }()
  }, {
    key: "processHook",
    value: function () {
      var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(rawBody, stripeSignature) {
        var stripeEvent;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.prev = 0;
                _context11.next = 3;
                return this._validateRawBody(rawBody);

              case 3:
                _context11.next = 5;
                return this._verifyHook(rawBody, stripeSignature);

              case 5:
                stripeEvent = _context11.sent;
                _context11.next = 8;
                return this.addToQueue(stripeEvent);

              case 8:
                return _context11.abrupt("return", Promise.resolve(stripeEvent));

              case 11:
                _context11.prev = 11;
                _context11.t0 = _context11["catch"](0);
                return _context11.abrupt("return", Promise.reject(_context11.t0));

              case 14:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this, [[0, 11]]);
      }));

      function processHook(_x12, _x13) {
        return _ref11.apply(this, arguments);
      }

      return processHook;
    }()
  }, {
    key: "_validateRawBody",
    value: function () {
      var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(body) {
        var validJson;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.prev = 0;
                validJson = JSON.parse(body);
                return _context12.abrupt("return", Promise.resolve(validJson));

              case 5:
                _context12.prev = 5;
                _context12.t0 = _context12["catch"](0);
                return _context12.abrupt("return", _context12.t0);

              case 8:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this, [[0, 5]]);
      }));

      function _validateRawBody(_x14) {
        return _ref12.apply(this, arguments);
      }

      return _validateRawBody;
    }()
  }, {
    key: "addToQueue",
    value: function () {
      var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(stripeEvent) {
        var params;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.prev = 0;
                params = {
                  stushInstance: this,
                  stripeEvent: stripeEvent
                };

                this._queue.push(params);
                _context13.next = 8;
                break;

              case 5:
                _context13.prev = 5;
                _context13.t0 = _context13["catch"](0);
                return _context13.abrupt("return", Promise.reject(_context13.t0));

              case 8:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this, [[0, 5]]);
      }));

      function addToQueue(_x15) {
        return _ref13.apply(this, arguments);
      }

      return addToQueue;
    }()
  }, {
    key: "on",
    value: function () {
      var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(event, callback) {
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.prev = 0;

                this._emitter.on(event, function () {
                  setImmediate(callback);
                });
                this._emitter.listeners(event);
                _context14.next = 8;
                break;

              case 5:
                _context14.prev = 5;
                _context14.t0 = _context14["catch"](0);
                return _context14.abrupt("return", Promise.reject(_context14.t0));

              case 8:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this, [[0, 5]]);
      }));

      function on(_x16, _x17) {
        return _ref14.apply(this, arguments);
      }

      return on;
    }()

    /**
     * Verifies webhook from Stripe.
     * @param body
     * @param sig
     * @returns {Promise.<*>}
     */

  }, {
    key: "_verifyHook",
    value: function () {
      var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(body, sig) {
        var secret, response;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.prev = 0;
                secret = this.fetchWebhookSecret();
                _context15.next = 4;
                return this.stripe.webhooks.constructEvent(body, sig, secret);

              case 4:
                response = _context15.sent;
                return _context15.abrupt("return", Promise.resolve(response));

              case 8:
                _context15.prev = 8;
                _context15.t0 = _context15["catch"](0);
                return _context15.abrupt("return", Promise.reject((0, _error2.default)(null, _context15.t0)));

              case 11:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this, [[0, 8]]);
      }));

      function _verifyHook(_x18, _x19) {
        return _ref15.apply(this, arguments);
      }

      return _verifyHook;
    }()
  }]);

  return Stush;
}();

// export default Stush;


module.exports = {
  Stush: Stush,
  Plan: _plan2.default,
  Coupon: _coupon2.default,
  Invoice: _invoice2.default,
  Customer: _customer2.default,
  Subscription: _subscription2.default
};

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("stripe");

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("memory-cache");

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _assignIn2 = __webpack_require__(0);

var _assignIn3 = _interopRequireDefault(_assignIn2);

var _omit2 = __webpack_require__(7);

var _omit3 = _interopRequireDefault(_omit2);

var _keys2 = __webpack_require__(10);

var _keys3 = _interopRequireDefault(_keys2);

var _pick2 = __webpack_require__(3);

var _pick3 = _interopRequireDefault(_pick2);

var _set2 = __webpack_require__(5);

var _set3 = _interopRequireDefault(_set2);

var _get2 = __webpack_require__(1);

var _get3 = _interopRequireDefault(_get2);

var _has2 = __webpack_require__(2);

var _has3 = _interopRequireDefault(_has2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by ravindra on 20/11/17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _joi = __webpack_require__(8);

var _joi2 = _interopRequireDefault(_joi);

var _error = __webpack_require__(4);

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var stushOptionsSchema = _joi2.default.object().keys({
  secret: _joi2.default.string().token().required(),
  webhook_secret: _joi2.default.string().token(),
  subscription_model: _joi2.default.string().valid("single", "multiple"),
  proration: _joi2.default.string().valid("all", "none", "change_subscription", "cancel_subscription"),
  charge_instantly: _joi2.default.boolean()
});

var createPlanSchema = _joi2.default.object().keys({
  id: _joi2.default.string().required(),
  price: _joi2.default.number().min(0).required(),
  currency: _joi2.default.string().length(3, "utf8").required(),
  bill_every: _joi2.default.string().required(),
  name: _joi2.default.string().required(),
  metadata: _joi2.default.object(),
  statement_descriptor: _joi2.default.string()
});

var createSubscriptionSchema = _joi2.default.object().keys({
  customer: _joi2.default.alternatives([_joi2.default.object(), _joi2.default.string().token()]).required(),
  subscription: _joi2.default.object().keys({
    application_fee_percent: _joi2.default.number().positive().precision(2),
    billing: _joi2.default.string().valid("charge_automatically", "send_invoice").default("charge_automatically"),
    coupon: _joi2.default.string(),
    days_until_due: _joi2.default.alternatives().when("billing", { is: "send_invoice", then: _joi2.default.number().min(1).required(), otherwise: _joi2.default.strip() }),
    plan: _joi2.default.string().required(),
    plan_quantity: _joi2.default.number().positive(),
    source: _joi2.default.string().token(),
    tax_percent: _joi2.default.number().min(0).precision(2),
    trial_ends: _joi2.default.number().positive(),
    trial_days: _joi2.default.number().min(0)
  }).without("trial_ends", "trial_days").required()
}).required();

var cancelSubscriptionSchema = _joi2.default.object().keys({
  customer: _joi2.default.string().token().when("refund_value_from", { is: _joi2.default.exist(), then: _joi2.default.required() }),
  subscription: _joi2.default.string().token().when("customer", { is: !_joi2.default.exist(), then: _joi2.default.required() }),
  cancel: _joi2.default.string().valid("now", "after_billing_cycle").default("now"),
  refund: _joi2.default.number().positive(),
  refund_value_from: _joi2.default.number().positive().when("refund", { is: _joi2.default.exist(), then: _joi2.default.strip() })
});

var Validator = function () {
  function Validator() {
    _classCallCheck(this, Validator);
  }

  _createClass(Validator, [{
    key: "validateStushOptions",
    value: function validateStushOptions(options) {
      var result = _joi2.default.validate(options, stushOptionsSchema);
      if (result.error) {
        throw (0, _error2.default)(result.error.details);
      }
    }
  }, {
    key: "createPlanInput",
    value: function createPlanInput(args) {
      var result = _joi2.default.validate(args, createPlanSchema, { allowUnknown: true });
      if (result.error) {
        throw result.error;
      }
      return result;
    }
  }, {
    key: "createSubscriptionInput",
    value: function createSubscriptionInput(args) {
      var result = _joi2.default.validate(args, createSubscriptionSchema, { allowUnknown: true });
      if ((0, _has3.default)(result, "value.customer")) {
        var customerInput = (0, _get3.default)(result, "value.customer");
        if (typeof customerInput === "string") {
          (0, _set3.default)(result, "value.customer", { id: customerInput });
        } else {
          var stripeCustomerKeys = ["email", "source", "default_source", "account_balance", "business_vat_id", "coupon", "description", "metadata"];
          var metadata = (0, _pick3.default)(customerInput, (0, _keys3.default)((0, _omit3.default)(customerInput, stripeCustomerKeys)));
          (0, _set3.default)(result, "value.customer.metadata", {});
          (0, _assignIn3.default)((0, _get3.default)(result, "value.customer.metadata"), metadata);
          (0, _set3.default)(result, "value.customer", deleteProperties((0, _get3.default)(result, "value.customer"), (0, _keys3.default)((0, _omit3.default)((0, _get3.default)(result, "value.customer"), stripeCustomerKeys))));
        }
      }
      return result;
    }
  }, {
    key: "cancelSubscriptionInput",
    value: function cancelSubscriptionInput(args) {
      var result = _joi2.default.validate(args, cancelSubscriptionSchema);
      if (result.error) {
        throw result.error;
      }
      return result;
    }
  }]);

  return Validator;
}();

exports.default = Validator;


module.exports = Validator;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatPlanData = exports.validator = undefined;

var _omit2 = __webpack_require__(7);

var _omit3 = _interopRequireDefault(_omit2);

var _keys2 = __webpack_require__(10);

var _keys3 = _interopRequireDefault(_keys2);

var _last2 = __webpack_require__(28);

var _last3 = _interopRequireDefault(_last2);

var _parseInt2 = __webpack_require__(29);

var _parseInt3 = _interopRequireDefault(_parseInt2);

var _head2 = __webpack_require__(17);

var _head3 = _interopRequireDefault(_head2);

var _split2 = __webpack_require__(30);

var _split3 = _interopRequireDefault(_split2);

var _has2 = __webpack_require__(2);

var _has3 = _interopRequireDefault(_has2);

var _get2 = __webpack_require__(1);

var _get3 = _interopRequireDefault(_get2);

var _pick2 = __webpack_require__(3);

var _pick3 = _interopRequireDefault(_pick2);

var _set2 = __webpack_require__(5);

var _set3 = _interopRequireDefault(_set2);

var _joi = __webpack_require__(8);

var _joi2 = _interopRequireDefault(_joi);

var _error = __webpack_require__(4);

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by ravindra on 28/11/17.
 */
var schema = _joi2.default.object().keys({
  id: _joi2.default.string().required(),
  object: _joi2.default.string().valid("plan"),
  amount: _joi2.default.number().min(0).required(),
  currency: _joi2.default.string().length(3, "utf8").required(),
  interval: _joi2.default.string().valid("day", "week", "month", "year").required(),
  interval_count: _joi2.default.number(),
  livemode: _joi2.default.boolean(),
  metadata: _joi2.default.object(),
  name: _joi2.default.string().required(),
  statement_descriptor: _joi2.default.string()
});

var validator = exports.validator = function validator(input) {
  var allowImmutable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var options = {};
  if (allowImmutable) {
    (0, _set3.default)(options, "allowUnknown", true);
  }
  var output = _joi2.default.validate(input, schema, options);
  if (output.error) {
    throw output.error;
  }
  if (!allowImmutable) {
    var mutableFields = ["metadata", "name", "statement_descriptor"];
    (0, _set3.default)(output, "value", stripEmptyObjects((0, _pick3.default)(input, mutableFields)));
  }
  return output;
};

var formatPlanData = exports.formatPlanData = function formatPlanData(input) {
  if ((0, _get3.default)(input, "price", null)) {
    (0, _set3.default)(input, "amount", (0, _get3.default)(input, "price"));
  }
  if ((0, _has3.default)(input, "bill_every")) {
    // Formatting interval input for stripe.
    var daily = ["day", "days", "daily", "everyday", "day-to-day"],
        weekly = ["week", "weeks", "weekly"],
        monthly = ["month", "months", "monthly"],
        yearly = ["year", "yearly"];
    var interval = (0, _get3.default)(input, "bill_every");
    var intervalArr = (0, _split3.default)((0, _get3.default)(input, "bill_every"), " ", 2);
    if (intervalArr.length > 1) {
      _joi2.default.attempt((0, _head3.default)(intervalArr), _joi2.default.number()); // throws if fails
      if ((0, _head3.default)(intervalArr) > 1) {
        (0, _set3.default)(input, "interval_count", (0, _parseInt3.default)((0, _head3.default)(intervalArr)));
      }
      interval = (0, _last3.default)(intervalArr);
    }
    if (daily.includes(interval)) {
      interval = "day";
    } else if (weekly.includes(interval)) {
      interval = "week";
    } else if (monthly.includes(interval)) {
      interval = "month";
    } else if (yearly.includes(interval)) {
      interval = "year";
    } else {
      throw (0, _error2.default)("Unable to parse \"bill_every\" value.");
    }
    (0, _set3.default)(input, "interval", interval);
  }
  // Formatting additional properties as metadata.
  var stripePlanKeys = ["id", "name", "object", "amount", "created", "currency", "livemode", "metadata", "interval", "interval_count", "trial_period_days", "statement_descriptor"];
  var metadata = (0, _pick3.default)(input, (0, _keys3.default)((0, _omit3.default)(input, stripePlanKeys)));
  (0, _set3.default)(input, "metadata", metadata);
  deleteProperties(input, (0, _keys3.default)((0, _omit3.default)(input, stripePlanKeys)));
  return input;
};

exports.default = schema;

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("lodash/last");

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("lodash/parseInt");

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = require("lodash/split");

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _get2 = __webpack_require__(1);

var _get3 = _interopRequireDefault(_get2);

var _assignIn2 = __webpack_require__(0);

var _assignIn3 = _interopRequireDefault(_assignIn2);

var _cloneDeep2 = __webpack_require__(6);

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by ravindra on 13/12/17.
 */
var Coupon = function () {
  function Coupon(stushInstance, data) {
    _classCallCheck(this, Coupon);

    this.data = {};
    this._stush = {};

    this._stush = stushInstance;
    this.set(data);
  }

  _createClass(Coupon, [{
    key: "set",
    value: function set(data) {
      var updatedData = (0, _cloneDeep3.default)(this.data);
      (0, _assignIn3.default)(updatedData, data);
      this.data = updatedData;
    }
  }, {
    key: "toJson",
    value: function toJson() {
      return JSON.parse(JSON.stringify((0, _get3.default)(this, "data")));
    }
  }], [{
    key: "fetchAll",
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(stushInstance) {
        var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var couponArray, coupons;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                couponArray = [];
                _context.next = 4;
                return stushInstance.stripe.coupons.list(args);

              case 4:
                coupons = _context.sent;

                coupons.data.forEach(function (value) {
                  couponArray.push(new Coupon(stushInstance, value));
                });
                return _context.abrupt("return", Promise.resolve(couponArray));

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", Promise.reject(_context.t0));

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 9]]);
      }));

      function fetchAll(_x2) {
        return _ref.apply(this, arguments);
      }

      return fetchAll;
    }()
  }]);

  return Coupon;
}();

exports.default = Coupon;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizePopulateWithUpcoming = exports.validator = undefined;

var _omit2 = __webpack_require__(7);

var _omit3 = _interopRequireDefault(_omit2);

var _assignIn2 = __webpack_require__(0);

var _assignIn3 = _interopRequireDefault(_assignIn2);

var _has2 = __webpack_require__(2);

var _has3 = _interopRequireDefault(_has2);

var _pick2 = __webpack_require__(3);

var _pick3 = _interopRequireDefault(_pick2);

var _set2 = __webpack_require__(5);

var _set3 = _interopRequireDefault(_set2);

var _joi = __webpack_require__(8);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = _joi2.default.object().keys({
  application_fee: _joi2.default.number().positive().allow(null),
  closed: _joi2.default.boolean(),
  description: _joi2.default.string().allow(null),
  forgiven: _joi2.default.boolean(),
  metadata: _joi2.default.object().allow(null),
  paid: _joi2.default.boolean(),
  statement_descriptor: _joi2.default.string().allow(null),
  tax_percent: _joi2.default.number().min(0).precision(2).allow(null)
}); /**
     * Created by ravindra on 27/11/17.
     */
var validator = exports.validator = function validator(input) {
  var allowImmutable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var options = {};
  if (allowImmutable) {
    (0, _set3.default)(options, "allowUnknown", true);
  }
  var output = _joi2.default.validate(input, schema, options);
  if (output.error) {
    throw output.error;
  }
  if (!allowImmutable) {
    var mutableFields = ["application_fee", "closed", "description", "forgiven", "metadata", "paid", "statement_descriptor", "tax_percent"];
    (0, _set3.default)(output, "value", stripEmptyObjects((0, _pick3.default)(input, mutableFields)));
  }
  return output;
};

var sanitizePopulateWithUpcoming = exports.sanitizePopulateWithUpcoming = function sanitizePopulateWithUpcoming(args) {
  var omit = [],
      params = {};
  if ((0, _has3.default)(args, "customer")) {
    omit.push("customer");
  }
  if ((0, _has3.default)(args, "subscription")) {
    omit.push("subscription");
  }
  (0, _assignIn3.default)(params, (0, _omit3.default)(args, omit));
  return params;
};

exports.default = schema;

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("lodash/startsWith");

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _get2 = __webpack_require__(1);

var _get3 = _interopRequireDefault(_get2);

var _assignIn2 = __webpack_require__(0);

var _assignIn3 = _interopRequireDefault(_assignIn2);

var _cloneDeep2 = __webpack_require__(6);

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by ravindra on 29/11/17.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _error = __webpack_require__(4);

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Source = function () {
  function Source(stushInstance, data) {
    _classCallCheck(this, Source);

    this.data = {};
    this._stush = {};

    this._stush = stushInstance;
    this.set(data);
  }

  _createClass(Source, [{
    key: "set",
    value: function set(data) {
      var updatedData = (0, _cloneDeep3.default)(this.data);
      (0, _assignIn3.default)(updatedData, data);
      this.data = updatedData;
    }

    /**
     * Returns data in JSON format.
     */

  }, {
    key: "toJson",
    value: function toJson() {
      return JSON.parse(JSON.stringify((0, _get3.default)(this, "data")));
    }
  }]);

  return Source;
}();

exports.default = Source;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _pick2 = __webpack_require__(3);

var _pick3 = _interopRequireDefault(_pick2);

var _assignIn2 = __webpack_require__(0);

var _assignIn3 = _interopRequireDefault(_assignIn2);

var _cloneDeep2 = __webpack_require__(6);

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by ravindra on 30/11/17.
 */
var Refund = function () {
  function Refund(stushInstance) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Refund);

    this.data = {};
    this._stush = {};

    this._stush = stushInstance;
    this.set(data);
  }

  _createClass(Refund, [{
    key: "set",
    value: function set(data) {
      var updatedData = (0, _cloneDeep3.default)(this.data);
      (0, _assignIn3.default)(updatedData, data);
      // TODO: Validate data here
      this.data = updatedData;
    }
  }, {
    key: "toJson",
    value: function toJson() {
      return JSON.parse(JSON.stringify((0, _pick3.default)(this, ["data"])));
    }
  }]);

  return Refund;
}();

exports.default = Refund;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeSubscriptionValidator = exports.formatChangeSubscriptionInput = exports.stripConfigOptions = exports.formatSubscriptionData = exports.validator = exports.changeSubscriptionSchema = undefined;

var _isArray2 = __webpack_require__(19);

var _isArray3 = _interopRequireDefault(_isArray2);

var _assignIn2 = __webpack_require__(0);

var _assignIn3 = _interopRequireDefault(_assignIn2);

var _remove2 = __webpack_require__(12);

var _remove3 = _interopRequireDefault(_remove2);

var _omit2 = __webpack_require__(7);

var _omit3 = _interopRequireDefault(_omit2);

var _keys2 = __webpack_require__(10);

var _keys3 = _interopRequireDefault(_keys2);

var _isString2 = __webpack_require__(16);

var _isString3 = _interopRequireDefault(_isString2);

var _concat2 = __webpack_require__(37);

var _concat3 = _interopRequireDefault(_concat2);

var _pick2 = __webpack_require__(3);

var _pick3 = _interopRequireDefault(_pick2);

var _set2 = __webpack_require__(5);

var _set3 = _interopRequireDefault(_set2);

var _has2 = __webpack_require__(2);

var _has3 = _interopRequireDefault(_has2);

var _unset2 = __webpack_require__(9);

var _unset3 = _interopRequireDefault(_unset2);

var _get2 = __webpack_require__(1);

var _get3 = _interopRequireDefault(_get2);

var _joi = __webpack_require__(8);

var _joi2 = _interopRequireDefault(_joi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stripeSubscriptionKeys = ["id", "object", "application_fee_percent", "billing", "cancel_at_period_end", "canceled_at", "created", "current_period_end", "current_period_start", "customer", "discount", "ended_at", "livemode", "quantity", "start", "status", "trial_end", "trial_start", "coupon", "days_until_due", "items", "source", "metadata", "prorate", "proration_date", "tax_percent", "trial_period_days", "trial_ends"];

// Configuration options for operations on subscription
/**
 * Created by ravindra on 23/11/17.
 */
var configOptionKeys = ["cancellation_proration", "prorate_from", "cancel", "refund", "refund_value_from"];

var schema = _joi2.default.object().keys({
  id: _joi2.default.string().token(),
  customer: _joi2.default.string().token(),
  application_fee_percent: _joi2.default.number().positive().precision(2).allow(null),
  billing: _joi2.default.string().valid("charge_automatically", "send_invoice").default("charge_automatically"),
  coupon: _joi2.default.string(),
  days_until_due: _joi2.default.number().when("billing", { is: "send_invoice", then: _joi2.default.number().min(1).required() }).allow(null),
  items: _joi2.default.alternatives([_joi2.default.array().items(_joi2.default.object().keys({
    id: _joi2.default.string().token(),
    deleted: _joi2.default.boolean(),
    metadata: _joi2.default.object(),
    plan: _joi2.default.string().when("id", { is: !_joi2.default.exist(), then: _joi2.default.required() }),
    quantity: _joi2.default.number().min(0)
  })), _joi2.default.object()]),
  metadata: _joi2.default.object(),
  prorate: _joi2.default.boolean(),
  proration_date: _joi2.default.number().positive(),
  source: _joi2.default.string().token(),
  tax_percent: _joi2.default.number().min(0).precision(2).allow(null),
  trial_ends: _joi2.default.number().positive(),
  trial_period_days: _joi2.default.number().positive() // Only during creation of subscription.
});

var changeSubscriptionSchema = exports.changeSubscriptionSchema = _joi2.default.object().keys({
  subscription: _joi2.default.alternatives([_joi2.default.string().token(), _joi2.default.object()]),
  plan_to_change: _joi2.default.string(),
  plan: _joi2.default.string().required(),
  prorate_from: _joi2.default.number().positive()
});

var validator = exports.validator = function validator(input) {
  var allowImmutable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var output = _joi2.default.validate(input, schema, { allowUnknown: true });
  if (output.error) {
    throw output.error;
  }
  if ((0, _get3.default)(output, "value.billing", false) !== "send_invoice") {
    (0, _unset3.default)(output, "value.days_until_due");
  }
  if (!allowImmutable) {
    var mutableFields = ["application_fee_percent", "billing", "coupon", "days_until_due", "items", "source", "metadata", "prorate", "proration_date", "tax_percent", "trial_ends"];
    if (!(0, _has3.default)(input, "id")) {
      mutableFields.push("trial_period_days");
    }
    (0, _set3.default)(output, "value", stripEmptyObjects((0, _pick3.default)(input, mutableFields)));
  }
  return output;
};

var formatSubscriptionData = exports.formatSubscriptionData = function formatSubscriptionData(input) {
  var immuneKeys = (0, _concat3.default)(stripeSubscriptionKeys, configOptionKeys);
  if ((0, _has3.default)(input, "plan") && !(0, _isString3.default)((0, _get3.default)(input, "plan"))) {
    immuneKeys.push("plan");
  } else {
    if (!(0, _has3.default)(input, "items")) {
      (0, _set3.default)(input, "items", []);
      input.items.push({
        plan: (0, _get3.default)(input, "plan"),
        quantity: (0, _get3.default)(input, "plan_quantity", 1)
      });
    }
  }
  if ((0, _get3.default)(input, "trial_days", 0) > 0) {
    (0, _set3.default)(input, "trial_period_days", (0, _get3.default)(input, "trial_days"));
  }
  (0, _unset3.default)(input, "trial_days");

  var picks = (0, _keys3.default)((0, _omit3.default)(input, immuneKeys));
  if ((0, _isString3.default)((0, _get3.default)(input, "plan"))) {
    (0, _remove3.default)(picks, function (element) {
      return element === "plan";
    });
  }
  var metadata = (0, _pick3.default)(input, picks);
  if (!(0, _has3.default)(input, "metadata")) (0, _set3.default)(input, "metadata", {});
  (0, _assignIn3.default)((0, _get3.default)(input, "metadata"), metadata);
  deleteProperties(input, (0, _keys3.default)((0, _omit3.default)(input, immuneKeys)));
  return input;
};

var stripConfigOptions = exports.stripConfigOptions = function stripConfigOptions(input) {
  return deleteProperties(input, configOptionKeys);
};

var formatChangeSubscriptionInput = exports.formatChangeSubscriptionInput = function formatChangeSubscriptionInput(input, from) {
  var output = {},
      subscriptionItem = from.fetchSubscriptionItem();
  if (!(0, _has3.default)(input, "data.items") || !(0, _isArray3.default)((0, _get3.default)(input, "data.items"))) {
    (0, _set3.default)(output, "value.items", [{
      id: subscriptionItem.id,
      plan: (0, _get3.default)(input, "plan")
    }]);
  }
  (0, _set3.default)(output, "value.plan_to_change", (0, _get3.default)(subscriptionItem, "plan.id"));
  return input;
};

var changeSubscriptionValidator = exports.changeSubscriptionValidator = function changeSubscriptionValidator(input) {
  var output = _joi2.default.validate(input, changeSubscriptionSchema);
  if (output.error) {
    throw output.error;
  }
  return output;
};

exports.default = schema;

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("lodash/concat");

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeUtilsGlobal = undefined;

var _fromPairs2 = __webpack_require__(39);

var _fromPairs3 = _interopRequireDefault(_fromPairs2);

var _remove2 = __webpack_require__(12);

var _remove3 = _interopRequireDefault(_remove2);

var _toPairs2 = __webpack_require__(40);

var _toPairs3 = _interopRequireDefault(_toPairs2);

var _unset2 = __webpack_require__(9);

var _unset3 = _interopRequireDefault(_unset2);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _util = __webpack_require__(41);

var _util2 = _interopRequireDefault(_util);

var _error = __webpack_require__(4);

var _error2 = _interopRequireDefault(_error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __development = "development" === "development";

var debug = function debug() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (!__development) return;
  // eslint-disable-next-line
  return console.log("\n--------------------------------------------------------------------------------\n", _util2.default.inspect(args, false, 15, true), "\n--------------------------------------------------------------------------------\n");
};

var deleteProperties = function deleteProperties(object, array) {
  array.forEach(function (value) {
    (0, _unset3.default)(object, value);
  });
  return object;
};

var stripEmptyObjects = function stripEmptyObjects(object) {
  if ((typeof object === "undefined" ? "undefined" : _typeof(object)) !== "object") {
    throw {
      isJoi: true,
      details: [{
        message: "Invalid argument. Argument of type 'object' expected.",
        code: 500
      }]
    };
  }
  var array = (0, _toPairs3.default)(object);
  (0, _remove3.default)(array, function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    return (typeof value === "undefined" ? "undefined" : _typeof(value)) === "object" && isEmpty(value);
  });
  return (0, _fromPairs3.default)(array);
};

var isEmpty = function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

var timeout = function timeout(ms) {
  return new Promise.resolve(setTimeout(ms));
};

var makeUtilsGlobal = exports.makeUtilsGlobal = function makeUtilsGlobal() {
  global.debug = debug;
  global.timeout = timeout;
  global.deleteProperties = deleteProperties;
  global.stripEmptyObjects = stripEmptyObjects;
};

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = require("lodash/fromPairs");

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = require("lodash/toPairs");

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = require("better-queue");

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _get2 = __webpack_require__(1);

var _get3 = _interopRequireDefault(_get2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by ravindra on 26/12/17.
 */
var Worker = function () {
  function Worker() {
    _classCallCheck(this, Worker);
  }

  _createClass(Worker, null, [{
    key: "process",
    value: function process(task, cb) {
      try {
        // TODO: Logic to emit the received events
        console.log("\n\n\n\n\nEMITTING EVENT!\n\n\n\n\n");
        task.stushInstance._emitter.emit((0, _get3.default)(task, "stripeEvent.type", "unidentified_event"));
        cb(null, {
          type: (0, _get3.default)(task, "stripeEvent.type", "unidentified_event"),
          event: (0, _get3.default)(task, "stripeEvent", {})
        });
      } catch (err) {
        cb(err, null);
      }
    }
  }]);

  return Worker;
}();

exports.default = Worker;

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ })
/******/ ]);
});
//# sourceMappingURL=stush.js.map