// router
App.Router.map(function() {   
    this.route("visualization", {
        path: '/visualization/:source_type/:id'
    });
    this.route("datasource", {
        path: '/datasource/:name/:location/:graph/:format'
    });
});