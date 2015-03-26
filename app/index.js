'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.pkg = require('../package.json');
    },

    prompting: function () {
        var done = this.async();

        this.log(yosay(
            'Welcome to the transcendent ' + chalk.red('NanNode') + ' generator!'
        ));

        var prompts = [
        {
            type: 'input',
            name: 'applicationName',
            message: 'Please enter application name:',
            default: this.appname
        },
        {
            type: 'input',
            name: 'applicationDescription',
            message: 'Please enter application description:'
        },
        {
            type: 'input',
            name: 'authorName',
            message: 'Please enter your name:',
            default: 'someuser'
        },
        {
            type: 'input',
            name: 'authorEmail',
            message: 'Please enter your email:',
            default: 'someuser@mail.com',
            validate: function (email) {
                return /\S+@\S+/.test(email);
            }
        },
        {
            type: 'input',
            name: 'applicationMain',
            message: 'Please enter application main filename:',
            default: 'app.js'
        },
        {
            type: 'input',
            name: 'configurationFile',
            message: 'Please enter application main configuration (json) filename:',
            default: 'config.json',
            validate: function (filename) {
                return /.*\.json$/.test(filename);
            }
        },
        {
            type: 'list',
            name: 'applicationLicense',
            message: 'Please choose a software license for your new project:',
            choices: [ 'MIT', 'BSD', 'Apache', 'Don\'t care']
        },
        {
            type: 'confirm',
            name: 'libexpress',
            message: 'Would you like to include expressjs?',
            default: true
        },
        {
            type: 'confirm',
            name: 'useDb',
            message: 'Would you be using a database?',
            default: true
        },
        {
            type: 'list',
            name: 'whichDb',
            message: 'Which kind of database?',
            choices: [ 'mongodb', 'sql' ],
            when: function (answers) {
                return answers.useDb;
            }
        },
        {
            type: 'list',
            name: 'libmongo',
            message: 'Which mongo library use?',
            choices: [ 'mongojs', 'mongoose', 'promised-mongo' ],
            when: function (answers) {
                return answers.whichDb === 'mongodb';
            }
        },
        {
            type: 'list',
            name: 'libsql',
            message: 'Which sql library use?',
            choices: [ 'mysql', 'sequelize' ],
            when: function (answers) {
                return answers.whichDb === 'sql';
            }
        },
        {
            type: 'checkbox',
            name: 'libsMisc',
            message: 'Which other libs you\'d like to include?',
            choices: [ 'commander', 'lodash', 'q', 'request', 'underscore' ]
        }
        ];
        this.prompt(prompts, function (props) {
            // @todo add editorcofig support or set a default
            this.applicationName = _.trim(props.applicationName);
            this.applicationDescription = _.trim(props.applicationDescription);
            this.authorName = _.trim(props.authorName);
            this.authorEmail = props.authorEmail;
            if (props.applicationLicense && (props.applicationLicense !== 'Don\'t care')) {
                this.applicationLicense = props.applicationLicense;
            }
            this.applicationMain = _.trim(props.applicationMain);
            this.configurationFile = _.trim(props.configurationFile);
            // handling dependencies:
            this.libexpress = props.libexpress;
            this.useDb = props.useDb;
            this.whichDb = props.whichDb;
            this.applicationDeps = [];
            if (this.libexpress) {
                this.applicationDeps.push('express');
            }
            if (this.useDb) {
                if (this.libsql) {
                    this.applicationDeps.push(this.libsql);
                }else if (this.libmongo) {
                    this.applicationDeps.push(this.libmongo);
                }
            }
            if (props.libsMisc && props.libsMisc.indexOf('commander') !== -1) {
                this.applicationDeps.push('commander');
            }
            if (props.libsMisc && props.libsMisc.indexOf('request') !== -1) {
                this.applicationDeps.push('request');
            }
            if (props.libsMisc && props.libsMisc.indexOf('underscore') !== -1) {
                this.applicationDeps.push('underscore');
            }
            if (props.libsMisc && props.libsMisc.indexOf('lodash') !== -1) {
                this.applicationDeps.push('lodash');
            }
            if (props.libsMisc && props.libsMisc.indexOf('q') !== -1) {
                this.applicationDeps.push('q');
            }
            // finally:
            done();
        }.bind(this));
    },

    _buildDependenciesArray: function (props) {
        var applicationDeps = [];
        if (this.libexpress) {
            applicationDeps.push('express');
        }
        if (this.useDb) {
            if (this.libsql) {
                applicationDeps.push(this.libsql);
            }else if (this.libmongo) {
                applicationDeps.push(this.libmongo);
            }
        }
        if (props.libsMisc && props.libsMisc.indexOf('commander') !== -1) {
            applicationDeps.push('commander');
        }
        if (props.libsMisc && props.libsMisc.indexOf('request') !== -1) {
            applicationDeps.push('request');
        }
        if (props.libsMisc && props.libsMisc.indexOf('underscore') !== -1) {
            applicationDeps.push('underscore');
        }
        if (props.libsMisc && props.libsMisc.indexOf('lodash') !== -1) {
            applicationDeps.push('lodash');
        }
        if (props.libsMisc && props.libsMisc.indexOf('q') !== -1) {
            applicationDeps.push('q');
        }
        return applicationDeps;
    },

    writing: {
        app: function () {
            this.template('_package.json','package.json');
            this.template('main.js', this.applicationMain);
            this.template('config.json', this.configurationFile);
            this.mkdir('src');
            if (this.libexpress) {
                this.template('routes.js', 'src/routes.js');
            }
            this.mkdir('src/controllers');
        },

        projectfiles: function () {
            this.template('editorconfig', '.editorconfig');
            this.template('jshintrc', '.jshintrc');
        }
    },

    install: function () {
        this.installDependencies({
            npm: true,
            bower: false,
            skipInstall: this.options['skip-install']
        });
    }
});
