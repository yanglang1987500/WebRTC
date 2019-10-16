import React from "react";
import classnames from "classnames";

const NoInformation: React.StatelessComponent<INoInformationProps> = ({
  className,
  iconClassName,
  isPart,
  needPadding = true,
}) => {
  return (
    <div
      className={classnames(
        "no-information",
        needPadding && "pt-5 pb-5",
        isPart && "no-information-part",
        className
      )}
    >
      <div className="information-position">
        <span className={classnames("iconfont icon-noinformation", iconClassName)} />
        <h5 className="color-gray-lighter">NO INFORMATION</h5>
      </div>
    </div>
  );
};

interface INoInformationProps {
  className?: string;
  iconClassName?: string;
  isPart?: boolean;
  needPadding?: boolean;
}

export default NoInformation;
