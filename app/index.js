'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

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
            message: 'Please enter application name',
            default: this.appname
        },
        {
            type: 'input',
            name: 'applicationDescription',
            message: 'Please enter application description'
        },
        {
            type: 'input',
            name: 'applicationMain',
            default: 'app.js',
            message: 'Enter application main filename:'
        },
        {
            type: 'input',
            name: 'configurationFile',
            default: 'config.json',
            message: 'Enter application main configuration (json) filename:',
            validate: function (filename) {
                return /.*\.json$/.test(filename);
            }
        },
        {
            type: 'list',
            name: 'applicationLicense',
            message: 'Choose a software license to use:',
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
            message: 'Would you like to use a db?',
            default: true
        },
        {
            type: 'list',
            name: 'whichDb',
            message: 'Which one?',
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
            message: 'Which other libs you\d like to include?',
            choices: [ 'commander', 'lodash', 'q', 'request', 'underscore' ]
        }
        ];
        this.prompt(prompts, function (props) {
            // @todo add editorcofig support or set a default
            // @todo get author data
            this.applicationName = props.applicationName;
            this.applicationDescription = props.applicationDescription;
            if (props.applicationLicense && (props.applicationLicense !== 'Don\t care')) {
                this.applicationLicense = props.applicationLicense;
            }
            this.applicationMain = props.applicationMain;
            this.configurationFile = props.configurationFile;
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
