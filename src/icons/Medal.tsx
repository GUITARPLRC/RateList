import { Svg, Path, Circle } from "react-native-svg"

export default ({ size, color }: { size: number; color: string }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Circle cx="12" cy="8" r="6" />
    <Path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </Svg>
)
