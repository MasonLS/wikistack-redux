var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', { logging: false });


function urlTitlize(title){
	if(title) {
		return title.replace(/\s+/g, '_').replace(/\W/g, '');
	} else {
		return Math.random().toString(36).substring(2, 7);
	}
}

var Page = db.define('page', {
	title: {
		type: Sequelize.STRING,
		allowNull: false
	},
	urlTitle: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	content: {
		type: Sequelize.TEXT,
		allowNull: false
	},
	status: {
		type: Sequelize.ENUM,
		values: ['open', 'closed']
	},
	date: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW
	}
},{
	hooks: {
		beforeValidate: function(page, options){
			page.urlTitle = urlTitlize(page.title);
		},
	},
	getterMethods: {
		route: function(){
			return '/wiki/' + this.urlTitle;
		}
	}
});

var User = db.define('user', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
		validate: {
			isEmail: true
		}
	}
});

module.exports = {
	Page: Page,
	User: User
};