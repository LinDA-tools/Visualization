import Ember from "ember";

export default Ember.View.extend({
    slides: null,
    templateName:'slideShow',
    classNames:['slider'],
    didInsertElement: function() {
        this._super();
        
        console.log("Inserted slideshow: ");
        console.dir(this.get('slides'));
        
        this.$().slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 1
        });   
    },
    refreshView: function() {
        this.rerender();
    }.observes('slides.[]')
});
