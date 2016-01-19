/**
 * Creates a button object and adds it to the DOM.
 *
 * @constructor
 * @param {String}   name         Description of button
 * @param {String}   orientation  String indicating the orientation. Must be
 *                                either 'left' or 'right' at this moment.
 * @param {Object}   thisObj      The 'this' context of the callback function.
 * @param {Function} callback     The callback function that is called when the
 *                                button receives input.
 */
function Button(name, orientation, thisObj, callback) {
    this.name = name;

    // Create the container in which the text and button will be placed.
    this.container = $(document.createElement('div'))
        .addClass('parameter');

    // Place the container in the proper parameter container.
    if (orientation === 'left') {
        this.container.appendTo('#parameters_left');
    } else if (orientation === 'right') {
        this.container.appendTo('#parameters_right');
    } else {
        console.error("'orientation' must be either 'left' or 'right'.");
    }

    // Create the Button element and add it to the container.
    this.button = $(document.createElement('button'))
        .text(name)
        .appendTo(this.container)
        // Define the function that is to be called when the Button receives input.
        .on('click', function() {
            callback.call(thisObj);
        });
}

/**
 * Removes the Button's container and all child elements.
 * 
 * @return {jQuery} The removed jQuery object. 
 */
Button.prototype.remove = function() {
    return this.container.remove();
};
