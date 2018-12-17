let defaults = {
  src: null,
  id: null,
  container: document.body
};

/**
 * Script class
 *
 * Script class is used to generate and render script element inside head.
 */
class Script {
  /**
   * Script constructor.
   *
   * @param {Object} options - HTML content of the script.
   *
   * @returns {Script} Script object.
   */
  constructor(options) {
    this.options = Object.assign({}, defaults, options);

    this.scripts = this.options.scripts;
    this.container = this.options.container;
  }

  /**
   * Render method.
   *
   * Generate and render script element inside container.
   *
   * @returns {HTMLElement} Script document element.
   */
  render() {
    return new Promise(
      function(resolve, reject) {
        // Create a new blank script
        this.element = document.createElement("script");

        if (this.options.id) {
          this.element.id = this.options.id;
        }

        // Set type attribute
        this.element.type = "text/javascript";

        // Add onload and onerror callbacks
        this.element.onload = () => resolve(this.options.src);
        this.element.onerror = () => reject(this.options.src);

        // Append scripts inside script element
        this.element.src = this.options.src;

        // Use whatever method is needed to insert the script where you want it
        this.container.appendChild(this.element);
      }.bind(this)
    );
  }
}

export default Script;
