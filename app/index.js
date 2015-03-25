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

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the transcendent ' + chalk.red('NanNodejs') + ' generator!'
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
            message: 'Enter application main file:'
        },
        {
            type: 'input',
            name: 'configurationFile',
            default: 'config.json',
            message: 'Enter application main configuration file:'
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
            choices: [ 'mysql', 'mongodb' ],
            when: function (answers) {
                return answers.useDb;
            }
        },
        {
            type: 'checkbox',
            name: 'libsMisc',
            message: 'Which other libs you\d like to include?',
            choices: [ 'underscore', 'lodash', 'q' ]
        }
        ];
        this.prompt(prompts, function (props) {
            // @todo get author data from github
            // @see https://github.com/yeoman/generator-generator/blob/master/app/index.js
            this.applicationName = props.applicationName;
            this.applicationDescription = props.applicationDescription;
            if (props.applicationLicense && (props.applicationLicense !== 'Don\t care')) {
                this.applicationLicense = props.applicationLicense;
            }
            this.applicationMain = props.applicationMain;
            // @todo validate config file ending in .json:
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
                // @todo switch over genuine node db apis:
                this.applicationDeps.push(this.whichDb);
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
