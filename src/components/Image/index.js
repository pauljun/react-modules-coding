import React from 'react';

export default class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isError: null
    };
  }
  render() {
    const { isError } = this.state;
    const { src, defaultSrc, ...props } = this.props;
    return (
      <img
        src={isError ? defaultSrc : src}
        {...props}
        onError={() => this.setState({ isError: true })}
      />
    );
  }
}
