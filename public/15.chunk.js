webpackJsonpac__name_([15],{

/***/ "./src/app/services/ServiceUrl.ts":
/***/ function(module, exports) {

"use strict";
"use strict";
var ServiceUrl = (function () {
    function ServiceUrl() {
        this.baseUrl = "http://localhost:3000";
    }
    return ServiceUrl;
}());
exports.ServiceUrl = ServiceUrl;


/***/ },

/***/ "./src/app/services/UserService.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
__webpack_require__("./node_modules/rxjs/add/operator/map.js");
var http_1 = __webpack_require__("./node_modules/@angular/http/index.js");
var ServiceUrl_1 = __webpack_require__("./src/app/services/ServiceUrl.ts");
var UserService = (function () {
    function UserService(http) {
        this.http = http;
        this.serviceUrl = new ServiceUrl_1.ServiceUrl();
    }
    UserService.prototype.register = function (user) {
        var body = JSON.stringify(user);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" });
        var options = new http_1.RequestOptions({ method: 'post', headers: headers });
        console.log(body);
        return this.http.post(this.serviceUrl.baseUrl + "/users/addUser", body, options)
            .map(function (res) { return res.json(); });
    };
    UserService.prototype.login = function (Email, Password) {
        var body = JSON.stringify({ Email: Email, Password: Password });
        var headers = new http_1.Headers({ 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*" });
        var options = new http_1.RequestOptions({ method: 'post', headers: headers });
        console.log(body);
        return this.http.post(this.serviceUrl.baseUrl + "/users/loginUser", body, options)
            .map(function (res) { return res.json(); });
    };
    UserService.prototype.getSubscribers = function () {
        return this.http.get(this.serviceUrl.baseUrl + "/subscribers/getSubscribers")
            .map(function (res) { return res.json(); });
    };
    UserService.prototype.getUsers = function () {
        return this.http.get(this.serviceUrl.baseUrl + "/purchase/getPurchasers")
            .map(function (res) { return res.json(); });
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof http_1.Http !== 'undefined' && http_1.Http) === 'function' && _a) || Object])
    ], UserService);
    return UserService;
    var _a;
}());
exports.UserService = UserService;


/***/ },

/***/ "./src/app/subscriber/subscriber.component.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var UserService_1 = __webpack_require__("./src/app/services/UserService.ts");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var Subscriber = (function () {
    function Subscriber(_userService, router) {
        var _this = this;
        this._userService = _userService;
        this.Email = "";
        this.Password = "";
        this.errorMessage = "";
        this.subscribers = [];
        this.router = router;
        this._userService.getSubscribers().subscribe(function (response) {
            if (response.code == 200) {
                _this.subscribers = response.data;
                console.log(_this.subscribers);
            }
        });
    }
    Subscriber = __decorate([
        core_1.Component({
            selector: 'subscriber',
            styles: [__webpack_require__("./src/app/subscriber/subscriber.style.scss")],
            template: __webpack_require__("./src/app/subscriber/subscriber.template.html"),
            encapsulation: core_1.ViewEncapsulation.None,
            providers: [UserService_1.UserService]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof UserService_1.UserService !== 'undefined' && UserService_1.UserService) === 'function' && _a) || Object, (typeof (_b = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _b) || Object])
    ], Subscriber);
    return Subscriber;
    var _a, _b;
}());
exports.Subscriber = Subscriber;


/***/ },

/***/ "./src/app/subscriber/subscriber.module.ts":
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var common_1 = __webpack_require__("./node_modules/@angular/common/index.js");
var forms_1 = __webpack_require__("./node_modules/@angular/forms/index.js");
var core_1 = __webpack_require__("./node_modules/@angular/core/index.js");
var router_1 = __webpack_require__("./node_modules/@angular/router/index.js");
var subscriber_component_1 = __webpack_require__("./src/app/subscriber/subscriber.component.ts");
exports.routes = [
    { path: '', component: subscriber_component_1.Subscriber, pathMatch: 'full' }
];
var SubscriberModule = (function () {
    function SubscriberModule() {
    }
    SubscriberModule.routes = exports.routes;
    SubscriberModule = __decorate([
        core_1.NgModule({
            declarations: [
                subscriber_component_1.Subscriber
            ],
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                router_1.RouterModule.forChild(exports.routes),
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], SubscriberModule);
    return SubscriberModule;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SubscriberModule;


/***/ },

/***/ "./src/app/subscriber/subscriber.style.scss":
/***/ function(module, exports) {

module.exports = ""

/***/ },

/***/ "./src/app/subscriber/subscriber.template.html":
/***/ function(module, exports) {

module.exports = "<h3>\n    Subscriber List\n</h3>\n<div class=\"row\">\n    <div class=\"col-lg-12\">\n        <section class=\"widget\" widget>\n            <div class=\"widget-body\">\n                <div class=\"col-md-3\" *ngFor=\"let subscriber of subscribers\">\n                    <p>{{subscriber.Email}}</p>\n                </div>\n            </div>\n        </section>\n    </div>\n</div>"

/***/ }

});
//# sourceMappingURL=15.map