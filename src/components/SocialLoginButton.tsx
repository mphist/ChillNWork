import React from "react";
import { FaGoogle } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import cx from "classnames";

interface PropType {
  provider: "google" | "facebook";
  onSocialLogin: (provider: string) => void;
}

const providers = {
  google: {
    icon: FaGoogle
  },
  facebook: {
    icon: FaFacebook
  }
};

const SocialLoginButton = ({ provider, onSocialLogin }: PropType) => {
  const { icon: Icon } = providers[provider];

  return (
    <div
      className={cx("social-login-button", provider)}
      onClick={() => onSocialLogin(provider)}
    >
      <div className="icon">
        <Icon />
      </div>
      <div className="text">
        <span>Log in with </span>
        <span className="provider">{provider}</span>
      </div>
    </div>
  );
};

export default SocialLoginButton;
