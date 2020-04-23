import React from "react";

export default class ContentEditable extends React.Component<IContentEditableProps, IContentEditableStates> {
  
  lastHtml: string;
  htmlEl: Element;

  constructor(props: IContentEditableProps) {
    super(props);
  }

  render() {
    var { tagName, value, onChange, onRef, onKeyDown, ...props } = this.props;
    return React.createElement(
      tagName || 'div',
      {
        ...props,
        ref: (e) => {
          this.htmlEl = e;
          onRef && onRef(e);
        },
        onInput: this.emitChange,
        onKeyDown: onKeyDown,
        onBlur: this.props.onBlur || this.emitChange,
        contentEditable: !this.props.disabled,
        dangerouslySetInnerHTML: {__html: value}
      },
      this.props.children);
  }

  shouldComponentUpdate(nextProps: IContentEditableProps) {
    return (
      !this.htmlEl
      || ( nextProps.value !== this.htmlEl.innerHTML
        && nextProps.value !== this.props.value )
      || this.props.disabled !== nextProps.disabled
    );
  }

  componentDidUpdate() {
    if ( this.htmlEl && this.props.value !== this.htmlEl.innerHTML ) {
      this.htmlEl.innerHTML = this.props.value;
    }
  }

  emitChange = (evt: any) => {
    if (!this.htmlEl) return;
    var html = this.htmlEl.innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {
      evt.target = { value: html };
      this.props.onChange(evt);
    }
    this.lastHtml = html;
  }
}

interface IContentEditableProps {
  tagName?: string;
  className?: string;
  value: string;
  disabled?: boolean;
  onRef?: (dom: Element) => void;
  onChange: (e: Event) => void;
  onBlur?: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

interface IContentEditableStates {

}