import React from "react";
import Icon from "../Icon";

import UserImageProps from "./UserImageProps";

const UserImage = ({ height, width }: UserImageProps) => (
    <Icon name="user-circle" style={{ fontSize: height ?? width ?? "initial" }} />
)

export default UserImage;
