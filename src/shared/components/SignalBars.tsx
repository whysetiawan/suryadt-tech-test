import { View } from 'react-native';

const SignalBars = ({ bars }: { bars: number }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      {Array.from({ length: 4 }).map((_, index) => (
        <View
          key={index}
          style={{
            width: 5,
            height: (index + 1) * 5,
            backgroundColor: index < bars ? 'green' : 'gray',
            margin: 1,
          }}
        />
      ))}
    </View>
  );
};

export default SignalBars;
