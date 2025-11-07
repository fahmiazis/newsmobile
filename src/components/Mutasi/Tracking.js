/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { connect } from 'react-redux';
import mutasi from '../../redux/actions/mutasi';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMateri from 'react-native-vector-icons/MaterialIcons';
import IconAwe from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

class TrackingMutasi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      activeStep: null,
      diactiveStep: null,
      animationHeight: new Animated.Value(0),
      steps: [
        {
          id: 1,
          title: 'Submit Mutasi',
          status: 1,
          icon: 'send',
        },
        {
          id: 2,
          title: 'Approval Form Mutasi',
          status: 2,
          icon: 'file-text',
          detail: 'approval',
        },
        {
          id: 3,
          title: 'Verifikasi Budget Mutasi',
          status: 3,
          icon: 'gear',
          detail: [
            { name: 'Proses Ubah Cost Center', status: 3, icon: 'gear'},
            { name: 'Selesai', status: 3, icon: 'check'},
          ],
        },
        {
          id: 4,
          title: 'Eksekusi Mutasi',
          status: 4,
          icon: 'truck',
          detail: [
            { name: 'Check Dokumen Terima Mutasi', status: 4, icon: 'file-text'},
            { name: 'Proses SAP', status: 4, icon: 'gear'},
            { name: 'Selesai', status: 4, icon: 'check'},
          ],
        },
        {
          id: 5,
          title: 'Selesai',
          status: 8,
          icon: 'check',
        },
      ],
      realApp: []
    };
  }

  componentDidMount() {
    const {mutApp} = this.props.mutasi;
    const realApp = mutApp.pembuat !== undefined ? Object.values(mutApp) : [];
    const finalApp = [];
    for (let i = 0; i < realApp.length; i++) {
      const tempApp = [];
      const item = realApp[i];
      for (let j = 0; j < item.length; j++) {
        tempApp.push(item[item.length - (j + 1)]);
      }
      finalApp.push(tempApp);
    }
    this.setState({realApp: finalApp.reverse()});
    console.log(finalApp)
  }

  setActiveStep = (id) => {
    const {activeStep, animationHeight, steps} = this.state;
    const cek = steps.find(item => item.id === id && item.detail !== undefined);
    const {detailMut} = this.props.mutasi;
    const appLength = detailMut[0].appForm !== undefined ? detailMut[0].appForm.length : 1
    const heightLine = cek.detail === 'approval' ? (appLength * 90) : cek.detail.length * 70;

    if (id === activeStep) {
      Animated.timing(animationHeight, {
        toValue: 0,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => {
        this.setState({activeStep: null});
      });
    } else {
      if (activeStep !== null && activeStep !== id) {
        Animated.timing(animationHeight, {
          toValue: 0,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: false,
        }).start(() => {
          this.setState({activeStep: id}, () => {
          Animated.timing(animationHeight, {
              toValue: heightLine, // tinggi detail
              duration: 300,
              easing: Easing.ease,
              useNativeDriver: false,
            }).start();
          });
        });
      } else {
        this.setState({activeStep: id}, () => {
          Animated.timing(animationHeight, {
            toValue: heightLine, // tinggi detail
            duration: 300,
            easing: Easing.ease,
            useNativeDriver: false,
          }).start();
        });
      }
    }
  };

  render() {
    const {visible, steps, activeStep, animationHeight, diactiveStep, realApp} = this.state;
    const { dataMut, noMut, dataDoc, detailMut, statusList} = this.props.mutasi;

    const selectData = detailMut[0];

    const status = parseInt(selectData.status_form);

    const titleApprovals = [
      {
        display: 'Dibuat oleh',
        val: 'pembuat',
      },
      {
        display: 'Diterima oleh',
        val: 'penerima',
      },
      {
        display: 'Disetujui oleh',
        val: 'penyetuju',
      },
      {
        display: 'Diperiksa oleh',
        val: 'pemeriksa',
      },
    ];

    return (
        <View style={styles.modalBackgroundTracking}>
          <View style={styles.modalContainerTracking}>
            <Text style={styles.headerTitleTracking}>Tracking Mutasi</Text>

            <View style={styles.infoBoxTracking}>
              <Text style={styles.infoTextTracking}>
                Area asal: {selectData.area}
              </Text>
              <Text style={styles.infoTextTracking}>
                Area tujuan: {selectData.area_rec}
              </Text>
              <Text style={styles.infoTextTracking}>
                No Mutasi: {selectData.no_mutasi}
              </Text>
              <Text style={styles.infoTextTracking}>
                Tanggal Pengajuan: {moment(selectData.tanggalMut).format('DD MMMM YYYY')}
              </Text>
            </View>
            <ScrollView
              style={{flex: 1}}
              contentContainerStyle={{paddingBottom: 30}}
              nestedScrollEnabled={true}>

              {steps.map((step, index) => {
                const isActive = activeStep === step.id;
                const isLastStep = index === steps.length - 1;

                return (
                  (step.id === 3 && (detailMut.find(item => item.isbudget === 'ya') === undefined)) ? null : (
                  <View key={step.id} style={styles.stepRowTracking}>
                    <View style={styles.iconWrapperTracking}>
                      <TouchableOpacity
                        style={[
                          styles.iconCircleTracking,
                          (status > step.status || status === 8)
                            ? styles.iconDoneTracking
                            : styles.iconPendingTracking,
                        ]}
                        onPress={() => this.setActiveStep(step.id)}
                        disabled={step.detail === undefined}>
                        <IconAwe
                          name={step.icon}
                          size={20}
                          color="#fff"
                        />
                      </TouchableOpacity>

                      {!isLastStep && (
                        <Animated.View
                          style={[
                            styles.verticalLineTracking,
                            (status > steps[index + 1].status || status === 8)
                              ? styles.lineDoneTracking
                              : styles.linePendingTracking,
                            {
                              height: activeStep === step.id
                                ? Animated.add(
                                    new Animated.Value(40),
                                    animationHeight,
                                  )
                                : 40,
                            },
                          ]}
                        />
                      )}
                    </View>
                    <View style={styles.stepTextTracking}>
                      <TouchableOpacity
                        onPress={() => this.setActiveStep(step.id)}
                        disabled={step.detail === undefined}
                      >
                        <Text
                          style={[
                            styles.stepTitleTracking,
                            step.status === 'pending' && {color: '#9e9e9e'},
                          ]}>
                          {step.title}
                        </Text>
                      </TouchableOpacity>
                      {isActive && (
                        <Animated.View
                          style={{
                            height: animationHeight,
                            overflow: 'hidden',
                            marginTop: 20,
                          }}>
                          {step.detail !== undefined ? (step.detail === 'approval' ? (
                            <View style={styles.approvalContainer}>
                              {realApp.length > 0 && realApp.map((section, index) => (
                                <View key={index} style={styles.timelineItem}>
                                  <View style={styles.iconContainer}>
                                    <IconMateri
                                      name={section !== undefined &&
                                        (
                                          section.find(x => x.status === 0) ? 'close'
                                          : section.find(x => x.status === null) ? 'hourglass-top'
                                          : 'check-circle'
                                        )
                                      }
                                      size={24}
                                      style={section !== undefined &&
                                        (
                                          section.find(x => x.status === 0) ? styles.approvalIconFalse
                                          : section.find(x => x.status === null) ? styles.approvalIconWait
                                          : styles.approvalIconTrue
                                        )
                                      }
                                    />
                                  </View>
                                  <View style={styles.timelineContent}>
                                    <Text style={styles.statusTitle}>{titleApprovals.find(x => x.val === section[0].sebagai)?.display}</Text>
                                    <View
                                      style={
                                        [styles.detailBox,
                                          section !== undefined &&
                                          (
                                            section.find(x => x.status === 0) ? styles.approvalCardFalse
                                            : section.find(x => x.status === null) ? styles.approvalCardWait
                                            : styles.approvalCardTrue
                                          ),
                                        ]
                                      }
                                    >
                                      {section.map((item, i) => (
                                        <View key={i} style={styles.detailRow}>
                                          <Text style={styles.detailDate}>{item.status !== null ? moment(item.updatedAt).format('DD MMMM YYYY') : '-'}</Text>
                                          <Text style={styles.detailName}>
                                            {item.status !== null ? item.nama : '-'} {item.status === 0 ? '(Reject)' : item.status === 1 ? '(Approve)' : ''}
                                          </Text>
                                          <Text style={styles.detailRole}>{item.jabatan}</Text>
                                        </View>
                                      ))}
                                    </View>
                                  </View>
                                </View>
                              ))}
                            </View>
                            ) : step.detail.length > 0 && (
                              step.detail.map((item, idx) => {
                                return (
                                  <View key={item.name} style={[styles.stepRowTracking]}>
                                    <View style={styles.iconWrapperTracking}>
                                      <TouchableOpacity
                                        style={[
                                          styles.iconCircleTracking,
                                          (status > step.status || status === 8)
                                            ? styles.iconDoneTracking
                                            : styles.iconPendingTracking,
                                        ]}
                                        disabled>
                                        <IconAwe
                                          name={item.icon}
                                          size={20}
                                          color="#fff"
                                        />
                                      </TouchableOpacity>

                                      {(idx !== (step.detail.length - 1)) && (
                                        <Animated.View
                                          style={[
                                            styles.verticalLineTracking,
                                            (status > steps[index + 1].status || status === 8)
                                              ? styles.lineDoneTracking
                                              : styles.linePendingTracking,
                                            {
                                              height: 20,
                                            },
                                          ]}
                                        />
                                      )}
                                    </View>
                                    <View style={styles.stepTextTracking}>
                                      <Text
                                        style={[
                                          styles.stepTitleTracking,
                                          step.status === 'pending' && {color: '#9e9e9e'},
                                        ]}>
                                        {item.name}
                                      </Text>
                                    </View>
                                  </View>
                                )
                              })
                            )) : (
                              null
                          )}
                        </Animated.View>
                      )}
                    </View>
                  </View>
                  )
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButtonTracking}
              onPress={() => this.props.handleClose()}>
                <Text style={{color: '#fff'}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  modalBackgroundTracking: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end', // modal muncul dari bawah
  },
  modalContainerTracking: {
    width: '100%',
    height: '85%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 15,
  },
  headerTitleTracking: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoBoxTracking: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  infoTextTracking: {
    fontSize: 14,
    marginBottom: 3,
  },
  stepRowTracking: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5,
  },
  iconWrapperTracking: {
    alignItems: 'center',
  },
  iconCircleTracking: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDoneTracking: {
    backgroundColor: '#2196F3',
  },
  iconPendingTracking: {
    backgroundColor: '#9e9e9e',
  },
  verticalLineTracking: {
    width: 3,
    marginTop: 4,
  },
  lineDoneTracking: {
    backgroundColor: '#2196F3',
  },
  linePendingTracking: {
    backgroundColor: '#9e9e9e',
  },
  stepTextTracking: {
    marginLeft: 10,
    flex: 1,
    marginTop: 10,
  },
  stepTitleTracking: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailTextTracking: {
    fontSize: 14,
    color: '#555',
  },
  closeButtonTracking: {
    marginTop: 20,
    backgroundColor: '#e53935',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  childTrack: {
    marginTop: 20,
  },

  //approval
  approvalContainer: {
    padding: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
  },
  timelineContent: {
    flex: 1,
    marginLeft: 10,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailBox: {
    padding: 10,
    borderRadius: 8,
  },
  detailRow: {
    marginBottom: 10,
  },
  detailDate: {
    fontSize: 12,
    color: '#777',
  },
  detailName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailRole: {
    fontSize: 12,
    color: '#555',
  },
  approvalIconTrue: {
    color: '#4caf50',
  },
  approvalIconFalse: {
    color: '#e53935',
  },
  approvalIconWait: {
    color: '#fb8c00',
  },
  approvalCardTrue: {
    backgroundColor: '#e3f2fd',
  },
  approvalCardFalse: {
    backgroundColor: '#fce4ec',
  },
  approvalCardWait: {
    backgroundColor: '#fff3e0',
  },
});

const mapStateToProps = state => ({
    asset: state.asset,
    depo: state.depo,
    mutasi: state.mutasi,
    user: state.user,
    tempmail: state.tempmail,
    newnotif: state.newnotif,
    dokumen: state.dokumen,
    auth: state.auth,
});

export default connect(mapStateToProps)(TrackingMutasi);
