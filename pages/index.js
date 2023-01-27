import 'raf/polyfill'
if (!global._frameTimestamp) {
  global._frameTimestamp = null
}

import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

export default function Home() {
  const sv = useSharedValue(1)
  //

  const dv = useDerivedValue(() => (sv.value == 1 ? 0 : 20), [sv])
  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: withTiming(sv.value),
      transform: [
        {
          rotate: withTiming(`${dv.value}deg`),
        },
      ],
    }),
    [sv, dv]
  )

  useAnimatedReaction(
    () => {
      console.log('will react', sv.value)
      return sv.value
    },
    (next, prev) => {
      console.log('reaction', next, prev)
    },
    [sv]
  )
  return (
    <Animated.View
      onMouseEnter={() => {
        sv.value = 0.7
      }}
      onMouseLeave={() => {
        sv.value = 1
      }}
      style={[
        {
          height: 100,
          width: 100,
          backgroundColor: '#111',
          margin: 20,
          borderRadius: 16,
        },
        animatedStyle,
      ]}
    />
  )
}
