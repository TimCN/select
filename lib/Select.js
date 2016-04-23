'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _rcUtil = require('rc-util');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _OptGroup = require('./OptGroup');

var _OptGroup2 = _interopRequireDefault(_OptGroup);

var _rcAnimate = require('rc-animate');

var _rcAnimate2 = _interopRequireDefault(_rcAnimate);

var _util = require('./util');

var _SelectTrigger = require('./SelectTrigger');

var _SelectTrigger2 = _interopRequireDefault(_SelectTrigger);

var _FilterMixin = require('./FilterMixin');

var _FilterMixin2 = _interopRequireDefault(_FilterMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function noop() {}

function filterFn(input, child) {
    return String((0, _util.getPropValue)(child, this.props.optionFilterProp)).indexOf(input) > -1;
}

function saveRef(name, component) {
    this[name] = component;
}

var Select = _react2.default.createClass({
    displayName: 'Select',

    propTypes: {
        defaultActiveFirstOption: _react.PropTypes.bool,
        multiple: _react.PropTypes.bool,
        filterOption: _react.PropTypes.any,
        showSearch: _react.PropTypes.bool,
        disabled: _react.PropTypes.bool,
        allowClear: _react.PropTypes.bool,
        showArrow: _react.PropTypes.bool,
        tags: _react.PropTypes.bool,
        prefixCls: _react.PropTypes.string,
        className: _react.PropTypes.string,
        transitionName: _react.PropTypes.string,
        optionLabelProp: _react.PropTypes.string,
        extraDataField: _react.PropTypes.string,
        optionFilterProp: _react.PropTypes.string,
        animation: _react.PropTypes.string,
        choiceTransitionName: _react.PropTypes.string,
        onChange: _react.PropTypes.func,
        onSelect: _react.PropTypes.func,
        onSearch: _react.PropTypes.func,
        searchPlaceholder: _react.PropTypes.string,
        placeholder: _react.PropTypes.any,
        onDeselect: _react.PropTypes.func,
        labelInValue: _react.PropTypes.bool,
        value: _react.PropTypes.any,
        defaultValue: _react.PropTypes.any,
        dropdownStyle: _react.PropTypes.object,
        maxTagTextLength: _react.PropTypes.number
    },
    mixins: [_FilterMixin2.default],

    getDefaultProps: function getDefaultProps() {
        return {
            prefixCls: 'rc-select',
            filterOption: filterFn,
            defaultOpen: false,
            labelInValue: false,
            defaultActiveFirstOption: true,
            showSearch: true,
            allowClear: false,
            placeholder: '',
            searchPlaceholder: '',
            defaultValue: [],
            onChange: noop,
            onSelect: noop,
            onSearch: noop,
            onDeselect: noop,
            showArrow: true,
            dropdownMatchSelectWidth: true,
            dropdownStyle: {},
            dropdownMenuStyle: {},
            optionFilterProp: 'value',
            optionLabelProp: 'value',
            extraDataField: 'extra',
            notFoundContent: 'Not Found'
        };
    },
    getInitialState: function getInitialState() {
        var props = this.props;
        var value = [];
        if ('value' in props) {
            value = (0, _util.toArray)(props.value);
        } else {
            value = (0, _util.toArray)(props.defaultValue);
        }
        value = this.addLabelToValue(props, value);
        var inputValue = '';
        if (props.combobox) {
            inputValue = value.length ? String(value[0].key) : '';
        }
        this.saveInputRef = saveRef.bind(this, 'inputInstance');
        var open = props.open;
        if (open === undefined) {
            open = props.defaultOpen;
        }
        return {
            value: value,
            inputValue: inputValue,
            open: open
        };
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            var value = (0, _util.toArray)(nextProps.value);
            value = this.addLabelToValue(nextProps, value);
            this.setState({
                value: value
            });
            if (nextProps.combobox) {
                this.setState({
                    inputValue: value.length ? String(value[0].key) : ''
                });
            }
        }
    },
    componentDidUpdate: function componentDidUpdate() {
        var state = this.state;
        var props = this.props;
        if (state.open && (0, _util.isMultipleOrTags)(props)) {
            var inputNode = this.getInputDOMNode();
            if (inputNode.value) {
                inputNode.style.width = '';
                inputNode.style.width = inputNode.scrollWidth + 'px';
            } else {
                inputNode.style.width = '';
            }
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        this.clearDelayTimer();
        if (this.dropdownContainer) {
            _reactDom2.default.unmountComponentAtNode(this.dropdownContainer);
            document.body.removeChild(this.dropdownContainer);
            this.dropdownContainer = null;
        }
    },
    onInputChange: function onInputChange(event) {
        var val = event.target.value;
        var props = this.props;

        this.setState({
            inputValue: val,
            open: true
        });
        if ((0, _util.isCombobox)(props)) {
            this.fireChange([{
                key: val
            }]);
        }
        props.onSearch(val);
    },
    onDropdownVisibleChange: function onDropdownVisibleChange(open) {
        // selection inside combobox cause click
        if (!open && document.activeElement === this.getInputDOMNode()) {
            return;
        }
        this.setOpenState(open);
    },


    // combobox ignore
    onKeyDown: function onKeyDown(event) {
        var props = this.props;
        if (props.disabled) {
            return;
        }
        var keyCode = event.keyCode;
        if (this.state.open && !this.getInputDOMNode()) {
            this.onInputKeyDown(event);
        } else if (keyCode === _rcUtil.KeyCode.ENTER || keyCode === _rcUtil.KeyCode.DOWN) {
            this.setOpenState(true);
            event.preventDefault();
        }
    },
    onInputBlur: function onInputBlur() {
        var _this = this;

        if ((0, _util.isMultipleOrTagsOrCombobox)(this.props)) {
            return;
        }
        this.clearDelayTimer();
        this.delayTimer = setTimeout(function () {
            _this.setOpenState(false);
        }, 150);
    },
    onInputKeyDown: function onInputKeyDown(event) {
        var props = this.props;
        if (props.disabled) {
            return;
        }
        var state = this.state;
        var keyCode = event.keyCode;
        if ((0, _util.isMultipleOrTags)(props) && !event.target.value && keyCode === _rcUtil.KeyCode.BACKSPACE) {
            var value = state.value.concat();
            if (value.length) {
                var popValue = value.pop();
                props.onDeselect(props.labelInValue ? popValue : popValue.key);
                this.fireChange(value);
            }
            return;
        }
        if (keyCode === _rcUtil.KeyCode.DOWN) {
            if (!state.open) {
                this.openIfHasChildren();
                event.preventDefault();
                event.stopPropagation();
                return;
            }
        } else if (keyCode === _rcUtil.KeyCode.ESC) {
            if (state.open) {
                this.setOpenState(false);
                event.preventDefault();
                event.stopPropagation();
            }
            return;
        }

        if (state.open) {
            var menu = this.refs.trigger.getInnerMenu();
            if (menu && menu.onKeyDown(event)) {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    },
    onMenuSelect: function onMenuSelect(_ref) {
        var item = _ref.item;

        var value = this.state.value;
        var props = this.props;
        var selectedValue = (0, _util.getValuePropValue)(item);
        var selectedLabel = this.getLabelFromOption(item);
        var selectedExtra = this.getExtraDataFromOption(item);
        var event = selectedValue;
        if (props.labelInValue) {
            event = {
                key: event,
                label: selectedLabel
            };
        }
        props.onSelect(event, item);
        if ((0, _util.isMultipleOrTags)(props)) {
            if ((0, _util.findIndexInValueByKey)(value, selectedValue) !== -1) {
                return;
            }
            value = value.concat([{
                key: selectedValue,
                label: selectedLabel
            }]);
        } else {
            if (value.length && value[0].key === selectedValue) {
                this.setOpenState(false, true);
                return;
            }
            value = [{
                key: selectedValue,
                label: selectedLabel,
                extra: selectedExtra
            }];
            this.setOpenState(false, true);
        }
        this.fireChange(value);
        this.setState({
            inputValue: ''
        });
        if ((0, _util.isCombobox)(props)) {
            this.setState({
                inputValue: (0, _util.getPropValue)(item, props.optionLabelProp)
            });
        }
    },
    onMenuDeselect: function onMenuDeselect(_ref2) {
        var item = _ref2.item;
        var domEvent = _ref2.domEvent;

        if (domEvent.type === 'click') {
            this.removeSelected((0, _util.getValuePropValue)(item));
        }
        this.setState({
            inputValue: ''
        });
    },
    onPlaceholderClick: function onPlaceholderClick() {
        this.getInputDOMNode().focus();
    },
    onClearSelection: function onClearSelection(event) {
        var props = this.props;
        var state = this.state;
        if (props.disabled) {
            return;
        }
        event.stopPropagation();
        if (state.inputValue || state.value.length) {
            this.fireChange([]);
            this.setOpenState(false);
            this.setState({
                inputValue: ''
            });
        }
    },
    getLabelBySingleValue: function getLabelBySingleValue(children, value) {
        var _this2 = this;

        if (value === undefined) {
            return null;
        }
        var label = null;
        _react2.default.Children.forEach(children, function (child) {
            if (child.type === _OptGroup2.default) {
                var maybe = _this2.getLabelBySingleValue(child.props.children, value);
                if (maybe !== null) {
                    label = maybe;
                }
            } else if ((0, _util.getValuePropValue)(child) == value) {
                label = _this2.getLabelFromOption(child);
            }
        });
        return label;
    },
    getLabelFromOption: function getLabelFromOption(child) {
        return (0, _util.getPropValue)(child, this.props.optionLabelProp);
    },
    getExtraDataFromOption: function getExtraDataFromOption(child) {
        return (0, _util.getPropValue)(child, this.props.extraDataField);
    },
    getLabelFromProps: function getLabelFromProps(props, value) {
        return this.getLabelByValue(props.children, value);
    },
    getVLForOnChange: function getVLForOnChange(vls_) {
        var vls = vls_;
        if (vls !== undefined) {
            return (0, _util.isMultipleOrTags)(this.props) ? vls : vls[0];
        }
        return vls;
    },
    getLabelByValue: function getLabelByValue(children, value) {
        var label = this.getLabelBySingleValue(children, value);
        return label;
    },
    getDropdownContainer: function getDropdownContainer() {
        if (!this.dropdownContainer) {
            this.dropdownContainer = document.createElement('div');
            document.body.appendChild(this.dropdownContainer);
        }
        return this.dropdownContainer;
    },
    getSearchPlaceholderElement: function getSearchPlaceholderElement(hidden) {
        var props = this.props;
        var placeholder = void 0;
        if ((0, _util.isMultipleOrTagsOrCombobox)(props)) {
            placeholder = props.placeholder || props.searchPlaceholder;
        } else {
            placeholder = props.searchPlaceholder;
        }
        if (placeholder) {
            return _react2.default.createElement(
                'span',
                _extends({
                    onMouseDown: _util.preventDefaultEvent,
                    style: _extends({
                        display: hidden ? 'none' : 'block'
                    }, _util.UNSELECTABLE_STYLE)
                }, _util.UNSELECTABLE_ATTRIBUTE, {
                    onClick: this.onPlaceholderClick,
                    className: props.prefixCls + '-search__field__placeholder'
                }),
                placeholder
            );
        }
        return null;
    },
    getInputElement: function getInputElement() {
        var props = this.props;
        return _react2.default.createElement(
            'span',
            { className: props.prefixCls + '-search__field__wrap' },
            _react2.default.createElement('input', {
                ref: this.saveInputRef,
                onBlur: this.onInputBlur,
                onChange: this.onInputChange,
                onKeyDown: this.onInputKeyDown,
                value: this.state.inputValue,
                disabled: props.disabled,
                className: props.prefixCls + '-search__field',
                role: 'textbox'
            }),
            (0, _util.isMultipleOrTags)(props) ? null : this.getSearchPlaceholderElement(!!this.state.inputValue)
        );
    },
    getInputDOMNode: function getInputDOMNode() {
        return this.inputInstance;
    },
    getPopupDOMNode: function getPopupDOMNode() {
        return this.refs.trigger.getPopupDOMNode();
    },
    getPopupMenuComponent: function getPopupMenuComponent() {
        return this.refs.trigger.getInnerMenu();
    },
    setOpenState: function setOpenState(open, needFocus) {
        var _this3 = this;

        this.clearDelayTimer();
        var props = this.props;
        var refs = this.refs;
        // can not optimize, if children is empty
        // if (this.state.open === open) {
        //   return;
        // }

        this.setState({
            open: open
        }, function () {
            if (needFocus || open) {
                if (open || (0, _util.isMultipleOrTagsOrCombobox)(props)) {
                    var input = _this3.getInputDOMNode();
                    if (input && document.activeElement !== input) {
                        input.focus();
                    }
                } else if (refs.selection) {
                    refs.selection.focus();
                }
            }
        });
    },
    addLabelToValue: function addLabelToValue(props, value_) {
        var _this4 = this;

        var value = value_;
        if (props.labelInValue) {
            value.forEach(function (v) {
                v.label = v.label || _this4.getLabelFromProps(props, v.key);
            });
        } else {
            (function () {
                value = [];
                var thisLabel = "";

                value_.forEach(function (v) {
                    thisLabel = _this4.getLabelFromProps(props, v);

                    if (thisLabel) value[value.length] = {
                        key: v,
                        label: thisLabel
                    };
                });
            })();
        }
        return value;
    },
    clearDelayTimer: function clearDelayTimer() {
        if (this.delayTimer) {
            clearTimeout(this.delayTimer);
            this.delayTimer = null;
        }
    },
    removeSelected: function removeSelected(selectedKey) {
        var props = this.props;
        if (props.disabled) {
            return;
        }
        var label = void 0;
        var value = this.state.value.filter(function (singleValue) {
            if (singleValue.key === selectedKey) {
                label = singleValue.label;
            }
            return singleValue.key !== selectedKey;
        });
        var canMultiple = (0, _util.isMultipleOrTags)(props);

        if (canMultiple) {
            var event = selectedKey;
            if (props.labelInValue) {
                event = {
                    key: selectedKey,
                    label: label
                };
            }
            props.onDeselect(event);
        }
        this.fireChange(value);
    },
    openIfHasChildren: function openIfHasChildren() {
        var props = this.props;
        if (_react2.default.Children.count(props.children) || (0, _util.isSingleMode)(props)) {
            this.setOpenState(true);
        }
    },
    fireChange: function fireChange(value) {
        var props = this.props;
        if (!('value' in props)) {
            this.setState({
                value: value
            });
        }
        props.onChange(this.getVLForOnChange(value));
    },
    renderTopControlNode: function renderTopControlNode() {
        var _this5 = this;

        var value = this.state.value;

        var props = this.props;
        var choiceTransitionName = props.choiceTransitionName;
        var prefixCls = props.prefixCls;
        var maxTagTextLength = props.maxTagTextLength;
        // single and not combobox, input is inside dropdown

        if ((0, _util.isSingleMode)(props)) {
            var innerNode = _react2.default.createElement(
                'span',
                {
                    key: 'placeholder',
                    className: prefixCls + '-selection__placeholder'
                },
                props.placeholder
            );
            if (value.length) {
                innerNode = _react2.default.createElement(
                    'span',
                    { key: 'value' },
                    value[0].label
                );
            }
            return _react2.default.createElement(
                'span',
                { className: prefixCls + '-selection__rendered' },
                innerNode
            );
        }

        var selectedValueNodes = [];
        if ((0, _util.isMultipleOrTags)(props)) {
            selectedValueNodes = value.map(function (singleValue) {
                var content = singleValue.label;
                var title = content;
                if (maxTagTextLength && typeof content === 'string' && content.length > maxTagTextLength) {
                    content = content.slice(0, maxTagTextLength) + '...';
                }
                return _react2.default.createElement(
                    'li',
                    _extends({
                        style: _util.UNSELECTABLE_STYLE
                    }, _util.UNSELECTABLE_ATTRIBUTE, {
                        onMouseDown: _util.preventDefaultEvent,
                        className: prefixCls + '-selection__choice',
                        key: singleValue.key,
                        title: title
                    }),
                    _react2.default.createElement(
                        'span',
                        { className: prefixCls + '-selection__choice__content' },
                        content
                    ),
                    _react2.default.createElement('span', {
                        className: prefixCls + '-selection__choice__remove',
                        onClick: _this5.removeSelected.bind(_this5, singleValue.key)
                    })
                );
            });
        }
        selectedValueNodes.push(_react2.default.createElement(
            'li',
            {
                className: prefixCls + '-search ' + prefixCls + '-search--inline',
                key: '__input'
            },
            this.getInputElement()
        ));
        var className = prefixCls + '-selection__rendered';
        if ((0, _util.isMultipleOrTags)(props) && choiceTransitionName) {
            return _react2.default.createElement(
                _rcAnimate2.default,
                {
                    className: className,
                    component: 'ul',
                    transitionName: choiceTransitionName
                },
                selectedValueNodes
            );
        }
        return _react2.default.createElement(
            'ul',
            { className: className },
            selectedValueNodes
        );
    },
    render: function render() {
        var _rootCls;

        var props = this.props;
        var multiple = (0, _util.isMultipleOrTags)(props);
        var state = this.state;
        var className = props.className;
        var disabled = props.disabled;
        var allowClear = props.allowClear;
        var prefixCls = props.prefixCls;

        var ctrlNode = this.renderTopControlNode();
        var extraSelectionProps = {};
        var open = this.state.open;

        var options = [];
        if (open) {
            options = this.renderFilterOptions();
        }
        if (open && ((0, _util.isMultipleOrTagsOrCombobox)(props) || !props.showSearch) && !options.length) {
            open = false;
        }
        if (!(0, _util.isMultipleOrTagsOrCombobox)(props)) {
            extraSelectionProps = {
                onKeyDown: this.onKeyDown,
                tabIndex: 0
            };
        }
        var rootCls = (_rootCls = {}, _defineProperty(_rootCls, className, !!className), _defineProperty(_rootCls, prefixCls, 1), _defineProperty(_rootCls, prefixCls + '-open', open), _defineProperty(_rootCls, prefixCls + '-combobox', (0, _util.isCombobox)(props)), _defineProperty(_rootCls, prefixCls + '-disabled', disabled), _defineProperty(_rootCls, prefixCls + '-enabled', !disabled), _rootCls);

        var clear = _react2.default.createElement('span', {
            key: 'clear',
            className: prefixCls + '-selection__clear',
            onClick: this.onClearSelection
        });
        return _react2.default.createElement(
            _SelectTrigger2.default,
            {
                dropdownAlign: props.dropdownAlign,
                dropdownClassName: props.dropdownClassName,
                dropdownMatchSelectWidth: props.dropdownMatchSelectWidth,
                defaultActiveFirstOption: props.defaultActiveFirstOption,
                dropdownMenuStyle: props.dropdownMenuStyle,
                transitionName: props.transitionName,
                animation: props.animation,
                prefixCls: props.prefixCls,
                dropdownStyle: props.dropdownStyle,
                combobox: props.combobox,
                showSearch: props.showSearch,
                options: options,
                multiple: multiple,
                disabled: disabled,
                visible: open,
                inputValue: state.inputValue,
                inputElement: this.getInputElement(),
                value: state.value,
                onDropdownVisibleChange: this.onDropdownVisibleChange,
                onMenuSelect: this.onMenuSelect,
                onMenuDeselect: this.onMenuDeselect,
                ref: 'trigger'
            },
            _react2.default.createElement(
                'span',
                {
                    style: props.style,
                    className: (0, _classnames2.default)(rootCls)
                },
                _react2.default.createElement(
                    'span',
                    _extends({
                        ref: 'selection',
                        key: 'selection',
                        className: prefixCls + '-selection\n            ' + prefixCls + '-selection--' + (multiple ? 'multiple' : 'single'),
                        role: 'combobox',
                        'aria-autocomplete': 'list',
                        'aria-haspopup': 'true',
                        'aria-expanded': open
                    }, extraSelectionProps),
                    ctrlNode,
                    allowClear && !multiple ? clear : null,
                    multiple || !props.showArrow ? null : _react2.default.createElement(
                        'span',
                        {
                            key: 'arrow',
                            className: prefixCls + '-arrow',
                            style: { outline: 'none' }
                        },
                        _react2.default.createElement('b', null)
                    ),
                    multiple ? this.getSearchPlaceholderElement(!!this.state.inputValue || this.state.value.length) : null
                )
            )
        );
    }
});

exports.default = Select;