/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  CheckBox,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import pengadaan from '../redux/actions/pengadaan';
import mutasi from '../redux/actions/mutasi';
import disposal from '../redux/actions/disposal';
import dokumen from '../redux/actions/dokumen';
import Pdf from 'react-native-pdf';
import RNFS from 'react-native-fs';
import { zip } from 'react-native-zip-archive';
import IconAwe from 'react-native-vector-icons/FontAwesome';
import IconMateri from 'react-native-vector-icons/MaterialIcons';
import DocumentPicker from 'react-native-document-picker';
import Modal from 'react-native-modal';
import {API_URL} from '@env';

class ModalDokumen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: [
        {
          id: 1,
          name: 'UJI COBA WEB ASSET.pdf',
          url: `${API_URL}/show/doc/5647`,
          selected: false,
          expanded: true,
        },
        {
          id: 2,
          name: 'Purchase Request.pdf',
          url: `${API_URL}/show/doc/5035`,
          selected: false,
          expanded: true,
        },
      ],
      cekDoc: [],
      loading: false,
      dataColl: [],
      fileUpload: null,
      limImage: 20 * 1024 * 1024, // 20 MB
      errMsg: '',
      pageNumbers: {},
      idDoc: 0,
      modalReject: false,
    };
  }

  componentDidMount = () => {
    const { arrDoc } = this.props.parDoc;
    const data = [];
    for (let i = 0; i < arrDoc.length; i++) {
      data.push(arrDoc[i].id);
    }
    setTimeout(() => {
        this.setState({dataColl: data});
    }, 10);
  }

  changePage = (docId, delta, totalPages) => {
    this.setState((prev) => {
      const currentPage = prev.pageNumbers[docId] || 1;
      let nextPage = currentPage + delta;
      if (nextPage < 1) {nextPage = 1;}
      if (nextPage > totalPages) {nextPage = totalPages;}
      return { pageNumbers: { ...prev.pageNumbers, [docId]: nextPage } };
    });
  };

  toggleSelect = (id) => {
    this.setState((prevState) => ({
      documents: prevState.documents.map((doc) =>
        doc.id === id ? { ...doc, selected: !doc.selected } : doc
      ),
    }));
  };

  docApp = (val) => {
        const { cekDoc } = this.state;
        cekDoc.push(val);
        this.setState({ cekDoc: cekDoc });
    }

  docRej = (val) => {
    const { cekDoc } = this.state;
    const data = [];
    for (let i = 0; i < cekDoc.length; i++) {
        if (cekDoc[i] === val) {
            data.push();
        } else {
            data.push(cekDoc[i]);
        }
    }
    this.setState({ cekDoc: data });
  }

  toggleExpand = (id) => {
    this.setState((prevState) => ({
      documents: prevState.documents.map((doc) =>
        doc.id === id ? { ...doc, expanded: !doc.expanded } : doc
      ),
    }));
  };

  collDoc = (val) => {
    const {dataColl} = this.state;
    const dataApp = [...dataColl];
    const dataRej = [];
    const cek = dataColl.find(x => x === val);
    if (cek !== undefined) {
        console.log('masuk not undefined');
        for (let i = 0; i < dataColl.length; i++) {
            if (dataColl[i] === val) {
                dataRej.push();
            } else {
                dataRej.push(dataColl[i]);
            }
        }
        this.setState({dataColl: dataRej});
    } else {
        console.log('masuk undefined');
        dataApp.push(val);
        this.setState({dataColl: dataApp});
    }
  }

  downloadAndZip = async () => {
    try {
      const { documents } = this.state;
      const selectedDocs = documents.filter((doc) => doc.selected);
      if (selectedDocs.length === 0) {
        Alert.alert('Error', 'Pilih minimal 1 dokumen');
        return;
      }

      this.setState({ loading: true });

      const downloadDir = RNFS.DownloadDirectoryPath + '/tempDocs';
      await RNFS.mkdir(downloadDir);

      const filePaths = [];

      for (const doc of selectedDocs) {
        const filePath = `${downloadDir}/${doc.name}`;
        await RNFS.downloadFile({
          fromUrl: doc.url,
          toFile: filePath,
        }).promise;
        filePaths.push(filePath);
      }

      const zipPath = `${RNFS.DownloadDirectoryPath}/DokumenTerpilih.zip`;
      await zip(downloadDir, zipPath);

      await RNFS.unlink(downloadDir);

      Alert.alert(
        'Sukses',
        `Dokumen berhasil di-zip:\n${zipPath}`,
        [{ text: 'Tutup' }],
        { cancelable: true }
      );
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Gagal mendownload atau mengompres file');
    } finally {
      this.setState({ loading: false });
    }
  };

  onChangeUpload = async (val) => {
    try {
      const { noDoc, tipe, noTrans, detailForm } = this.props.parDoc; // props dari redux
      const { detail } = this.state;

      // ambil token dari AsyncStorage
      // const token = await AsyncStorage.getItem('token');
      const {dataUser, token} = this.props.auth;

      // buka file picker
      const res = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          'application/vnd.ms-excel', // xls
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
          'application/zip', // zip
          'application/x-rar-compressed', // rar
        ],
      });

      const file = res; // ambil file pertama
      const { size, type, name, uri } = file;

      this.setState({ fileUpload: file });

      if (size >= this.state.limImage) {
        this.setState({ errMsg: 'Maximum upload size 20 MB' });
        Alert.alert('Error', 'Maximum upload size 20 MB');
      } else {
        const data = new FormData();
        data.append('document', {
          uri,
          type,
          name,
        });

        const tempno = { no: noDoc, jenis: tipe };

        // panggil redux action upload
        await this.props.uploadDocument(token, val.id, data);
        await this.props.getDokumen(token, tempno);
        this.collDoc(val.id);

        if (noDoc === noTrans) {
          await this.props.getDocumentIo(token, noDoc);
        } else if (tipe === 'disposal') {
          const send = {
              noId: detailForm.id,
              noAsset: detailForm.no_asset,
          };
          const stat = detailForm.status_form;
          const menu = stat === 26 ? 'purch' : 'pengajuan' 
          await this.props.getDocumentDis(token, send, 'disposal', menu);
        } else if (tipe === 'persetujuan disposal') {
          const send = {
              noId: detailForm.id,
              noAsset: detailForm.no_asset,
          };
          await this.props.getDocumentDis(token, send, 'disposal', 'persetujuan');
        } else if (tipe === 'eksekusi disposal') {
          const send = {
              noId: detailForm.id,
              noAsset: detailForm.no_asset,
          };
          const tipeDis = detailForm.nilai_jual === '0' ? 'dispose' : 'sell';
          this.props.getDocumentDis(token, send, 'disposal', tipeDis, detailForm.npwp);
        } else if (tipe === 'tax disposal') {
          const send = {
              noId: detailForm.id,
              noAsset: detailForm.no_asset,
          };
          await this.props.getDocumentDis(token, send, 'disposal', 'tax');
        } else if (tipe === 'finance disposal') {
          const send = {
              noId: detailForm.id,
              noAsset: detailForm.no_asset,
          };
          await this.props.getDocumentDis(token, send, 'disposal', 'finance');
        } else if (tipe === 'mutasi') {
          await this.props.getDetailMutasi(token, noDoc);
          await this.props.getDocumentMut(token, noDoc, noDoc);
        } else {
          await this.props.getDocCart(token, noDoc);
        }

        // this.openUpload();
        this.setState({ confirm: 'sucUpload' });
        this.openConfirm();
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.log('Upload error:', err);
      }
    }
  };

  approveDoc = async (val) => {
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level;
    const {noDoc, tipe, noTrans, filter, detailForm} = this.props.parDoc;
    const {idDoc} = this.state;
    const tempno = {
        no: noDoc,
        jenis: tipe,
    };
    await this.props.approveDokumen(token, val.id);
    await this.props.getDokumen(token, tempno);
    if (noDoc === noTrans && tipe === 'pengadaan') {
      await this.props.getDocumentIo(token, noDoc);
      if (val.type === 'show') {
          // this.openModalPdf()
          this.collDoc(val.id);
      } else {
          this.collDoc(val.id);
      }
    } else {
      if (tipe === 'pengadaan') {
        await this.props.getDocCart(token, noDoc);
        if (val.type === 'show') {
            this.collDoc(val.id);
        } else {
            this.collDoc(val.id);
        }
      } else if (tipe === 'mutasi') {
        await this.props.getDetailMutasi(token, noDoc);
        await this.props.getDocumentMut(token, noDoc, noDoc);
        if (val.type === 'show') {
            this.collDoc(val.id);
        } else {
            this.collDoc(val.id);
        }
      } else if (tipe === 'disposal') {
        const data = {
            noId: detailForm.id,
            noAsset: detailForm.no_asset,
        };
        await this.props.getDocumentDis(token, data, 'disposal', 'pengajuan');
        if (val.type === 'show') {
            this.collDoc(val.id);
        } else {
            this.collDoc(val.id);
        }
      } else if (tipe === 'eksekusi disposal') {
        const data = {
            noId: detailForm.id,
            noAsset: detailForm.no_asset,
        };
        const tipeDis = detailForm.nilai_jual === '0' ? 'dispose' : 'sell';
        this.props.getDocumentDis(token, data, 'disposal', tipeDis, detailForm.npwp);
        if (val.type === 'show') {
            this.collDoc(val.id);
        } else {
            this.collDoc(val.id);
        }
      } else if (tipe === 'tax disposal') {
        const data = {
            noId: detailForm.id,
            noAsset: detailForm.no_asset,
        };
        await this.props.getDocumentDis(token, data, 'disposal', 'tax');
        if (val.type === 'show') {
            this.collDoc(val.id);
        } else {
            this.collDoc(val.id);
        }
      } else if (tipe === 'finance disposal') {
        const data = {
            noId: detailForm.id,
            noAsset: detailForm.no_asset,
        };
        await this.props.getDocumentDis(token, data, 'disposal', 'finance');
        if (val.type === 'show') {
            this.collDoc(val.id);
        } else {
            this.collDoc(val.id);
        }
      } else if (tipe === 'persetujuan disposal') {
        const data = {
            noId: detailForm.id,
            noAsset: detailForm.no_asset,
        };
        await this.props.getDocumentDis(token, data, 'disposal', 'persetujuan');
        if (val.type === 'show') {
            this.collDoc(val.id);
        } else {
            this.collDoc(val.id);
        }
      }
    }
    // this.setState({confirm: 'isAppDoc'})
    // this.openConfirm()
    // this.openModalAppDoc()
  }

  approveDocZip = async (val) => {
      const {dataUser, token} = this.props.auth;
      const level = dataUser.user_level;
      const dataId = {
          list: this.state.dataZip,
      };
      const {noDoc, tipe, noTrans, filter, detailForm} = this.props.parDoc;
      const {idDoc} = this.state;
      const tempno = {
          no: noDoc,
          jenis: tipe,
      };
      await this.props.approveDokumen(token, idDoc, dataId);
      await this.props.getDokumen(token, tempno);
      if (noDoc === noTrans) {
        if (tipe === 'pengadaan') {
            await this.props.getDocumentIo(token, noDoc);
        } else {
            await this.props.getDetailMutasi(token, noDoc);
            await this.props.getDocumentMut(token, noDoc, noDoc);
        }

        // if (val.type === 'show') {
        //     this.openModalPdf()
        //     this.collDoc(val.id)
        // } else {
        //     this.collDoc(val.id)
        // }
      } else if (tipe === 'disposal') {
        const data = {
            noId: detailForm.id,
            noAsset: detailForm.no_asset,
        };
        await this.props.getDocumentDis(token, data, 'disposal', 'pengajuan');
      } else if (tipe === 'eksekusi disposal') {
        const data = {
            noId: detailForm.id,
            noAsset: detailForm.no_asset,
        };
        const tipeDis = detailForm.nilai_jual === '0' ? 'dispose' : 'sell';
        await this.props.getDocumentDis(token, data, 'disposal', tipeDis, detailForm.npwp);
      } else if (tipe === 'tax disposal') {
        const data = {
          noId: detailForm.id,
          noAsset: detailForm.no_asset,
        };
        await this.props.getDocumentDis(token, data, 'disposal', 'tax');
      } else if (tipe === 'finance disposal') {
        const data = {
          noId: detailForm.id,
          noAsset: detailForm.no_asset,
        };
        await this.props.getDocumentDis(token, data, 'disposal', 'finance');
      } else {
        await this.props.getDocCart(token, noDoc);
        // if (val.type === 'show') {
        //     this.openModalPdf()
        //     this.collDoc(val.id)
        // } else {
        //     this.collDoc(val.id)
        // }
      }

      // this.setState({confirm: 'isAppDoc'})
      // this.openConfirm()

      // this.openModalAppDoc()

  }

  rejectDoc = async () => {
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level;
    const {idDoc} = this.state;
    const {noDoc, tipe, noTrans, filter, detailForm} = this.props.parDoc;
    const tempno = {
        no: noDoc,
        jenis: tipe,
    };
    await this.props.rejectDokumen(token, idDoc);
    await this.props.getDokumen(token, tempno);
    if (noDoc === noTrans) {
      if (tipe === 'pengadaan') {
        await this.props.getDocumentIo(token, noDoc);
      } else if (tipe === 'mutasi') {
        await this.props.getDetailMutasi(token, noDoc);
        await this.props.getDocumentMut(token, noDoc, noDoc);
      }
    } else {
      if (tipe === 'disposal') {
        const data = {
            noId: detailForm.id,
            noAsset: detailForm.no_asset,
        };
        // await this.props.getDocCart(token, noDoc)
        await this.props.getDocumentDis(token, data, 'disposal', 'pengajuan');
      } else if (tipe === 'eksekusi disposal') {
        const data = {
            noId: detailForm.id,
            noAsset: detailForm.no_asset,
        };
        const tipeDis = detailForm.nilai_jual === '0' ? 'dispose' : 'sell';
        this.props.getDocumentDis(token, data, 'disposal', tipeDis, detailForm.npwp);
      }  else if (tipe === 'tax disposal') {
        const data = {
            noId: detailForm.id,
            noAsset: detailForm.no_asset,
        };
        await this.props.getDocumentDis(token, data, 'disposal', 'tax');
      } else if (tipe === 'finance disposal') {
        const data = {
            noId: detailForm.id,
            noAsset: detailForm.no_asset,
        };
        await this.props.getDocumentDis(token, data, 'disposal', 'finance');
      } else {
        await this.props.getDocCart(token, noDoc);
      }
    }
    this.setState({confirm: 'isRejDoc'});
    // this.openConfirm();
    this.openReject();
  }

  rejectDocZip = async () => {
    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level;
    const {idDoc} = this.state;
    const {noDoc, tipe, noTrans, filter} = this.props.parDoc;
    const tempno = {
        no: noDoc,
        jenis: tipe,
    };
    const data = {
        list: this.state.dataZip,
    };
    await this.props.rejectDokumen(token, idDoc, data);
    await this.props.getDokumen(token, tempno);
    if (noDoc === noTrans) {
        if (tipe === 'pengadaan') {
            await this.props.getDocumentIo(token, noDoc);
        } else {
            await this.props.getDetailMutasi(token, noDoc);
            await this.props.getDocumentMut(token, noDoc, noDoc);
        }
    } else {
        await this.props.getDocCart(token, noDoc);
    }
    this.setState({confirm: 'isRejDoc'});
    this.openConfirm();
    this.openModalRejDocZip();
  }

  openReject = () => {
    this.setState({modalReject: !this.state.modalReject})
  }

  render() {
    const { documents, loading, cekDoc, dataColl, pageNumbers } = this.state;
    const { handleClose, parDoc } = this.props;
    const { arrDoc, proses } = parDoc;

    const {dataUser, token} = this.props.auth;
    const level = dataUser.user_level;

    return (
      <>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>Kelengkapan Dokumen</Text>
        {/* <ScrollView> */}
          {/* {documents.map((doc) => (
            <View key={doc.id} style={styles.docContainer}>
              <View style={styles.row}>
                <CheckBox
                  value={doc.selected}
                  onValueChange={() => this.toggleSelect(doc.id)}
                />
                <Text style={styles.docName}>{doc.name}</Text>
                <TouchableOpacity onPress={() => this.toggleExpand(doc.id)}>
                  <Text style={styles.expandBtn}>
                    {doc.expanded ? 'Hide' : 'Expand'}
                  </Text>
                </TouchableOpacity>
              </View>

              {doc.expanded && (
                <View style={{ height: 300, marginTop: 10 }}>
                  <Pdf source={{ uri: doc.url, cache: true }} style={{ flex: 1 }} />
                </View>
              )}
            </View>
          ))} */}
          {arrDoc.map((doc) => (
            <View key={doc.id} style={styles.docContainer}>
              <View style={styles.row}>
                <CheckBox
                  style={{ margin: 0 }}
                  value={cekDoc.find(x => x === doc.id) ? true : false}
                  onValueChange={cekDoc.find(x => x === doc.id) ? () => this.docRej(doc.id) : () => this.docApp(doc.id)}
                />
                <Text style={styles.docName}>{doc.nama_dokumen === null ? 'Lampiran' : doc.nama_dokumen}</Text>
              </View>
              <View style={[styles.row, styles.paddingIcon]}>
                {((doc.status_dokumen === undefined || doc.status_dokumen === null) && (level !== 5 && level !== 9)) ? (
                  <IconAwe style={styles.marginIcon} name="circle-thin" size={25} />
                ) : ((doc.status_dokumen !== undefined && doc.status_dokumen !== null) && doc.status_dokumen !== '1' && doc.status_dokumen.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                doc.status_dokumen.split(',').reverse()[0].split(';')[1] === ' status approve') || ((level === 5 || level === 9) && doc.status === 3) ? <IconMateri style={styles.marginIcon} name="check-circle" size={25} color="#28a745" />
                : ((doc.status_dokumen !== undefined && doc.status_dokumen !== null) && doc.status_dokumen !== '1' && doc.status_dokumen.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                doc.status_dokumen.split(',').reverse()[0].split(';')[1] === ' status reject') || ((level === 5 || level === 9) && doc.status === 0) ?  <IconMateri style={styles.marginIcon} name="close" size={25} color="#dc3545"/>
                : (
                  <IconAwe style={styles.marginIcon} name="circle-thin" size={25} />
                )}
                <Text
                  style={[
                    styles.docName,
                    ((doc.status_dokumen === undefined || doc.status_dokumen === null)) ? 'black' : ((doc.status_dokumen !== undefined && doc.status_dokumen !== null) && doc.status_dokumen !== '1' && doc.status_dokumen.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                    doc.status_dokumen.split(',').reverse()[0].split(';')[1] === ' status approve') || ((level === 5 || level === 9) && doc.status === 3) ? styles.textBlue
                    : ((doc.status_dokumen !== undefined && doc.status_dokumen !== null) && doc.status_dokumen !== '1' && doc.status_dokumen.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                    doc.status_dokumen.split(',').reverse()[0].split(';')[1] === ' status reject') || ((level === 5 || level === 9) && doc.status === 0) ?  styles.textRed
                    : styles.textBlack,
                  ]}
                >
                  {doc.desc === null ? 'Lampiran' : doc.desc}
                  {((doc.status_dokumen === undefined || doc.status_dokumen === null)) ? '' : ((doc.status_dokumen !== undefined && doc.status_dokumen !== null) && doc.status_dokumen !== '1' && doc.status_dokumen.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                  doc.status_dokumen.split(',').reverse()[0].split(';')[1] === ' status approve') ? ' (APPROVED)' :
                  (doc.status_dokumen !== '1' && doc.status_dokumen.split(',').reverse()[0].split(';')[0] === ` level ${level}` &&
                  doc.status_dokumen.split(',').reverse()[0].split(';')[1] === ' status reject') ?  ' (REJECTED)' :
                  ((level === 5 || level === 9) && doc.status === 3) ? ' (APPROVED)' :
                  ((level === 5 || level === 9) && doc.status === 0) ?  ' (REJECTED)' : ''}
                </Text>
                {/* <TouchableOpacity onPress={() => this.collDoc(doc.id)}>
                  <Text style={styles.expandBtn}>
                    {dataColl.find(x => x === doc.id) ? 'Hide' : 'Expand'}
                  </Text>
                </TouchableOpacity> */}
              </View>
              <View style={[styles.row, styles.marginBtn]}>
                <TouchableOpacity style={[styles.buttonModal, styles.btnColorTrack]}>
                  <Text style={styles.buttonTextModal}>History</Text>
                </TouchableOpacity>
                {proses === 'approval' && (
                  <>
                    <TouchableOpacity
                      style={[styles.buttonModal, styles.btnColorApprove]}
                      onPress={() => this.approveDoc({type: 'direct', id: doc.id})}
                    >
                      <Text style={styles.buttonTextModal}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.buttonModal, styles.btnColorReject]}
                      onPress={() => {this.setState({idDoc: doc.id}); this.openReject()}}
                    >
                      <Text style={styles.buttonTextModal}>Reject</Text>
                    </TouchableOpacity>
                  </>
                )}
                {proses === 'upload' && (
                  <TouchableOpacity onPress={() => this.onChangeUpload(doc)} style={[styles.buttonModal, styles.btnColorProses]}>
                    <Text style={styles.buttonTextModal}>Upload</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity onPress={() => this.collDoc(doc.id)} style={[styles.row, styles.borderModal, styles.flexBtn]}>
                <IconMateri size={20} name={dataColl.find(x => x === doc.id) ? 'keyboard-arrow-down' : 'keyboard-arrow-right'} />
                <Text>{doc.desc === null ? 'Lampiran' : doc.desc}</Text>
              </TouchableOpacity>
              {dataColl.includes(doc.id) && (
                <View style={{ height: doc.path !== null ? 350 : 50, marginTop: 10 }}>
                  {doc.path !== null ? (
                    <>
                      <Pdf
                        source={{
                          uri: `${API_URL}/show/doc/${doc.id}`,
                        }}
                        style={{ flex: 1 }}
                        scale={1.0}
                        minScale={1.0}
                        maxScale={3.0}
                        page={pageNumbers[doc.id] || 1}
                        onLoadComplete={(pages) =>
                          this.setState((prev) => ({
                            pageNumbers: {
                              ...prev.pageNumbers,
                              [doc.id]: prev.pageNumbers[doc.id] || 1,
                              [`${doc.id}_total`]: pages,
                            },
                          }))
                        }
                      />

                      <View style={styles.pdfControls}>
                        <TouchableOpacity
                          onPress={() =>
                            this.changePage(
                              doc.id,
                              -1,
                              this.state.pageNumbers[`${doc.id}_total`] || 1
                            )
                          }
                          style={styles.iconBtn}
                        >
                          <IconMateri name="arrow-back" size={25} />
                        </TouchableOpacity>

                        <Text style={styles.pageText}>
                          {pageNumbers[doc.id] || 1} /{' '}
                          {pageNumbers[`${doc.id}_total`] || '-'}
                        </Text>

                        <TouchableOpacity
                          onPress={() =>
                            this.changePage(
                              doc.id,
                              1,
                              this.state.pageNumbers[`${doc.id}_total`] || 1
                            )
                          }
                          style={styles.iconBtn}
                        >
                          <IconMateri name="arrow-forward" size={25} />
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <Text style={styles.txtNotfound}>File not found</Text>
                  )}
                </View>
              )}
            </View>
          ))}
        {/* </ScrollView> */}

        <TouchableOpacity style={[styles.downloadBtn, styles.btnColorProses]} onPress={this.downloadAndZip}>
          <Text style={styles.downloadText}>Download Dokumen Terpilih (ZIP)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>

        {/* Overlay Loading */}
        {loading && (
          <View style={styles.overlay}>
            <View style={styles.overlayBox}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Sedang memproses...</Text>
            </View>
          </View>
        )}
      </View>
      <Modal
        style={{margin: 0}}
        isVisible={this.state.modalReject}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        // backdropOpacity={0.4}
        onBackdropPress={this.openReject}
        useNativeDriver={true}
      >
        <View style={styles.overlayModal}>
          <View style={styles.popupContainerInfo}>
            <ScrollView style={styles.scrollContentModal}>
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionTitleInfo}>Anda yakin untuk reject?</Text>
                <View style={styles.sectionDelete}>
                  <TouchableOpacity style={[styles.buttonDelete, styles.btnColorClose]} onPress={() => this.rejectDoc()}>
                    <Text style={styles.buttonTextCard}>Ya</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.buttonDelete, styles.btnColorSec]} onPress={this.openReject}>
                    <Text style={styles.buttonTextCard}>Tidak</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  docContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docName: {
    flex: 1,
    marginLeft: 5,
  },
  expandBtn: {
    color: 'blue',
  },
  downloadBtn: {
    padding: 15,
    marginTop: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  downloadText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeBtn: {
    backgroundColor: '#dc3545',
    padding: 15,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayBox: {
    padding: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonModal: {
    paddingVertical: 7,
    paddingHorizontal: 7,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  btnColorProses: {
    backgroundColor: '#2196F3',
  },
  btnColorClose: {
    backgroundColor: '#e53935',
  },
  btnColorReject: {
    backgroundColor: '#dc3545',
  },
  btnColorApprove: {
    backgroundColor: '#28a745',
  },
  btnColorTrack: {
    backgroundColor: '#FFC107',
  },
  btnColorSec: {
    backgroundColor: '#6B7280',
  },
  textBlack: {
    color: 'black',
  },
  textBlue: {
    color: '#2196F3',
  },
  textRed: {
    color: '#e53935',
  },
  buttonTextModal: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  marginBtn: {
    marginTop: 10,
  },
  paddingIcon: {
    paddingLeft: 5,
  },
  marginIcon: {
    marginRight: 5,
  },
  borderModal: {
    paddingVertical: 7,
    paddingHorizontal: 7,
    // borderRadius: 8,
    // alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#6B7280',
    marginVertical: 10,
    elevation: 1.5,
  },
  flexBtn: {
    flex: 1,
  },
  txtNotfound: {
    textAlign: 'center',
  },
  pdfControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  overlayModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  popupContainerInfo: {
    width: '95%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 10,
    elevation: 10,
  },
  scrollContentModal: {
    marginBottom: 10,
  },
  sectionInfo: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  sectionTitleInfo: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: 'bold',
  },
  sectionDelete: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDelete: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 5,
  },
  buttonTextCard: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

const mapStateToProps = (state) => ({
  asset: state.asset,
  depo: state.depo,
  mutasi: state.mutasi,
  pengadaan: state.pengadaan,
  disposal: state.disposal,
  stock: state.stock,
  user: state.user,
  tempmail: state.tempmail,
  newnotif: state.newnotif,
  dokumen: state.dokumen,
  auth: state.auth,
});

const mapDispatchToProps = {
  approveDokumen: dokumen.approveDokumen,
  rejectDokumen: dokumen.rejectDokumen,
  getDokumen: dokumen.getDokumen,
  getDocCart: pengadaan.getDocCart,
  getDocumentIo: pengadaan.getDocumentIo,
  uploadDocument: pengadaan.uploadDocument,
  resetError: pengadaan.resetError,
  getDetailMutasi: mutasi.getDetailMutasi,
  getDocumentMut: mutasi.getDocumentMut,
  getDocumentDis: disposal.getDocumentDis,
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalDokumen);
