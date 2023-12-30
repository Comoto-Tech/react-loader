(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['react', 'react-dom', 'spin.js', 'prop-types', 'create-react-class'], factory);
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(require('react'), require('react-dom'), require('spin.js'), require('prop-types'), require('create-react-class'));
  } else {
    root.Loader = factory(root.React, root.ReactDOM, root.Spinner, root.PropTypes, root.createReactClass);
  }

}(this, function (React, ReactDOM, Spinner, PropTypes, createReactClass) {

  var Loader = createReactClass({
    propTypes: {
      className:       PropTypes.string,
      color:           PropTypes.string,
      component:       PropTypes.any,
      corners:         PropTypes.number,
      direction:       PropTypes.oneOf([1, -1]),
      fps:             PropTypes.number,
      hwaccell:        PropTypes.bool,
      left:            PropTypes.string,
      length:          PropTypes.number,
      lines:           PropTypes.number,
      loaded:          PropTypes.bool,
      loadedClassName: PropTypes.string,
      opacity:         PropTypes.number,
      options:         PropTypes.object,
      parentClassName: PropTypes.string,
      position:        PropTypes.string,
      radius:          PropTypes.number,
      rotate:          PropTypes.number,
      scale:           PropTypes.number,
      shadow:          PropTypes.bool,
      speed:           PropTypes.number,
      top:             PropTypes.string,
      trail:           PropTypes.number,
      width:           PropTypes.number,
      zIndex:          PropTypes.number
    },

    getDefaultProps: function () {
      return {
        component: 'div',
        loadedClassName: 'loadedContent',
        parentClassName: 'loader'
      };
    },

    getInitialState: function () {
      return {
        loaded: this.isLoaded(this.props),
        options: this.getOptions(this.props)
      };
    },

    componentDidMount: function () {
      if (!this.isLoaded(this.props)) {
        this.spin();
      }
    },

    componentDidUpdate: function (prevProps) {
      if (!this.isLoaded(this.props)) {
        this.spin();
      } else if (this.spinner) {
        this.destroySpinner();
      }
    },

    componentWillUnmount: function () {
      this.destroySpinner();
      this.loaderNode = null;
      if (this.refs) {
        this.refs.loader = null;
      }
    },

    isLoaded: function (props) {
      props = props || this.props || {};
      return 'loaded' in props ? !!props.loaded : false;
    },

    getOptions: function (props) {
      props = props || this.props || {};

      var options = {};
      var propTypes = (this.constructor && this.constructor.propTypes) || Loader.propTypes || {};
      var allowedOptions = Object.keys(propTypes);

      var loadedIdx = allowedOptions.indexOf('loaded');
      if (loadedIdx > -1) {
        allowedOptions.splice(loadedIdx, 1);
      }

      var optionsIdx = allowedOptions.indexOf('options');
      if (optionsIdx > -1) {
        allowedOptions.splice(optionsIdx, 1);
      }

      var propsOrObjectOptions = ('options' in props && props.options) ? props.options : props;

      allowedOptions.forEach(function (key) {
        if (key in propsOrObjectOptions) {
          options[key] = propsOrObjectOptions[key];
        }
      });

      return options;
    },

    destroySpinner: function () {
      if (this.spinner) {
        this.spinner.stop();
        this.spinner = null;
      }
    },

    spin: function () {
      var canUseDOM = !!(
          typeof window !== 'undefined' &&
          window.document &&
          window.document.createElement
      );

      if (!canUseDOM || this.isLoaded(this.props)) {
        return;
      }

      var loaderRef = this.loaderNode || (this.refs && this.refs.loader);
      var target = loaderRef ? (ReactDOM.findDOMNode ? ReactDOM.findDOMNode(loaderRef) : loaderRef) : null;

      if (!target) {
        return;
      }

      this.destroySpinner();

      var options = this.getOptions(this.props);
      this.spinner = new Spinner(options);

      // Clear out any previous spinners/markup before mounting
      target.innerHTML = '';
      this.spinner.spin(target);
    },

    render: function () {
      var props, children;
      var self = this;

      if (this.isLoaded(this.props)) {
        props = { key: 'content', className: this.props.loadedClassName };
        children = this.props.children;
      } else {
        props = {
          key: 'loader',
          ref: function (node) {
            self.loaderNode = node;
            if (!self.refs) {
              self.refs = {};
            }
            self.refs.loader = node;
          },
          className: this.props.parentClassName
        };
      }

      return React.createElement(this.props.component, props, children);
    }
  });

  return Loader;

}));
