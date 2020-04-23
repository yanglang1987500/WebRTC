import React from "react";
import classnames from "classnames";
import "./groupInput.less";

export default class GroupInput extends React.Component<IGroupInputProps, {}> {
  dom: HTMLInputElement;

  constructor(props: IGroupInputProps) {
    super(props);
  }

  focus() {
    this.dom && this.dom.focus();
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { onChange } = this.props;
    const value = (e && e.target) ? e.target.value : e as any as string;
    onChange(value);
  }

  render() {
    const { label, required, component, error, message, wrapClassName, prop } = this.props;
    return (
      <div className={classnames("form-group", wrapClassName, error && "has-error")}>
        { label && (<label>
          {label} {required && "*"}
        </label>) }
        {(component &&
          React.cloneElement(component, {
            ...this.props,
            onChange: this.onChange,
            ref: (dom: HTMLInputElement) => {
              this.dom = dom;
            }
          } as any)) || (
          <input
            id={prop}
            type="text"
            className="form-control input-sm"
            ref={dom => {
              this.dom = dom;
            }}
            {...this.props}
            onChange={this.onChange}
          />
        )}
        {error && <label className="text-danger ">{error}</label>}
        {message&&message}
      </div>
    );
  }
}

interface ICloneElementComponent extends IGroupBase {
  ref?: (dom: HTMLInputElement) => void;
  onChange?: (e?: React.ChangeEvent<HTMLInputElement>) => void;
}

interface IGroupInputProps extends IGroupBase {
  onChange?: (value?: string) => void;
}

interface IGroupBase {
  label?: string;
  required?: boolean;
  component?: React.ReactElement<ICloneElementComponent>;
  error?: boolean;
  maxlength?: string;
  readonly?: string;
  value?: any;
  style?: any;
  message?: React.ReactNode;
  wrapClassName?: string;
  prop?: string;
}
