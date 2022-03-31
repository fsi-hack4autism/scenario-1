import { HTMLProps } from "react";

type IconProps = {
    name: string;
    color?: "text-muted" | "text-primary" | "text-success" | "text-info" | "text-warning" | "text-danger" | "text-white";
} & HTMLProps<HTMLSpanElement>;

export default IconProps;
