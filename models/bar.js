var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var barSchema = new Schema({
    name: {type: String, required: true},
    location: String,
    beers: [{type: Schema.Types.ObjectId, ref: 'Beer'}],
}, {
    timestamps: true
});

barSchema.post('remove', function(barDoc) {
	// obtain a reference to the Beer model
	var Beer = this.model('Beer');
	// find all beer docs that have this bar
	Beer.find({bars: barDoc._id}, function(err, beers) {
		beers.forEach(function(beerDoc) {
			// handy remove method on mongoose arrays
			beerDoc.bars.remove(barDoc._id);
			// no need to wait for async to finish, thus no callback
			beerDoc.save();
		});
	});	
});


module.exports = mongoose.model('Bar', barSchema);