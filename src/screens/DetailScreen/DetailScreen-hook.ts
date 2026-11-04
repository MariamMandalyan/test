import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import type { RootStackParamList } from '../../navigation/types';

const useDetailScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Detail'>>();
  const item = route.params.item;

  const handleBack = useCallback(() => {
    navigation.navigate('Result');
  }, [navigation]);

  return {
    item,
    handleBack,
  };
};

export default useDetailScreen;
