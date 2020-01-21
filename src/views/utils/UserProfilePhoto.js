import React from "react";
import { Image } from "semantic-ui-react";
import md5 from "md5";
function UserImage(email) {
    return (
        <Image avatar src={"https://www.gravatar.com/avatar/" + md5(email)} />
    );
}

export default UserImage;