/**
 * Defines <%= moduleString %> controller class and constructor function.
 *
 * @module <%= moduleString %>
 */

/**
 * <%= classString %> constructor
 * @constructor
 */
function <%= classString %> () {
}

<%= classString %>.prototype.getHandler = function (req, res) {
    res.send('Cheers from <%= classString %> get request handler.');
};

module.exports = <%= classString %>;
