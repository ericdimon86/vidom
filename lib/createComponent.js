var noOp = require('./noOp'),
    rafBatch = require('./client/rafBatch'),
    patchDom = require('./client/patchDom'),
    calcPatch = require('./calcPatch'),
    emptyAttrs = {};

function mountComponent() {
    this._isMounted = true;
    this._rootNode.mount();
    this.onMount();
}

function unmountComponent() {
    this._isMounted = false;
    this._rootNode.unmount();
    this.onUnmount();
}

function calcComponentPatch(attrs, children) {
    var prevRootNode = this._rootNode;

    this._attrs = attrs;
    this._children = children;
    this._rootNode = this.render(attrs || emptyAttrs, children);

    if(!this.isMounted()) {
        return [];
    }

    return calcPatch(prevRootNode, this._rootNode);
}

function renderComponentToDom() {
    return this._domNode = this._rootNode.renderToDom();
}

function patchComponentDom(patch) {
    var newDomNode = patchDom(this._domNode, patch);
    newDomNode && (this._domNode = newDomNode);
    this.onUpdate();
}

function renderComponent() {
    throw Error('render() should be specified');
}

function updateComponent() {
    var patch = this.calcPatch(this._attrs, this._children);
    patch.length && rafBatch(function() {
        this.isMounted() && this.patchDom(patch);
    }, this);
}

function isComponentMounted() {
    return this._isMounted;
}

function createComponent(props, staticProps) {
    var res = function(attrs, children) {
            this._attrs = attrs;
            this._children = children;
            this._rootNode = this.render(attrs || emptyAttrs, children);
            this._domNode = null;
            this._isMounted = false;
        },
        ptp = {
            mount : mountComponent,
            unmount : unmountComponent,
            onMount : noOp,
            onUnmount : noOp,
            onUpdate : noOp,
            isMounted : isComponentMounted,
            renderToDom : renderComponentToDom,
            patchDom : patchComponentDom,
            render : renderComponent,
            update : updateComponent,
            calcPatch : calcComponentPatch
        },
        i;

    for(i in props) {
        ptp[i] = props[i];
    }

    res.prototype = ptp;

    for(i in staticProps) {
        res[i] = staticProps[i];
    }

    return res;
}

module.exports = createComponent;