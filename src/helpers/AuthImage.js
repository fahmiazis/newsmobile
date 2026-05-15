// helpers/AuthImage.js

import React, { Component } from 'react';
import { Image } from 'react-native';
import RNFS from 'react-native-fs';
import { connect } from 'react-redux';

class AuthImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localUri: null,
    };
  }

  componentDidMount() {
    this.loadImage();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.source !== this.props.source) {
      this.loadImage();
    }
  }

  componentWillUnmount() {
    this.cancelled = true;
  }

  async loadImage() {
    const { source, auth } = this.props;
    const { token } = auth;

    if (!source?.uri) {
      this.setState({ localUri: null });
      return;
    }

    try {
      const filename = source.uri.split('/').pop() || 'img';
      const localPath = `${RNFS.CachesDirectoryPath}/auth_img_${filename}`;

      const exists = await RNFS.exists(localPath);
      if (exists) {
        if (!this.cancelled) {
          this.setState({ localUri: `file://${localPath}` });
        }
        return;
      }

      await RNFS.downloadFile({
        fromUrl: source.uri,
        toFile: localPath,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).promise;

      if (!this.cancelled) {
        this.setState({ localUri: `file://${localPath}` });
      }
    } catch (err) {
      console.log('AuthImage failed to load:', err);
      this.setState({ localUri: null });
    }
  }

  render() {
    const { source, auth, style, ...restProps } = this.props;
    const { localUri } = this.state;

    return (
      <Image
        {...restProps}
        source={localUri ? { uri: localUri } : source}
        style={style}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(AuthImage);
