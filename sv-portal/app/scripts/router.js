// router
App.Router.map(function() {
    this.route("account");
    this.route("help");
    this.route('visualization');
    this.route('toolframe', { path: "/toolframe/:uri"} );
});

console.log(Ember.keys(App.Router.router.recognizer.names))
