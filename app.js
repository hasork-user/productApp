var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");


mongoose.connect("mongodb+srv://sand123:sand123@cluster0-t0jwv.gcp.mongodb.net/mux?retryWrites=true&w=majority", { useNewUrlParser: true });
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
mongoose.set("useFindAndModify", false);


var productSchema = mongoose.Schema({
	productName : String,
	image : String,
	description : String,
	rating : String,
	price : String,
	seller : String,
	manufacturer : String,
	discount : String
});
var Product = mongoose.model("Product", productSchema);

app.get("/", function(req,res){
	res.redirect("/home")
});

app.get("/home", function(req,res){
	Product.find({}, function(err,product){
		if(err){
			console.log(err);
		}else{
			res.render("home",{product:product});
		}
	});
});

app.get("/addProduct", function(req,res){
	res.render("addProduct");
});

app.post("/addProduct", function(req,res){
	req.body.product.body = req.sanitize(req.body.product.body)
	Product.create(req.body.product, function(err, product){
		if(err){
			console.log(err);
		}else{
			res.redirect("/addProduct");
		}
	});
});

app.get("/product/:id", function(req,res){
	var id = req.params.id;
	Product.findById(id)
		.exec(function(err,product){
			if(err){
				console.log(err);
			}else{
				res.render("product",{product:product});
			}
		});
});

app.get("/product/:id/edit", function(req,res){
	var id = req.params.id;
	Product.findById(id, function(err,product){
		if(err){
			console.log(err);
		}else{
			res.render("edit",{product:product});
		}
	});
});

app.put("/product/:id", function(req,res){
	req.body.product.body = req.sanitize(req.body.product.body);
	Product.findByIdAndUpdate(req.params.id,req.body.product, function(err, updatedProduct){
		if(err){
			console.log(err);
		}else{
			res.redirect("/home");
		}
	});
});

app.delete("/product/:id", function(req,res){
	Product.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		}else{
			res.redirect("/home");
		}
	});
});

app.listen(process.env.PORT,process.env.IP, function(){
	console.log("Started!");
});