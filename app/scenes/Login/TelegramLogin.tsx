import * as React from "react";
import ButtonLarge from "~/components/ButtonLarge";

type Props = {
  bot_id: number;
  icon: object;
};

type State = {
  telegramLoaded: boolean,
};

class TelegramLoginButton extends React.Component<Props, State> {
  state = {
    telegramLoaded: false,
  };

  handleTelegramLoaded = () => {
    this.setState({
      telegramLoaded: true
    })
  }

  render() {
    const { bot_id, icon } = this.props;
    var _this = this;

    var TelegramLoginScript = function TelegramLoginScript(props: Props) {
      // https://stackoverflow.com/a/63593384

      var ref = React.useRef(null);
      React.useEffect(function () {
        if (ref.current === null) return;
        if (!_this.state.telegramLoaded) {
          var script = document.createElement('script');
          script.src = 'https://telegram.org/js/telegram-widget.js';
          script.onload = () => {
            // script has been loaded
            _this.handleTelegramLoaded();
          };
          ref.current.appendChild(script);
        }
      }, [ref]);
      return React.createElement("div", {
        ref: ref,
      });
    };

    var telegramLogin = function telegramLogin(bot_name: number) {
      console.log("Telegram login with: " + bot_name);
      window.Telegram.Login.auth(
        { bot_id: bot_name, request_access: true },
        (data: object) => {
          if (!data) {
            // console.log("Login Failed");
            location.href = `/?notice=auth-error`;
          }
          // console.log("Login Success: " + data);
          var str = "";
          for (var key in data) {
            if (str != "") {
              str += "&";
            }
            str += key + "=" + encodeURIComponent(data[key]);
          }
          location.href = `/auth/telegram?${str}`;
        });
    };

    return (
      <>
        <ButtonLarge
          onClick={() => (telegramLogin(bot_id))}
          icon={icon}
          disabled={!this.state.telegramLoaded}
          fullwidth
        >
          Continue with Telegram
        </ButtonLarge>
        <TelegramLoginScript />
      </>
    );
  };
}

export default TelegramLoginButton;
