var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    content: String 
}, {
    timestamps: true
});

var beerSchema = new Schema({
    name: String,
    style: {
        type: String, 
        enum: ['Lager', 'IPA', 'Piss Water', 'Stout', 'Craft']
    },
    bars: [{type: Schema.Types.ObjectId, ref: 'Bar'}],
    comments: [commentSchema]
}, {
    timestamps: true
});

beerSchema.post('remove', function(barDoc) {
	// obtain a reference to the Beer model
	var Bar = this.model('Bar');
	// find all beer docs that have this bar
	Bar.find({beers: beerDoc._id}, function(err, bars) {
		bars.forEach(function(barDoc) {
			// handy remove method on mongoose arrays
			barDoc.beers.remove(beerDoc._id);
			// no need to wait for async to finish, thus no callback
			barDoc.save();
		});
	});	
});


module.exports = mongoose.model('Beer', beerSchema);