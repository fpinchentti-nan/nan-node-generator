'use strict';
var yeoman = require('yeoman-generator');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.argument('name', {
            required: true,
            type: String,
            desc: 'The subgenerator name'
        });

        this.log('You called the NanNode subgenerator with the argument ' + this.name + '.');
    },

    writing: function () {
        this.classString = _.trim(_.capitalize(_.camelCase(this.name)));
        this.moduleString = _.trim(_.snakeCase(this.name));
        this.fileName = this.moduleString + '.js';
        this.template('controller.js', 'src/controllers/' + this.fileName);
    }
});
