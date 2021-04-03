// @flow
import { EmailIcon } from "outline-icons";
import * as React from "react";
import styled from "styled-components";
import AuthLogo from "components/AuthLogo";
import ButtonLarge from "components/ButtonLarge";
import InputLarge from "components/InputLarge";
import { client } from "utils/ApiClient";

type Props = {
  id: string,
  name: string,
  authUrl: string,
  isCreate: boolean,
  onEmailSuccess: (email: string) => void,
};

type State = {
  showEmailSignin: boolean,
  isSubmitting: boolean,
  email: string,
};

class Provider extends React.Component<Props, State> {
  state = {
    showEmailSignin: false,
    isSubmitting: false,
    email: "",
  };

  handleChangeEmail = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ email: event.target.value });
  };

  handleSubmitEmail = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (this.state.showEmailSignin && this.state.email) {
      this.setState({ isSubmitting: true });

      try {
        const response = await client.post(event.currentTarget.action, {
          email: this.state.email,
        });
        if (response.redirect) {
          window.location.href = response.redirect;
        } else {
          this.props.onEmailSuccess(this.state.email);
        }
      } finally {
        this.setState({ isSubmitting: false });
      }
    } else {
      this.setState({ showEmailSignin: true });
    }
  };

  render() {
    const { isCreate, id, name, authUrl } = this.props;

    if (id === "email") {
      if (isCreate) {
        return null;
      }

      return (
        <Wrapper key="email">
          <Form
            method="POST"
            action="/auth/email"
            onSubmit={this.handleSubmitEmail}
          >
            {this.state.showEmailSignin ? (
              <>
                <InputLarge
                  type="email"
                  name="email"
                  placeholder="me@domain.com"
                  value={this.state.email}
                  onChange={this.handleChangeEmail}
                  disabled={this.state.isSubmitting}
                  autoFocus
                  required
                  short
                />
                <ButtonLarge type="submit" disabled={this.state.isSubmitting}>
                  Sign In →
                </ButtonLarge>
              </>
            ) : (
              <ButtonLarge type="submit" icon={<EmailIcon />} fullwidth>
                Continue with Email
              </ButtonLarge>
            )}
          </Form>
        </Wrapper>
      );
    }

    const icon = <AuthLogo providerName={id} />;

    return (
      <Wrapper key={id}>
        <ButtonLarge
          onClick={() => (window.location.href = authUrl)}
          icon={icon ? <Logo>{icon}</Logo> : null}
          fullwidth
        >
          Continue with {name}
        </ButtonLarge>
      </Wrapper>
    );
  }
}

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const Wrapper = styled.div`
  margin-bottom: 1em;
  width: 100%;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export default Provider;
