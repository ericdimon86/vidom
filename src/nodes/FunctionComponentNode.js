import createNode from '../createNode';
import emptyObj from '../utils/emptyObj';
import { NODE_TYPE_FUNCTION_COMPONENT } from './utils/nodeTypes';

export default function FunctionComponentNode(component) {
    this.type = NODE_TYPE_FUNCTION_COMPONENT;
    this._component = component;
    this._key = null;
    this._attrs = emptyObj;
    this._rootNode = null;
    this._children = null;
    this._ns = null;
    this._ctx = emptyObj;
}

FunctionComponentNode.prototype = {
    getDomNode() {
        return this._rootNode.getDomNode();
    },

    key(key) {
        this._key = key;
        return this;
    },

    attrs(attrs) {
        this._attrs = attrs;
        return this;
    },

    children(children) {
        this._children = children;
        return this;
    },

    ctx(ctx) {
        this._ctx = ctx;
        return this;
    },

    renderToDom(parentNs) {
        return this._getRootNode().renderToDom(parentNs);
    },

    renderToString() {
        return this._getRootNode().renderToString();
    },

    adoptDom(domNode, domIdx) {
        return this._getRootNode().adoptDom(domNode, domIdx);
    },

    mount() {
        this._getRootNode().mount();
    },

    unmount() {
        if(this._rootNode) {
            this._rootNode.unmount();
            this._rootNode = null;
        }
    },

    patch(node) {
        if(this === node) {
            return;
        }

        this._getRootNode().patch(this.type === node.type? node._getRootNode() : node);
    },

    _getRootNode() {
        if(this._rootNode) {
            return this._rootNode;
        }

        const rootNode = this._component(this._attrs, this._children, this._ctx) || createNode('!');

        if(process.env.NODE_ENV !== 'production') {
            if(typeof rootNode !== 'object' || Array.isArray(rootNode)) {
                console.error('Function component must return a single node object on the top level');
            }
        }

        rootNode.ctx(this._ctx);

        return this._rootNode = rootNode;
    }
};
