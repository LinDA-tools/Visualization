// router
App.Router.map(function() {
    this.route("account");
    this.route("help");
    this.route('visualization', { path: "/visualization/:datasource_id"}); // dynamic segment
});

console.log(Ember.keys(App.Router.router.recognizer.names))
