const { Parser } = require('acorn');
const escodegen = require('escodegen');
const loaderUtils = require("loader-utils");

const Estree = {
  Literal: 'Literal',
  Identifier: 'Identifier',
  MemberExpression: 'MemberExpression',
  ConditionalExpression: 'ConditionalExpression',
  BinaryExpression: 'BinaryExpression',
  CallExpression: 'CallExpression',
  AssignmentExpression: 'AssignmentExpression',
  VariableDeclaration: 'VariableDeclaration',
  ObjectExpression: 'ObjectExpression',
  LogicalExpression: 'LogicalExpression',
}
let renderNode
let imgPrefix

function findRenderVariableNode(rootNode) {
  walkNode(rootNode, (node) => {
    if (
      node.type === Estree.AssignmentExpression &&
      node.left.type === Estree.MemberExpression && 
      node.left.property.name === 'render' &&
      node.left.object.type === Estree.MemberExpression &&
      node.left.object.property.name === 'prototype'
    ) {
      renderNode = node.right.body.body.filter(item => item.type === Estree.VariableDeclaration);
    }
  })
}

function walkNode(node, callback) {
  callback(node)
  // 有 type 字段的我们认为是一个节点
  Object.keys(node).forEach((key) => {
    const item = node[key]
    if (Array.isArray(item)) {
      item.forEach((sub) => {
        sub.type && walkNode(sub, callback)
      })
    }
    item && item.type && walkNode(item, callback)
  })
}

function parseSource(source) {
  const rootNode = Parser.parse(source, {sourceType: 'module', ecmaVersion: '2017'})
  findRenderVariableNode(rootNode);
  walkNode(rootNode, (node) => {
    if (includeImageElement(node)) {
      node.arguments[1].properties.map(item => {
        if (item.key && item.key.name === 'src') {
          dealImageNode(item.value);
        }
      })
    };
  })
  return rootNode;
}

// match React.createElement('img', {properties})
function includeImageElement(node) {
  const callee = node.callee;
  const args = node.arguments;
  return node.type === Estree.CallExpression &&
    callee.property && callee.property.name === 'createElement' &&
    args[0].type === Estree.Literal && args[0].value === 'img';
}

function dealImageNode(node) {
  switch(node.type) {
    // 字面量
    case Estree.Literal: 
      dealImageLiteralNode(node);
      break;
    // 三元运算表达式
    case Estree.ConditionalExpression: 
      dealImageConditionalNode(node);
      break;
    // 变量
    case Estree.Identifier: 
      dealImageIdentifier(node);
      break;
    // 二元运算表达式
    case Estree.BinaryExpression: 
      dealImageBinaryNode(node);
      break;
    // 逻辑运算表达式
    case Estree.LogicalExpression:
      dealImageLogicalNode(node);
      break;
    // 成员表达式
    case Estree.MemberExpression: 
      dealImageMemberNode(node);
      break;
  }
} 

function dealImageLiteralNode(node) {
  dealPath(node)
}

function dealImageConditionalNode(node) {
  dealImageNode(node.consequent);
  dealImageNode(node.alternate);
}

function dealImageBinaryNode(node) {
  dealImageNode(node.left);
  dealImageNode(node.right);
}

function dealImageLogicalNode(node) {
  dealImageNode(node.left);
  dealImageNode(node.right);
}

function dealImageMemberNode(node) {
  const members = findMemberNodes([], node);
  findVariableByMembers(members);
}

function dealImageIdentifier(node) {
  findVariableByMembers([node.name]);
}

// find node keys of member node, 
// for example person.photo.photonumber key is [person,photo,photonumber]
function findMemberNodes(nodeNames, node) {
  nodeNames.push(node.property.name);
  if (node.object.type === Estree.Identifier) {
    nodeNames.push(node.object.name);
    return nodeNames.reverse();
  }
  return findMemberNodes(nodeNames, node.object);
}

// find VariableDeclarator base member node keys, 
// for example [person,photo,photonumber] equals var person = {photo: {photonumber: 123}}
function findVariableByMembers(members) {
  if (!members.length || !renderNode || !renderNode.length) return;
  renderNode.map(item => {
    variableDeclarator = item.declarations[0];
    if (variableDeclarator.id.name === members[0]) {
      if (variableDeclarator.init.type === Estree.Literal) {
        dealPath(variableDeclarator.init)
      }
      if (variableDeclarator.init.type === Estree.ObjectExpression) {
        members.shift();
        findLiteralInObject(members, variableDeclarator.init);
      }
    }
  })
}

function findLiteralInObject(members, node) {
  if (!members.length) return
  node.properties.map(item => {
    if (item.key.name === members[0]) {
      if (item.value.type === Estree.ObjectExpression) {
        members.shift();
        findLiteralInObject(members, item.value);
        return;
      }
      dealImageNode(item.value)
    }
  })
}

function dealPath(node) {
  const reg = /(http|https):\/\/.*?(gif|png|jpg|jpeg)/gi;
  if (!node.value.match(reg) && !node.value.startsWith(imgPrefix)) {
    node.value.startsWith('/') && (node.value = node.value.substr(1));
    node.value = `${imgPrefix}${node.value}`;
  }
}

module.exports = function (source) {
  if (source.match(/React\.createElement\(\"img\"/gi)) {
    imgPrefix = loaderUtils.getOptions(this).prefix;
    const rootNode = parseSource(source);
    return escodegen.generate(rootNode);
  }
  return source;
}