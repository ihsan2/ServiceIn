import React from 'react';
import {View} from 'react-native';
import Text from '../text';
import * as colors from '../../styles/colors';
import {MCI} from '../../assets/icons';
import moment from 'moment';

const step = ({item, index, data, status, item1}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <View style={{}}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              backgroundColor: item.active
                ? '#fff'
                : item.done
                ? item.clr
                : '#aeaeae',
              alignSelf: 'flex-start',
              width: 50,
              height: 50,
              borderRadius: 50 / 2,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: item.active ? 3 : 0,
              borderColor: item.clr,
            }}>
            {item?.done ? (
              <MCI
                name={
                  status == 'cancel' && data.length - 1 === index
                    ? 'close'
                    : 'check'
                }
                size={24}
                color={'#fff'}
              />
            ) : (
              <Text
                bold
                style={{color: item.active ? '#000' : '#fff'}}
                size={18}>
                {index + 1}
              </Text>
            )}
          </View>
          <View style={{marginLeft: 15, alignSelf: 'center'}}>
            <Text
              style={{
                color: item.active ? item.clr : item.done ? '#000' : '#aeaeae',
                marginRight: 80,
              }}
              bold>
              {item.title}
            </Text>
            {status === 'process' && index === 2 && (
              <View
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <MCI name={'clock-outline'} size={16} />
                <Text
                  style={{
                    color: '#000',
                    marginLeft: 5,
                    marginRight: 80,
                  }}>
                  Est. Waktu Selesai:{' '}
                  {moment(item1.start).format('DD MMM YYYY')} -{' '}
                  {moment(item1.end).format('DD MMM YYYY')}
                </Text>
              </View>
            )}
            {status === 'cancel' && index === 1 && (
              <View
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <MCI name={'note-text-outline'} size={16} />
                <Text
                  style={{
                    color: '#000',
                    marginLeft: 5,
                    marginRight: 80,
                  }}>
                  Alasan penolakan: {item1.reason}
                </Text>
              </View>
            )}

            {status === 'complete' && index === 3 && (
              <View
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <MCI name={'note-text-outline'} size={16} />
                <Text
                  style={{
                    color: '#000',
                    marginLeft: 5,
                    marginRight: 80,
                  }}>
                  Masa Garansi: 1 Bulan
                </Text>
              </View>
            )}
          </View>
        </View>
        {data.length - 1 === index ? null : (
          <View
            style={{
              backgroundColor: !item.done ? '#aeaeae' : item.clr,
              height: 50,
              width: 2,
              marginLeft: 25,
            }}
          />
        )}
      </View>
    </View>
  );
};

export default step;
