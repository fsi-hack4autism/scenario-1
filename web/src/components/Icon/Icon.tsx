import React from "react";
import IconProps from "./IconProps";

const Icon = ({ name, className, color, ...props }: IconProps) => (
    <span className={`fa fa-${name} ${className ?? ""} ${color ?? ""}`} {...props} />
);

export default Icon;
