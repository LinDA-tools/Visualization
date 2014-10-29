// router
App.Router.map(function() {
    this.route("upload");
    this.route("visualization", {
        path: '/visualization/:dataselection_id'
    });
});