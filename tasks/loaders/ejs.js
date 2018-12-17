import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';

import ejs from 'ejs';

const schema = {
  type: 'object',
  properties: {
    delimiter: {
      type: 'string'
    },
    data: {
      type: 'object'
    },
  },
  additionalProperties: false
};

const defaults = {
  delimiter: '%',
  data: {}
};

export default function(source) {

  let options, data, html;

  options = getOptions(this);
  options = Object.assign({}, defaults, options);

  data = options.data;

  validateOptions(schema, options, 'EJS loader');

  // Filename is required by ejs to resolve file paths in ejs source files
  options.filename = this.resourcePath;

  html = ejs.render(source, data, options);

  return `export default ${ JSON.stringify(html) }`;
}
